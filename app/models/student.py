# Models for Student
from pydantic import BaseModel, EmailStr, Field

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