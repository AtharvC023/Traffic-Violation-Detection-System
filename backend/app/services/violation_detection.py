import asyncio
import cv2
import numpy as np
from typing import Dict, Any, Optional, List, Tuple
from loguru import logger
import uuid
from datetime import datetime
from PIL import Image
import io

from app.services.llama_service import LlamaVisionService
from app.services.gpt4o_service import GPT4oVisionService
from app.models.violation import ViolationType, ViolationSeverity, ViolationStatus
from app.core.config import settings

class ViolationDetectionService:
    """Main service for coordinating AI-powered violation detection"""
    
    def __init__(self):
        self.llama_service = LlamaVisionService()
        self.gpt4o_service = GPT4oVisionService()
        
    async def process_frame(self, 
                          frame_data: bytes, 
                          camera_id: str,
                          location: str,
                          camera_type: str = "general") -> Dict[str, Any]:
        """
        Process a single frame for violation detection
        
        Args:
            frame_data: Raw image frame bytes
            camera_id: Unique camera identifier
            location: Camera location
            camera_type: Type of camera (traffic_light, speed, etc.)
            
        Returns:
            Detection results with all AI analysis
        """
        try:
            detection_id = str(uuid.uuid4())
            start_time = datetime.utcnow()
            
            logger.info(f"Starting violation detection for frame {detection_id}")
            
            # Prepare context for AI analysis
            context = {
                "camera_id": camera_id,
                "location": location,
                "camera_type": camera_type,
                "timestamp": start_time.isoformat(),
                "detection_id": detection_id
            }
            
            # Step 1: Initial analysis with Llama 4 Maverick
            logger.info("Running Llama 4 Maverick analysis...")
            llama_results = await self.llama_service.analyze_image(frame_data, context)
            
            # Step 2: If violations detected, get detailed analysis with GPT-4o
            gpt4o_results = {}
            combined_analysis = {}
            
            if not llama_results.get("error") and llama_results.get("analysis", {}).get("violations"):
                logger.info("Violations detected, running GPT-4o verification...")
                gpt4o_results = await self.gpt4o_service.analyze_violation(frame_data, llama_results)
                
                # Generate comprehensive report if high confidence violations found
                if self._should_generate_report(llama_results, gpt4o_results):
                    logger.info("Generating detailed violation report...")
                    report = await self.gpt4o_service.generate_violation_report(
                        context, 
                        {"llama": llama_results, "gpt4o": gpt4o_results}
                    )
                    combined_analysis["detailed_report"] = report
            
            # Step 3: Combine and validate results
            final_results = await self._combine_analysis_results(
                llama_results, 
                gpt4o_results, 
                context
            )
            
            # Step 4: Calculate processing metrics
            processing_time = (datetime.utcnow() - start_time).total_seconds()
            
            return {
                "detection_id": detection_id,
                "status": "completed",
                "processing_time": processing_time,
                "violations_detected": len(final_results.get("violations", [])),
                "results": final_results,
                "raw_analysis": {
                    "llama": llama_results,
                    "gpt4o": gpt4o_results
                },
                "context": context
            }
            
        except Exception as e:
            logger.error(f"Error in violation detection: {str(e)}")
            return {
                "detection_id": detection_id if 'detection_id' in locals() else str(uuid.uuid4()),
                "status": "error",
                "error": str(e),
                "context": context if 'context' in locals() else {}
            }
    
    async def _combine_analysis_results(self, 
                                      llama_results: Dict[str, Any],
                                      gpt4o_results: Dict[str, Any],
                                      context: Dict[str, Any]) -> Dict[str, Any]:
        """Combine and validate results from both AI services"""
        
        combined = {
            "violations": [],
            "scene_analysis": {},
            "confidence_metrics": {},
            "recommendations": {}
        }
        
        # Process Llama results
        if not llama_results.get("error"):
            llama_analysis = llama_results.get("analysis", {})
            llama_violations = llama_analysis.get("violations", [])
            
            combined["scene_analysis"] = llama_analysis.get("scene_analysis", {})
            
            # Process each violation
            for violation in llama_violations:
                processed_violation = self._process_violation(violation, "llama", context)
                combined["violations"].append(processed_violation)
        
        # Enhance with GPT-4o results if available
        if not gpt4o_results.get("error") and gpt4o_results.get("analysis"):
            gpt4o_analysis = gpt4o_results.get("analysis", {})
            
            # Update confidence and verification
            if "verification" in gpt4o_analysis:
                self._apply_gpt4o_verification(combined["violations"], gpt4o_analysis["verification"])
            
            # Add quality assessment
            if "evidence_quality" in gpt4o_analysis:
                combined["confidence_metrics"]["evidence_quality"] = gpt4o_analysis["evidence_quality"]
            
            # Add recommendations
            if "recommendations" in gpt4o_analysis:
                combined["recommendations"] = gpt4o_analysis["recommendations"]
        
        # Calculate overall confidence
        combined["confidence_metrics"]["overall_confidence"] = self._calculate_overall_confidence(combined)
        
        # Filter violations by confidence threshold
        combined["violations"] = [
            v for v in combined["violations"]
            if v.get("confidence", 0) >= settings.VIOLATION_DETECTION_THRESHOLD
        ]
        
        return combined
    
    def _process_violation(self, violation: Dict[str, Any], source: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Process and standardize violation data"""
        
        return {
            "id": str(uuid.uuid4()),
            "type": self._map_violation_type(violation.get("type", "other")),
            "severity": self._map_severity(violation.get("severity", "medium")),
            "confidence": float(violation.get("confidence", 0.0)),
            "license_plate": violation.get("license_plate"),
            "vehicle_type": violation.get("vehicle_type"),
            "vehicle_color": violation.get("vehicle_color"),
            "description": violation.get("description", ""),
            "bounding_box": violation.get("bounding_box", []),
            "evidence_points": violation.get("evidence_points", []),
            "detection_source": source,
            "location": context.get("location"),
            "camera_id": context.get("camera_id"),
            "timestamp": context.get("timestamp"),
            "status": ViolationStatus.DETECTED.value,
            "verified": False,
            "requires_review": violation.get("confidence", 0) < 0.9
        }
    
    def _apply_gpt4o_verification(self, violations: List[Dict[str, Any]], verification: Dict[str, Any]):
        """Apply GPT-4o verification results to violations"""
        
        confirmed = verification.get("confirmed_violations", [])
        disputed = verification.get("disputed_violations", [])
        
        for violation in violations:
            violation_type = violation["type"]
            
            if any(c.get("type") == violation_type for c in confirmed):
                violation["verified"] = True
                violation["verification_confidence"] = 0.95
            elif any(d.get("type") == violation_type for d in disputed):
                violation["verified"] = False
                violation["verification_notes"] = "Disputed by GPT-4o analysis"
                violation["requires_review"] = True
    
    def _calculate_overall_confidence(self, analysis: Dict[str, Any]) -> float:
        """Calculate overall confidence score"""
        
        violations = analysis.get("violations", [])
        if not violations:
            return 0.0
        
        # Base confidence from individual violations
        violation_confidences = [v.get("confidence", 0.0) for v in violations]
        base_confidence = sum(violation_confidences) / len(violation_confidences)
        
        # Adjust based on evidence quality
        evidence_quality = analysis.get("confidence_metrics", {}).get("evidence_quality", {})
        quality_score = evidence_quality.get("overall_quality_score", 0.8)
        
        # Combine scores
        overall = (base_confidence * 0.7) + (quality_score * 0.3)
        
        return min(1.0, max(0.0, overall))
    
    def _map_violation_type(self, detected_type: str) -> str:
        """Map detected violation type to standard enum"""
        
        type_mapping = {
            "red_light": ViolationType.RED_LIGHT.value,
            "speeding": ViolationType.OVERSPEED.value,
            "no_helmet": ViolationType.NO_HELMET.value,
            "wrong_lane": ViolationType.WRONG_LANE.value,
            "no_seatbelt": ViolationType.NO_SEATBELT.value,
            "mobile_use": ViolationType.MOBILE_USE.value,
            "parking": ViolationType.PARKING.value,
        }
        
        return type_mapping.get(detected_type.lower(), ViolationType.OTHER.value)
    
    def _map_severity(self, detected_severity: str) -> str:
        """Map detected severity to standard enum"""
        
        severity_mapping = {
            "low": ViolationSeverity.LOW.value,
            "medium": ViolationSeverity.MEDIUM.value,
            "high": ViolationSeverity.HIGH.value,
            "critical": ViolationSeverity.CRITICAL.value
        }
        
        return severity_mapping.get(detected_severity.lower(), ViolationSeverity.MEDIUM.value)
    
    def _should_generate_report(self, llama_results: Dict[str, Any], gpt4o_results: Dict[str, Any]) -> bool:
        """Determine if a detailed report should be generated"""
        
        # Generate report for high-confidence violations
        llama_violations = llama_results.get("analysis", {}).get("violations", [])
        high_confidence_violations = [
            v for v in llama_violations 
            if v.get("confidence", 0) >= 0.9
        ]
        
        return len(high_confidence_violations) > 0
    
    async def process_batch(self, 
                           frames: List[Tuple[bytes, Dict[str, Any]]],
                           batch_size: int = None) -> List[Dict[str, Any]]:
        """Process multiple frames in batch"""
        
        if batch_size is None:
            batch_size = settings.BATCH_PROCESSING_SIZE
        
        results = []
        
        # Process in batches to avoid overwhelming the APIs
        for i in range(0, len(frames), batch_size):
            batch = frames[i:i + batch_size]
            
            # Process batch concurrently
            tasks = [
                self.process_frame(
                    frame_data,
                    context.get("camera_id", ""),
                    context.get("location", ""),
                    context.get("camera_type", "general")
                )
                for frame_data, context in batch
            ]
            
            batch_results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Handle exceptions
            for j, result in enumerate(batch_results):
                if isinstance(result, Exception):
                    logger.error(f"Error processing frame {i+j}: {str(result)}")
                    results.append({
                        "status": "error",
                        "error": str(result),
                        "frame_index": i + j
                    })
                else:
                    results.append(result)
            
            # Small delay between batches to respect rate limits
            if i + batch_size < len(frames):
                await asyncio.sleep(1)
        
        return results
    
    async def __aenter__(self):
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        # Close AI service connections
        await self.llama_service.__aexit__(exc_type, exc_val, exc_tb)
        await self.gpt4o_service.__aexit__(exc_type, exc_val, exc_tb)