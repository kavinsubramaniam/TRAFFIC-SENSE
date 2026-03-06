from pydantic import BaseModel

class LoginSchema(BaseModel):
    driving_license_number: str

    class Config:
        from_attributes = True

