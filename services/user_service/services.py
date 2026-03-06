"""User service functions"""
from dao import DataAccessObject  
from fastapi import HTTPException
from models import User
from utils.jwt_auth import create_access_token

import logging

logging.basicConfig(level=logging.INFO)

def model_to_dict(obj) -> dict:
    return {c.name: getattr(obj, c.name) for c in obj.__table__.columns}

def login_service(driving_license_number: str) -> str:
    user_dao = DataAccessObject()
    user: User = user_dao.get_user_by_driving_license(driving_license_number)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return create_access_token(data=model_to_dict(user))
