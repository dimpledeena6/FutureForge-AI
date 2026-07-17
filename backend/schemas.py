from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional

class SimulationParams(BaseModel):
    social: str
    risk: str
    priority: str
    decision: Optional[str] = ""
    decisionA: Optional[str] = ""
    decisionB: Optional[str] = ""

class SimulationRequest(BaseModel):
    decisionMode: str  # 'single' or 'multiple'
    params: SimulationParams

class DecisionCreate(BaseModel):
    id: str
    title: str
    mode: str
    createdAt: Optional[str] = None
    input: Dict[str, Any]
    results: Dict[str, Any]
    finalVerdict: Dict[str, Any]
    shareable: Optional[bool] = True

class DecisionResponse(BaseModel):
    id: str
    title: str
    mode: str
    createdAt: str
    input: Dict[str, Any]
    results: Dict[str, Any]
    finalVerdict: Dict[str, Any]
    shareable: bool

    class Config:
        from_attributes = True

# New schemas for user analysis
class UserAnalysisRequest(BaseModel):
    social: str
    risk: str
    priority: str

class UserAnalysisResponse(BaseModel):
    compatibility_scores: Dict[str, int]
    recommended_paths: List[str]
    analysis: str

# New schemas for SWOT report generation
class ReportGenerationRequest(BaseModel):
    path: str
    regretScore: int
    social: str
    risk: str
    priority: str

class SWOTData(BaseModel):
    strengths: List[str]
    weaknesses: List[str]
    opportunities: List[str]
    threats: List[str]

class ReportGenerationResponse(BaseModel):
    swot: SWOTData
    playbook: List[str]
    summaryHighlight: str
