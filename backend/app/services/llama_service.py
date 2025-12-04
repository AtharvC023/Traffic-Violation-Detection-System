import httpx
import base64
import asyncio
from typing import Dict, Any, Optional, List
from loguru import logger
import cv2
import numpy as np
from PIL import Image
import io

from app.core.config import settings
from app.models.violation import ViolationType, ViolationSeverity

class LlamaVisionService:
    """Llama 4 Maverick Vision AI Service for traffic violation detection"""
    
    def __init__(self):
        self.api_key = settings.LLAMA_API_KEY
        self.api_url = settings.LLAMA_API_URL
        self.client = httpx.AsyncClient(timeout=30.0)
        
    async def analyze_image(self, image_data: bytes, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Analyze image using Llama 4 Maverick for traffic violations
        
        Args:
            image_data: Raw image bytes
            context: Additional context (camera location, time, etc.)
            
        Returns:
            Analysis results with detected violations
        """
        try:
            # Encode image to base64
            base64_image = base64.b64encode(image_data).decode('utf-8')
            
            # Prepare the prompt for traffic violation detection
            prompt = self._build_analysis_prompt(context)
            
            payload = {
                "model": "llama-3.2-90b-vision-preview",
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{base64_image}",
                                    "detail": "high"
                                }
                            }
                        ]
                    }
                ],
                "max_tokens": 1000,
                "temperature": 0.1
            }
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            response = await self.client.post(
                f"{self.api_url}/chat/completions",
                json=payload,
                headers=headers
            )
            
            if response.status_code == 200:
                result = response.json()
                return await self._parse_llama_response(result, image_data)
            else:
                logger.error(f"Llama API error: {response.status_code} - {response.text}")
                return {"error": f"API error: {response.status_code}"}
                
        except Exception as e:
            logger.error(f"Error in Llama vision analysis: {str(e)}")
            return {"error": str(e)}
    
    def _build_analysis_prompt(self, context: Dict[str, Any] = None) -> str:
        """Build analysis prompt for traffic violation detection"""
        
        base_prompt = """
        You are an advanced traffic violation detection AI. Analyze this traffic camera image and identify any violations.
        
        Look for these specific violations:
        1. RED LIGHT VIOLATIONS: Vehicles crossing intersection during red light
        2. SPEEDING: Visual indicators of excessive speed (motion blur, position relative to speed limits)
        3. NO HELMET: Motorcyclists/cyclists without helmets
        4. WRONG LANE: Vehicles in incorrect lanes or illegal lane changes
        5. NO SEATBELT: Visible drivers/passengers not wearing seatbelts
        6. MOBILE USE: Drivers using mobile phones while driving
        7. ILLEGAL PARKING: Vehicles parked in prohibited areas
        8. OTHER: Any other traffic violations visible
        
        For each detected violation, provide:
        - Violation type
        - Severity (low/medium/high/critical)
        - Confidence score (0-1)
        - Location in image (bounding box coordinates if possible)
        - License plate number if visible
        - Vehicle details (type, color)
        - Description of the violation
        
        Respond in JSON format:
        {
            "violations": [
                {
                    "type": "violation_type",
                    "severity": "severity_level",
                    "confidence": 0.95,
                    "license_plate": "ABC123",
                    "vehicle_type": "car",
                    "vehicle_color": "red",
                    "description": "detailed description",
                    "bounding_box": [x1, y1, x2, y2],
                    "evidence_points": ["point1", "point2"]
                }
            ],
            "scene_analysis": {
                "weather": "clear/rainy/foggy",
                "lighting": "day/night/dawn/dusk",
                "traffic_density": "low/medium/high",
                "road_conditions": "good/poor",
                "visibility": "excellent/good/poor"
            },
            "overall_confidence": 0.92
        }
        """
        
        if context:
            location = context.get('location', 'Unknown')
            camera_type = context.get('camera_type', 'general')
            base_prompt += f"\n\nContext: Location: {location}, Camera Type: {camera_type}"
        
        return base_prompt
    
    async def _parse_llama_response(self, response: Dict[str, Any], image_data: bytes) -> Dict[str, Any]:
        """Parse Llama API response and structure the results"""
        try:
            content = response['choices'][0]['message']['content']
            
            # Try to extract JSON from the response
            import json
            import re
            
            # Look for JSON in the response
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                analysis_data = json.loads(json_match.group())
            else:
                # Fallback parsing if JSON not found
                analysis_data = {"violations": [], "scene_analysis": {}}
            
            # Enhance with image metadata
            image_info = await self._extract_image_metadata(image_data)
            
            return {
                "service": "llama-4-maverick",
                "analysis": analysis_data,
                "image_metadata": image_info,
                "processing_time": response.get('usage', {}).get('total_tokens', 0)
            }
            
        except Exception as e:
            logger.error(f"Error parsing Llama response: {str(e)}")
            return {
                "service": "llama-4-maverick",
                "error": str(e),
                "raw_response": response
            }
    
    async def _extract_image_metadata(self, image_data: bytes) -> Dict[str, Any]:
        """Extract metadata from image"""
        try:
            image = Image.open(io.BytesIO(image_data))
            return {
                "width": image.width,
                "height": image.height,
                "format": image.format,
                "mode": image.mode,
                "size_bytes": len(image_data)
            }
        except Exception as e:
            logger.error(f"Error extracting image metadata: {str(e)}")
            return {}
    
    async def batch_analyze(self, images: List[bytes], contexts: List[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """Analyze multiple images in batch"""
        if contexts is None:
            contexts = [{}] * len(images)
        
        tasks = [
            self.analyze_image(image, context)
            for image, context in zip(images, contexts)
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Handle any exceptions
        processed_results = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                processed_results.append({
                    "error": str(result),
                    "image_index": i
                })
            else:
                processed_results.append(result)
        
        return processed_results
    
    async def __aenter__(self):
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.client.aclose()