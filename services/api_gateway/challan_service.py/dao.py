from database import Base, engine
from models import Challan, Violation
from sqlalchemy.orm import sessionmaker

Base.metadata.create_all(bind=engine)

class ChallanDAO:
    def __init__(self):
        self.session = sessionmaker(bind=engine)()

    def get_all_challans(self):
        return self.session.query(Challan).all()
    
    def get_challan_by_id(self, challan_id: int):
        return self.session.query(Challan).filter(Challan.id == challan_id).first()
    
    def get_all_violations(self):
        return self.session.query(Violation).all()
    
    def get_violation_by_id(self, violation_id: int):
        return self.session.query(Violation).filter(Violation.id == violation_id).first()
    
    def update_violation_status(self, violation_id: int, status_id: int):
        violation = self.get_violation_by_id(violation_id)
        if violation:
            violation.violation_status_id = status_id
            self.session.commit()
            return violation
        return None