# The Pydantic models for Admin
from pydantic import BaseModel, Field

class Admin(BaseModel):
    Admin_ID: int
    Name: str = Field(..., max_length=100)
    Role: str = Field(..., max_length=50)
    Password: str = Field(..., min_length=8, max_length=100)

class Email(BaseModel):
    Admin_ID: int  # Foreign key to Admin model
    Email_ID: str = Field(..., max_length=100)

class Phone(BaseModel):
    Phone_No: str = Field(..., max_length=15)
    Admin_ID: int  # Foreign key to Admin model

