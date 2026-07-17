from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import logging

from database import engine, Base, get_db
from models import Decision as DecisionModel
from schemas import (
    SimulationRequest, 
    DecisionCreate, 
    DecisionResponse,
    UserAnalysisRequest,
    UserAnalysisResponse,
    ReportGenerationRequest,
    ReportGenerationResponse,
    SWOTData
)
from engine import (
    run_full_simulation,
    calculate_compatibility_scores,
    generate_swot_analysis,
    generate_mitigation_strategies
)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("futureforge")

# Auto-create tables on import/startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FutureForge AI API",
    description="Enterprise Decision Intelligence Engine API",
    version="2.0.0"
)

# Enable CORS for maximum client compatibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/analyze-user", response_model=UserAnalysisResponse)
def analyze_user(payload: UserAnalysisRequest):
    """
    Evaluate user attributes to output path compatibility scores and personalized matches.
    """
    try:
        params_dict = payload.dict()
        scores = calculate_compatibility_scores(params_dict)
        
        # Sort and recommend paths above 70%, or at least the top path
        recommended = [path for path, score in scores.items() if score >= 70]
        if not recommended:
            top_path = max(scores, key=scores.get)
            recommended = [top_path]

        social_str = "an introvert" if params_dict["social"] == "introvert" else "an extrovert"
        risk_str = f"{params_dict['risk']} risk tolerance"
        priority_str = f"driven by {params_dict['priority']}"
        
        analysis_text = (
            f"Based on your profile as {social_str} with a {risk_str} and primary focus {priority_str}, "
            f"your career suitability profile is heavily aligned with the {', '.join(recommended)} paths. "
            f"We advise structuring your career decisions to preserve your core priority goals."
        )

        return {
            "compatibility_scores": scores,
            "recommended_paths": recommended,
            "analysis": analysis_text
        }
    except Exception as e:
        logger.error(f"User analysis endpoint error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis engine failed: {str(e)}"
        )

@app.post("/api/simulate-career")
def simulate_career(payload: SimulationRequest):
    """
    Run career trajectory council simulation based on career statement and traits.
    """
    try:
        params_dict = payload.params.dict()
        results = run_full_simulation(payload.decisionMode, params_dict)
        return results
    except Exception as e:
        logger.error(f"Career simulation endpoint error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Career simulation failed: {str(e)}"
        )

@app.post("/api/generate-report", response_model=ReportGenerationResponse)
def generate_report(payload: ReportGenerationRequest):
    """
    Synthesize SWOT matrix analysis and risk mitigation playbooks.
    """
    try:
        params_dict = {
            "social": payload.social,
            "risk": payload.risk,
            "priority": payload.priority
        }
        
        # Compile SWOT lists
        swot_raw = generate_swot_analysis(payload.path, params_dict)
        swot_obj = SWOTData(
            strengths=swot_raw["strengths"],
            weaknesses=swot_raw["weaknesses"],
            opportunities=swot_raw["opportunities"],
            threats=swot_raw["threats"]
        )

        # Build playbook
        playbook = generate_mitigation_strategies(payload.path, payload.regretScore, params_dict)
        
        # Summary highlights
        summary_str = f"Consulting Council Analysis for the {payload.path} path: "
        if payload.regretScore > 60:
            summary_str += "Caution advised. High potential for cognitive regret triggers due to priority misalignment."
        else:
            summary_str += "Favorable trajectory. Strong trait compatibility and manageable stress parameters forecasted."

        return {
            "swot": swot_obj,
            "playbook": playbook,
            "summaryHighlight": summary_str
        }
    except Exception as e:
        logger.error(f"Report generation endpoint error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Report compiler failed: {str(e)}"
        )

# Backward compatible endpoint alias
@app.post("/api/simulate")
def simulate(payload: SimulationRequest):
    return simulate_career(payload)

@app.get("/api/decisions", response_model=List[DecisionResponse])
def get_decisions(db: Session = Depends(get_db)):
    try:
        decisions = db.query(DecisionModel).order_by(DecisionModel.createdAt.desc()).all()
        return decisions
    except Exception as e:
        logger.error(f"Error querying decisions: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve decisions database records."
        )

@app.get("/api/decisions/{decision_id}", response_model=DecisionResponse)
def get_decision(decision_id: str, db: Session = Depends(get_db)):
    decision = db.query(DecisionModel).filter(DecisionModel.id == decision_id).first()
    if not decision:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Decision with ID {decision_id} not found."
        )
    return decision

@app.post("/api/decisions", response_model=DecisionResponse)
def create_decision(payload: DecisionCreate, db: Session = Depends(get_db)):
    try:
        existing = db.query(DecisionModel).filter(DecisionModel.id == payload.id).first()
        
        if existing:
            existing.title = payload.title
            existing.mode = payload.mode
            if payload.createdAt:
                existing.createdAt = payload.createdAt
            existing.input = payload.input
            existing.results = payload.results
            existing.finalVerdict = payload.finalVerdict
            existing.shareable = payload.shareable
            db.commit()
            db.refresh(existing)
            logger.info(f"Updated decision record: {payload.id}")
            return existing
        else:
            db_decision = DecisionModel(
                id=payload.id,
                title=payload.title,
                mode=payload.mode,
                createdAt=payload.createdAt,
                input=payload.input,
                results=payload.results,
                finalVerdict=payload.finalVerdict,
                shareable=payload.shareable
            )
            db.add(db_decision)
            db.commit()
            db.refresh(db_decision)
            logger.info(f"Created new decision record: {payload.id}")
            return db_decision
    except Exception as e:
        db.rollback()
        logger.error(f"Failed saving decision record: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to persist decision: {str(e)}"
        )

@app.delete("/api/decisions/{decision_id}")
def delete_decision(decision_id: str, db: Session = Depends(get_db)):
    decision = db.query(DecisionModel).filter(DecisionModel.id == decision_id).first()
    if not decision:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Decision with ID {decision_id} not found."
        )
    try:
        db.delete(decision)
        db.commit()
        logger.info(f"Deleted decision record: {decision_id}")
        return {"status": "success", "message": f"Decision {decision_id} deleted."}
    except Exception as e:
        db.rollback()
        logger.error(f"Failed deleting decision record: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete decision: {str(e)}"
        )

@app.delete("/api/decisions")
def delete_all_decisions(db: Session = Depends(get_db)):
    try:
        num_deleted = db.query(DecisionModel).delete()
        db.commit()
        logger.info(f"Purged vault: deleted {num_deleted} decision records.")
        return {"status": "success", "message": f"Successfully deleted all {num_deleted} records."}
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to purge vault: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to purge database vault: {str(e)}"
        )

