from  dao import DataAccessObject
from fastapi import HTTPException

class ChallanService:
    def __init__(self):
        self.dao = DataAccessObject()

    def get_all_challans(self):
        return self.dao.get_all_challans()

    def get_challan_details(self, challan_id: int):
        challan = self.dao.get_challan_by_id(challan_id)
        if not challan:
            raise HTTPException(status_code=404, detail="Challan not found")
        return challan

    def get_all_violations(self):
        return self.dao.get_all_violations()

    def get_violation_details(self, violation_id: int):
        return self.dao.get_violation_by_id(violation_id)

    def update_violation_status(self, violation_id: int, status_id: int):
        return self.dao.update_violation_status(violation_id, status_id)