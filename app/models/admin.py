# The Pydantic models for Admin
from pydantic import BaseModel, Field, EmailStr

"""
class Admin(BaseModel):
    Admin_ID: int
    Name: str = Field(..., max_length=100)
    Role: str = Field(..., max_length=50)
    Password_Hash: str 

class Admin_Email(BaseModel):
    Admin_ID: int  # Foreign key to Admin model
    Email_ID: str = Field(..., max_length=100)

class Admin_Phone(BaseModel):
    Phone_No: str = Field(..., max_length=15)
    Admin_ID: int  # Foreign key to Admin model
"""

class AdminLogin(BaseModel):
    id: int = Field(..., alias="user_id")
    password: str = Field(..., alias="password")

class AdminResponse(BaseModel):
    Admin_ID: int = Field(..., alias="Admin_ID")
    Name: str = Field(..., alias="Admin_Name")
    Role: str = Field(..., alias="Role")
    Phone_Number: str = Field(..., max_length=10, alias="Phone")
    Email_ID: str = Field(..., max_length=100, alias="Email")

class AdminRegistration(BaseModel):
    name: str = Field(..., alias="name")
    role: str = Field(..., alias="role")
    email: EmailStr = Field(..., alias="email")
    phone_number: str = Field(..., max_length=10, alias="phone")
    id: int = Field(..., gt=0, alias="adminId")
    password: str = Field(..., alias="password")

class AdminTrainingProgram(BaseModel):
    id: int = Field(..., alias="Training_ID")
    name: str = Field(..., alias="Training_Name")
    trainerName: str = Field(..., alias="Trainer_Name")
    duration: int = Field(..., alias="Duration")
    mode: str = Field(..., alias="Mode")
    cost: int = Field(..., alias="Cost")
