# Models for Student
from pydantic import BaseModel, EmailStr, Field
from typing import Optional


"""
Tables related to Student

class Student(BaseModel):
    Student_ID: int
    Name: str = Field(..., max_length=100)
    CGPA: float = Field(..., max_digits=3, decimal_places=2)
    Grauation_Year: int
    Department: str = Field(..., max_length=100)

class Student_Email(BaseModel):
    Email_ID: EmailStr = Field(..., max_length=100)
    Student_ID: int

class Student_Phone(BaseModel):
    Student_ID: int
    Phone_Number: str = Field(..., max_length=15)

class Student_Credentials(BaseModel):
    Student_ID: int
    Password_Hash: str  # Hashed password
"""


class StudentRegistration(BaseModel):
    name: str = Field(..., max_length=100)
    cgpa: float = Field(..., max_digits=3, decimal_places=2)
    graduation_Year: int
    department: str = Field(..., max_length=100)
    email: EmailStr = Field(..., max_length=100)
    phone_number: str = Field(..., max_length=15)
    password: str  # Hashed password

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