from sqlalchemy import Column, String, Boolean, JSON, DateTime
from datetime import datetime
from database import Base

class Decision(Base):
    __tablename__ = "decisions"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    mode = Column(String)  # 'single' or 'multiple'
    createdAt = Column(String, default=lambda: datetime.utcnow().isoformat())
    input = Column(JSON)
    results = Column(JSON)
    finalVerdict = Column(JSON)
    shareable = Column(Boolean, default=True)
