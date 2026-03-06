from sqlalchemy import Column, Integer, String, Float
from database import Base

class Challan(Base):
    __tablename__ = "challans"

    id = Column(Integer, primary_key=True, index=True)
    vehicle_number = Column(String, index=True)
    violation_id = Column(Integer, index=True)
    fine_amount = Column(Float)

class Violation(Base):
    __tablename__ = "violations"

    id = Column(Integer, primary_key=True, index=True)
    plate_number = Column(String, index=True)
    source = Column(String)
    evidance_url = Column(String)
    timestamp = Column(String)
    violation_type_id = Column(Integer, index=True)
    violation_status_id = Column(Integer, index=True)
    confidense_score = Column(Float)

class ViolationType(Base):
    __tablename__ = "violation_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)

class ViolationStatus(Base):
    __tablename__ = "violation_statuses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)