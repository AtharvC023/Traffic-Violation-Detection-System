import httpx
import base64
import asyncio
from typing import Dict, Any, Optional, List
from loguru import logger
import cv2
import numpy as np
from PIL import Image
import io
import json

from app.core.config import settings
from app.models.violation import ViolationType, ViolationSeverity

class GPT4oVisionService:
    """GPT-4o Vision Service for advanced traffic violation analysis and reporting"""
    
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        self.client = httpx.AsyncClient(timeout=45.0)
        
    async def analyze_violation(self, image_data: bytes, violation_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Advanced analysis using GPT-4o for violation verification and detailed reporting
        
        Args:
            image_data: Raw image bytes
            violation_data: Initial violation detection results from Llama
            
        Returns:
            Enhanced analysis with detailed report and recommendations
        """
        try:
            base64_image = base64.b64encode(image_data).decode('utf-8')
            
            # Build context-aware prompt
            prompt = self._build_verification_prompt(violation_data)
            
            payload = {
                "model": "gpt-4o",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are an expert traffic violation analyst with deep knowledge of traffic laws and enforcement procedures. Provide detailed, accurate analysis of traffic violations."
                    },
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
                "max_tokens": 1500,
                "temperature": 0.1
            }
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            response = await self.client.post(
                "https://api.openai.com/v1/chat/completions",
                json=payload,
                headers=headers
            )
            
            if response.status_code == 200:
                result = response.json()
                return await self._parse_gpt4o_response(result, violation_data)
            else:
                logger.error(f"GPT-4o API error: {response.status_code} - {response.text}")
                return {"error": f"API error: {response.status_code}"}
                
        except Exception as e:
            logger.error(f"Error in GPT-4o analysis: {str(e)}")
            return {"error": str(e)}
    
    async def generate_violation_report(self, violation_data: Dict[str, Any], analysis_results: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate comprehensive violation report using GPT-4o
        
        Args:
            violation_data: Violation information
            analysis_results: Combined analysis from multiple sources
            
        Returns:
            Detailed violation report with legal context
        """
        try:
            prompt = f"""
            Generate a comprehensive traffic violation report based on the following data:
            
            Violation Data: {json.dumps(violation_data, indent=2)}
            Analysis Results: {json.dumps(analysis_results, indent=2)}
            
            Create a professional report including:
            1. Executive Summary
            2. Violation Details
            3. Evidence Analysis
            4. Legal Context and Applicable Laws
            5. Recommended Actions
            6. Fine Calculation
            7. Appeal Process Information
            
            Format as JSON with the following structure:
            {{
                "report_id": "unique_identifier",
                "executive_summary": "brief overview",
                "violation_details": {{
                    "type": "violation_type",
                    "severity": "severity_level",
                    "location": "specific_location",
                    "timestamp": "date_time",
                    "weather_conditions": "conditions",
                    "evidence_quality": "rating"
                }},
                "evidence_analysis": {{
                    "primary_evidence": "description",
                    "supporting_evidence": ["list", "of", "evidence"],
                    "reliability_score": 0.95,
                    "technical_notes": "detailed_analysis"
                }},
                "legal_context": {{
                    "applicable_laws": ["law1", "law2"],
                    "violation_code": "specific_code",
                    "precedent_cases": "if_any",
                    "jurisdiction": "local_authority"
                }},
                "recommendations": {{
                    "enforcement_action": "recommended_action",
                    "fine_amount": 150.00,
                    "penalty_points": 3,
                    "additional_requirements": ["requirement1", "requirement2"]
                }},
                "appeal_information": {{
                    "appeal_deadline": "30_days",
                    "appeal_process": "description",
                    "required_documentation": ["doc1", "doc2"]
                }},
                "quality_assurance": {{
                    "reviewer_notes": "qa_notes",
                    "confidence_level": "high",
                    "requires_human_review": false
                }}
            }}
            """
            
            payload = {
                "model": "gpt-4o",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a legal expert specializing in traffic law enforcement. Generate accurate, comprehensive violation reports."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "max_tokens": 2000,
                "temperature": 0.1
            }
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            response = await self.client.post(
                "https://api.openai.com/v1/chat/completions",
                json=payload,
                headers=headers
            )
            
            if response.status_code == 200:
                result = response.json()
                return self._parse_report_response(result)
            else:
                logger.error(f"GPT-4o report generation error: {response.status_code}")
                return {"error": "Failed to generate report"}
                
        except Exception as e:
            logger.error(f"Error generating violation report: {str(e)}")
            return {"error": str(e)}
    
    def _build_verification_prompt(self, violation_data: Dict[str, Any]) -> str:
        """Build verification prompt based on initial violation detection"""
        
        base_prompt = f"""
        Please verify and enhance the following traffic violation detection:
        
        Initial Detection Results:
        {json.dumps(violation_data, indent=2)}
        
        Please provide:
        
        1. VERIFICATION: Confirm or refute each detected violation with detailed reasoning
        2. ENHANCEMENT: Add any missed violations or details
        3. ACCURACY ASSESSMENT: Rate the accuracy of license plate reading (if any)
        4. CONTEXTUAL ANALYSIS: 
           - Traffic flow patterns visible
           - Road signage and markings
           - Environmental factors affecting visibility
           - Potential mitigating circumstances
        5. EVIDENCE QUALITY: Rate the quality of evidence for legal proceedings
        6. RECOMMENDATIONS:
           - Whether citation should be issued
           - Required additional evidence
           - Suggested follow-up actions
        
        Respond in JSON format:
        {{
            "verification": {{
                "confirmed_violations": [list_of_confirmed_violations],
                "disputed_violations": [list_with_reasons],
                "additional_violations": [any_missed_violations]
            }},
            "accuracy_assessment": {{
                "license_plate_accuracy": 0.95,
                "vehicle_identification_accuracy": 0.90,
                "violation_detection_accuracy": 0.88
            }},
            "contextual_analysis": {{
                "traffic_conditions": "description",
                "visibility_factors": "assessment",
                "mitigating_circumstances": "if_any",
                "road_infrastructure": "condition_assessment"
            }},
            "evidence_quality": {{
                "overall_quality": "excellent/good/fair/poor",
                "admissibility_rating": 0.92,
                "required_enhancements": ["if_any"],
                "legal_sufficiency": "assessment"
            }},
            "recommendations": {{
                "issue_citation": true/false,
                "confidence_level": "high/medium/low",
                "additional_evidence_needed": ["requirements"],
                "escalation_required": false,
                "human_review_recommended": false
            }}
        }}
        """
        
        return base_prompt
    
    async def _parse_gpt4o_response(self, response: Dict[str, Any], original_data: Dict[str, Any]) -> Dict[str, Any]:
        """Parse GPT-4o response and combine with original data"""
        try:
            content = response['choices'][0]['message']['content']
            
            # Extract JSON from response
            import re
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                analysis_data = json.loads(json_match.group())
            else:
                analysis_data = {"error": "Could not parse JSON response"}
            
            return {
                "service": "gpt-4o",
                "analysis": analysis_data,
                "original_detection": original_data,
                "tokens_used": response.get('usage', {}).get('total_tokens', 0),
                "model": response.get('model', 'gpt-4o')
            }
            
        except Exception as e:
            logger.error(f"Error parsing GPT-4o response: {str(e)}")
            return {
                "service": "gpt-4o",
                "error": str(e),
                "raw_response": content if 'content' in locals() else str(response)
            }
    
    def _parse_report_response(self, response: Dict[str, Any]) -> Dict[str, Any]:
        """Parse report generation response"""
        try:
            content = response['choices'][0]['message']['content']
            
            # Extract JSON from response
            import re
            json_match = re.search(r'\{.*\}', content, re.DOTALL)
            if json_match:
                report_data = json.loads(json_match.group())
                return {
                    "status": "success",
                    "report": report_data,
                    "generated_at": datetime.utcnow().isoformat(),
                    "tokens_used": response.get('usage', {}).get('total_tokens', 0)
                }
            else:
                return {"status": "error", "message": "Could not parse report JSON"}
                
        except Exception as e:
            logger.error(f"Error parsing report response: {str(e)}")
            return {"status": "error", "message": str(e)}
    
    async def analyze_scene_context(self, image_data: bytes, location_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze scene context for better violation understanding
        """
        try:
            base64_image = base64.b64encode(image_data).decode('utf-8')
            
            prompt = f"""
            Analyze this traffic scene image for contextual information that might affect violation detection and enforcement:
            
            Location Information: {json.dumps(location_data, indent=2)}
            
            Provide detailed analysis of:
            1. Environmental conditions (weather, lighting, visibility)
            2. Road infrastructure (signs, markings, traffic lights)
            3. Traffic density and flow patterns
            4. Potential safety hazards or unusual conditions
            5. Factors that might affect driver behavior
            6. Quality and clarity of surveillance footage
            
            Format response as JSON with detailed observations.
            """
            
            payload = {
                "model": "gpt-4o",
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
                "temperature": 0.2
            }
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            response = await self.client.post(
                "https://api.openai.com/v1/chat/completions",
                json=payload,
                headers=headers
            )
            
            if response.status_code == 200:
                result = response.json()
                content = result['choices'][0]['message']['content']
                return {"status": "success", "context_analysis": content}
            else:
                return {"status": "error", "message": "Failed to analyze scene context"}
                
        except Exception as e:
            logger.error(f"Error in scene context analysis: {str(e)}")
            return {"status": "error", "message": str(e)}
    
    async def __aenter__(self):
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.client.aclose()