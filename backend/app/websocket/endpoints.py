from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException, status
from typing import Dict, Any, Optional
from datetime import datetime
from loguru import logger
import json

from app.websocket.manager import websocket_manager
from app.core.auth import verify_token
from app.models.user import User

router = APIRouter()

@router.websocket("/live-feed")
async def websocket_live_feed(websocket: WebSocket):
    """
    WebSocket endpoint for live camera feeds
    """
    await _handle_websocket_connection(websocket, "live_feed")

@router.websocket("/violations")
async def websocket_violations(websocket: WebSocket):
    """
    WebSocket endpoint for real-time violation notifications
    """
    await _handle_websocket_connection(websocket, "violations")

@router.websocket("/system-status")
async def websocket_system_status(websocket: WebSocket):
    """
    WebSocket endpoint for system status updates
    """
    await _handle_websocket_connection(websocket, "system_status")

@router.websocket("/analytics")
async def websocket_analytics(websocket: WebSocket):
    """
    WebSocket endpoint for real-time analytics updates
    """
    await _handle_websocket_connection(websocket, "analytics")

async def _handle_websocket_connection(websocket: WebSocket, connection_type: str):
    """Handle WebSocket connection with authentication and message processing"""
    
    user_id = None
    
    try:
        # Get authentication token from query parameters
        token = websocket.query_params.get("token")
        
        if token:
            try:
                # Verify token and get user info
                payload = verify_token(token)
                user_id = payload.get("sub")
            except Exception as e:
                await websocket.close(code=4003, reason="Authentication failed")
                return
        
        # Connect to WebSocket manager
        connected = await websocket_manager.connect(websocket, connection_type, user_id)
        
        if not connected:
            return  # Connection was rejected and closed
        
        # Handle incoming messages
        while True:
            try:
                # Receive message from client
                data = await websocket.receive_text()
                message = json.loads(data)
                
                # Process message based on type
                await _process_websocket_message(websocket, connection_type, message, user_id)
                
            except WebSocketDisconnect:
                break
            except json.JSONDecodeError:
                await websocket.send_json({
                    "type": "error",
                    "message": "Invalid JSON format"
                })
            except Exception as e:
                logger.error(f"WebSocket message processing error: {e}")
                await websocket.send_json({
                    "type": "error",
                    "message": "Message processing failed"
                })
    
    except WebSocketDisconnect:
        pass
    except Exception as e:
        logger.error(f"WebSocket connection error: {e}")
    finally:
        # Ensure cleanup
        await websocket_manager.disconnect(websocket, connection_type)

async def _process_websocket_message(
    websocket: WebSocket, 
    connection_type: str, 
    message: Dict[str, Any],
    user_id: Optional[str]
):
    """Process incoming WebSocket messages"""
    
    message_type = message.get("type")
    
    if message_type == "ping":
        # Respond to ping with pong
        await websocket.send_json({
            "type": "pong",
            "data": message.get("data")
        })
        
    elif message_type == "subscribe":
        # Handle subscription requests
        channels = message.get("channels", [])
        
        # Validate channels based on connection type
        valid_channels = _get_valid_channels(connection_type)
        invalid_channels = [ch for ch in channels if ch not in valid_channels]
        
        if invalid_channels:
            await websocket.send_json({
                "type": "error",
                "message": f"Invalid channels: {invalid_channels}"
            })
        else:
            # Store subscription preferences in connection info
            if websocket in websocket_manager.connection_info:
                websocket_manager.connection_info[websocket]["subscriptions"] = channels
            
            await websocket.send_json({
                "type": "subscription_confirmed",
                "channels": channels
            })
    
    elif message_type == "heartbeat":
        # Update last heartbeat time
        if websocket in websocket_manager.connection_info:
            websocket_manager.connection_info[websocket]["last_heartbeat"] = datetime.utcnow()
        
        await websocket.send_json({
            "type": "heartbeat_ack"
        })
    
    elif message_type == "request_data":
        # Handle data requests
        await _handle_data_request(websocket, connection_type, message, user_id)
    
    else:
        await websocket.send_json({
            "type": "error",
            "message": f"Unknown message type: {message_type}"
        })

def _get_valid_channels(connection_type: str) -> list:
    """Get valid channels for a connection type"""
    
    channels_map = {
        "live_feed": ["camera_feeds", "camera_status", "feed_quality"],
        "violations": ["new_violations", "violation_updates", "violation_alerts"],
        "system_status": ["camera_health", "system_metrics", "alerts"],
        "analytics": ["real_time_stats", "trend_updates", "performance_metrics"]
    }
    
    return channels_map.get(connection_type, [])

async def _handle_data_request(
    websocket: WebSocket, 
    connection_type: str, 
    message: Dict[str, Any],
    user_id: Optional[str]
):
    """Handle data requests from clients"""
    
    request_type = message.get("request_type")
    
    if connection_type == "live_feed" and request_type == "camera_list":
        # TODO: Get camera list from database
        await websocket.send_json({
            "type": "data_response",
            "request_type": "camera_list",
            "data": []  # Placeholder
        })
    
    elif connection_type == "violations" and request_type == "recent_violations":
        # TODO: Get recent violations from database
        await websocket.send_json({
            "type": "data_response",
            "request_type": "recent_violations",
            "data": []  # Placeholder
        })
    
    elif connection_type == "system_status" and request_type == "current_status":
        # Get current system status
        stats = websocket_manager.get_stats()
        await websocket.send_json({
            "type": "data_response",
            "request_type": "current_status",
            "data": stats
        })
    
    elif connection_type == "analytics" and request_type == "live_metrics":
        # TODO: Get live metrics from database
        await websocket.send_json({
            "type": "data_response",
            "request_type": "live_metrics",
            "data": {}  # Placeholder
        })
    
    else:
        await websocket.send_json({
            "type": "error",
            "message": f"Unsupported request: {request_type}"
        })

# Helper functions for broadcasting updates
async def broadcast_new_violation(violation_data: Dict[str, Any]):
    """Broadcast new violation to connected clients"""
    message = {
        "type": "new_violation",
        "data": violation_data
    }
    await websocket_manager.broadcast_to_type("violations", message)

async def broadcast_camera_status_update(camera_data: Dict[str, Any]):
    """Broadcast camera status update"""
    message = {
        "type": "camera_status_update",
        "data": camera_data
    }
    await websocket_manager.broadcast_to_type("live_feed", message)
    await websocket_manager.broadcast_to_type("system_status", message)

async def broadcast_system_alert(alert_data: Dict[str, Any]):
    """Broadcast system alert"""
    message = {
        "type": "system_alert",
        "data": alert_data
    }
    await websocket_manager.broadcast_to_type("system_status", message)

async def broadcast_analytics_update(analytics_data: Dict[str, Any]):
    """Broadcast analytics update"""
    message = {
        "type": "analytics_update",
        "data": analytics_data
    }
    await websocket_manager.broadcast_to_type("analytics", message)