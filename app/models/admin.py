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
    id: int = Field(..., max_length=100, alias="user_id")
    password: str

class AdminResponse(BaseModel):
    Admin_ID: int
    Name: str
    Role: str
    Phone_Number: str = Field(..., max_length=15)

class AdminRegistration(BaseModel):
    name: str = Field(..., max_length=100, alias="name")
    role: str = Field(..., max_length=50, alias="role")
    email: EmailStr = Field(..., max_length=100, alias="email")
    phone_number: str = Field(..., alias="phone")
    id: int = Field(..., gt=0, alias="adminId")
    password: str = Field(..., min_length=8, max_length=100, alias="password")