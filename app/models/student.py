# Models for Student
from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class StudentRegistration(BaseModel):
    student_id: int = Field(..., alias="Student_ID")
    name: str = Field(..., max_length=100, alias="Name")
    cgpa: float = Field(..., max_digits=3, decimal_places=2, alias="CGPA")
    graduation_Year: int = Field(..., alias="Grauation_Year")
    department: str = Field(..., max_length=100, alias="Department")
    email: EmailStr = Field(..., max_length=100, alias="Email_ID")
    phone_number: str = Field(..., max_length=15, alias="Phone_Number")
    password: str = Field(..., alias="Password")

class StudentLogin(BaseModel):
    email: EmailStr = Field(..., max_length=100)
    password: str  # Hashed password

class StudentResponse(BaseModel):
    Student_ID: int
    Name: str
    CGPA: float
    Grauation_Year: int
    Department: str
    Phone_Number: Optional[str] = None  # Phone number can be None

class StudentListResponse(BaseModel):
    students: list[StudentResponse]