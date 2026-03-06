from fastapi import APIRouter, Response
from services import login_service

from schemas import LoginSchema

router = APIRouter()

@router.post("/login")
async def login(login_data: LoginSchema, response: Response):
    token = login_service(login_data.driving_license_number)
    response.set_cookie(key="access_token", value=token, httponly=True)
    return {"access_token": token}

@router.get("/profile")
async def profile():
    return {"message": "User profile data (protected route)"}