from pydantic import BaseModel, Field
from typing import EmailStr

class TrainerRegistration(BaseModel):
    trainer_id: int
    expertise: str = Field(..., max_length=100)
    name: str = Field(..., max_length=100)
    organisation: str = Field(..., max_length=100)
    email: EmailStr = Field(..., max_length=100)
    phone_no: str = Field(..., max_length=15)