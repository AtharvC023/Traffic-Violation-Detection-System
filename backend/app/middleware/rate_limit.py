from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp
import time
import redis
from typing import Dict, Any
from loguru import logger

from app.core.config import settings

class RateLimitMiddleware(BaseHTTPMiddleware):
    """Rate limiting middleware using Redis"""
    
    def __init__(self, app: ASGIApp):
        super().__init__(app)
        # Disable Redis rate limiting for now to prevent connection errors
        logger.info("Rate limiting disabled - using development mode")
        self.redis_client = None
    
    async def dispatch(self, request: Request, call_next) -> Response:
        if not self.redis_client:
            return await call_next(request)
        
        try:
            # Get client IP
            client_ip = self._get_client_ip(request)
            
            # Skip rate limiting for health checks and static files
            if self._should_skip_rate_limit(request.url.path):
                return await call_next(request)
            
            # Check rate limit
            if await self._is_rate_limited(client_ip):
                return JSONResponse(
                    status_code=429,
                    content={
                        "detail": "Rate limit exceeded. Please try again later.",
                        "retry_after": 60
                    },
                    headers={"Retry-After": "60"}
                )
            
            # Process request
            response = await call_next(request)
            
            # Record request
            await self._record_request(client_ip)
            
            return response
            
        except Exception as e:
            logger.error(f"Rate limiting error: {e}")
            # Continue without rate limiting if there's an error
            return await call_next(request)
    
    def _get_client_ip(self, request: Request) -> str:
        """Get client IP address from request"""
        # Check for forwarded headers first
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
        
        # Fallback to direct client IP
        if hasattr(request, "client") and request.client:
            return request.client.host
        
        return "unknown"
    
    def _should_skip_rate_limit(self, path: str) -> bool:
        """Check if path should skip rate limiting"""
        skip_paths = ["/health", "/docs", "/openapi.json", "/uploads/"]
        return any(path.startswith(skip_path) for skip_path in skip_paths)
    
    async def _is_rate_limited(self, client_ip: str) -> bool:
        """Check if client is rate limited"""
        try:
            key = f"rate_limit:{client_ip}"
            current_requests = self.redis_client.get(key)
            
            if current_requests is None:
                return False
            
            return int(current_requests) >= settings.RATE_LIMIT_PER_MINUTE
            
        except Exception as e:
            logger.error(f"Rate limit check error: {e}")
            return False
    
    async def _record_request(self, client_ip: str) -> None:
        """Record a request for the client IP"""
        try:
            key = f"rate_limit:{client_ip}"
            pipe = self.redis_client.pipeline()
            pipe.incr(key)
            pipe.expire(key, 60)  # Expire after 1 minute
            pipe.execute()
            
        except Exception as e:
            logger.error(f"Request recording error: {e}")