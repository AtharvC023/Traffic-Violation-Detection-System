import asyncio
import json
from typing import Dict, Set, List, Optional, Any
from datetime import datetime
from fastapi import WebSocket, WebSocketDisconnect
from loguru import logger
import uuid

class WebSocketManager:
    """Manages WebSocket connections for real-time communication"""
    
    def __init__(self):
        # Active connections grouped by connection type
        self.connections: Dict[str, Set[WebSocket]] = {
            "live_feed": set(),
            "violations": set(),
            "system_status": set(),
            "analytics": set()
        }
        
        # Connection metadata
        self.connection_info: Dict[WebSocket, Dict[str, Any]] = {}
        
        # Background tasks
        self._heartbeat_task: Optional[asyncio.Task] = None
        self._cleanup_task: Optional[asyncio.Task] = None
        
    async def initialize(self):
        """Initialize WebSocket manager and start background tasks"""
        logger.info("Initializing WebSocket manager")
        
        # Start background tasks
        self._heartbeat_task = asyncio.create_task(self._heartbeat_loop())
        self._cleanup_task = asyncio.create_task(self._cleanup_loop())
        
    async def cleanup(self):
        """Cleanup WebSocket manager and stop background tasks"""
        logger.info("Cleaning up WebSocket manager")
        
        # Cancel background tasks
        if self._heartbeat_task:
            self._heartbeat_task.cancel()
        if self._cleanup_task:
            self._cleanup_task.cancel()
        
        # Close all connections
        for connection_type, connections in self.connections.items():
            for websocket in connections.copy():
                await self.disconnect(websocket, connection_type)
    
    async def connect(self, websocket: WebSocket, connection_type: str, user_id: str = None) -> bool:
        """Accept and register a WebSocket connection"""
        try:
            await websocket.accept()
            
            # Validate connection type
            if connection_type not in self.connections:
                await websocket.close(code=4000, reason="Invalid connection type")
                return False
            
            # Check connection limit
            if len(self.connections[connection_type]) >= 100:  # Max connections per type
                await websocket.close(code=4001, reason="Connection limit exceeded")
                return False
            
            # Register connection
            self.connections[connection_type].add(websocket)
            
            # Store connection metadata
            self.connection_info[websocket] = {
                "connection_id": str(uuid.uuid4()),
                "connection_type": connection_type,
                "user_id": user_id,
                "connected_at": datetime.utcnow(),
                "last_heartbeat": datetime.utcnow()
            }
            
            logger.info(
                f"WebSocket connected: {connection_type} | "
                f"User: {user_id} | "
                f"Total: {len(self.connections[connection_type])}"
            )
            
            # Send welcome message
            await self._send_to_websocket(websocket, {
                "type": "connection",
                "status": "connected",
                "connection_id": self.connection_info[websocket]["connection_id"],
                "server_time": datetime.utcnow().isoformat()
            })
            
            return True
            
        except Exception as e:
            logger.error(f"WebSocket connection error: {e}")
            return False
    
    async def disconnect(self, websocket: WebSocket, connection_type: str):
        """Remove a WebSocket connection"""
        try:
            # Remove from connections
            if connection_type in self.connections:
                self.connections[connection_type].discard(websocket)
            
            # Remove metadata
            connection_info = self.connection_info.pop(websocket, {})
            
            logger.info(
                f"WebSocket disconnected: {connection_type} | "
                f"ID: {connection_info.get('connection_id')} | "
                f"Total: {len(self.connections.get(connection_type, []))}"
            )
            
            # Close connection if still open
            if websocket.client_state.name != "DISCONNECTED":
                await websocket.close()
                
        except Exception as e:
            logger.error(f"WebSocket disconnect error: {e}")
    
    async def broadcast_to_type(self, connection_type: str, message: Dict[str, Any]):
        """Broadcast message to all connections of a specific type"""
        if connection_type not in self.connections:
            return
        
        connections = self.connections[connection_type].copy()
        if not connections:
            return
        
        message_json = json.dumps(message, default=str)
        
        # Send to all connections concurrently
        tasks = []
        for websocket in connections:
            task = asyncio.create_task(self._send_to_websocket(websocket, message))
            tasks.append(task)
        
        # Wait for all sends to complete
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Log any failures
        failed_count = sum(1 for result in results if isinstance(result, Exception))
        if failed_count > 0:
            logger.warning(f"Failed to send message to {failed_count} connections")
    
    async def send_to_user(self, user_id: str, message: Dict[str, Any]):
        """Send message to all connections for a specific user"""
        user_connections = [
            ws for ws, info in self.connection_info.items()
            if info.get("user_id") == user_id
        ]
        
        if not user_connections:
            return
        
        # Send to all user connections
        tasks = []
        for websocket in user_connections:
            task = asyncio.create_task(self._send_to_websocket(websocket, message))
            tasks.append(task)
        
        await asyncio.gather(*tasks, return_exceptions=True)
    
    async def _send_to_websocket(self, websocket: WebSocket, message: Dict[str, Any]):
        """Send message to a specific WebSocket connection"""
        try:
            # Add timestamp to message
            message["timestamp"] = datetime.utcnow().isoformat()
            
            await websocket.send_json(message)
            
        except WebSocketDisconnect:
            # Connection closed by client, remove it
            await self._remove_disconnected_websocket(websocket)
        except Exception as e:
            logger.error(f"Failed to send WebSocket message: {e}")
            await self._remove_disconnected_websocket(websocket)
    
    async def _remove_disconnected_websocket(self, websocket: WebSocket):
        """Remove a disconnected WebSocket from all connection groups"""
        connection_info = self.connection_info.get(websocket, {})
        connection_type = connection_info.get("connection_type")
        
        if connection_type:
            await self.disconnect(websocket, connection_type)
    
    async def _heartbeat_loop(self):
        """Send periodic heartbeat messages to maintain connections"""
        try:
            while True:
                await asyncio.sleep(30)  # Send heartbeat every 30 seconds
                
                heartbeat_message = {
                    "type": "heartbeat",
                    "server_time": datetime.utcnow().isoformat()
                }
                
                # Send heartbeat to all connection types
                for connection_type in self.connections:
                    await self.broadcast_to_type(connection_type, heartbeat_message)
                
        except asyncio.CancelledError:
            logger.info("WebSocket heartbeat loop cancelled")
        except Exception as e:
            logger.error(f"WebSocket heartbeat error: {e}")
    
    async def _cleanup_loop(self):
        """Periodically clean up dead connections"""
        try:
            while True:
                await asyncio.sleep(60)  # Clean up every minute
                
                now = datetime.utcnow()
                stale_connections = []
                
                # Find stale connections (no heartbeat for 5 minutes)
                for websocket, info in self.connection_info.items():
                    last_heartbeat = info.get("last_heartbeat", info["connected_at"])
                    if (now - last_heartbeat).total_seconds() > 300:
                        stale_connections.append(websocket)
                
                # Remove stale connections
                for websocket in stale_connections:
                    connection_info = self.connection_info.get(websocket, {})
                    connection_type = connection_info.get("connection_type")
                    if connection_type:
                        await self.disconnect(websocket, connection_type)
                
                if stale_connections:
                    logger.info(f"Cleaned up {len(stale_connections)} stale WebSocket connections")
                
        except asyncio.CancelledError:
            logger.info("WebSocket cleanup loop cancelled")
        except Exception as e:
            logger.error(f"WebSocket cleanup error: {e}")
    
    def get_stats(self) -> Dict[str, Any]:
        """Get WebSocket connection statistics"""
        stats = {
            "total_connections": sum(len(connections) for connections in self.connections.values()),
            "connections_by_type": {
                conn_type: len(connections) 
                for conn_type, connections in self.connections.items()
            },
            "active_users": len(set(
                info.get("user_id") 
                for info in self.connection_info.values() 
                if info.get("user_id")
            ))
        }
        return stats

# Global WebSocket manager instance
websocket_manager = WebSocketManager()