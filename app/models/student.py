# Models for Student
from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class StudentRegistration(BaseModel):
    student_id: int = Field(..., alias="studentId")
    name: str = Field(..., max_length=100)
    cgpa: float = Field(...)
    graduation_year: int = Field(..., alias="graduationYear")
    department: str = Field(..., max_length=100)
    email: EmailStr = Field(..., max_length=100)
    phone_number: str = Field(..., max_length=15, alias="phone")
    password: str = Field(...)

class StudentLogin(BaseModel):
    id: int = Field(..., gt=0, alias="user_id")
    password: str  # Hashed password

class StudentResponse(BaseModel):
    Student_ID: int
    Name: str
    Email_ID: EmailStr
    Phone_No: Optional[str] = None  # Phone number can be None
    Department: str
    CGPA: float
    Graduation_Year: int

class StudentListResponse(BaseModel):
    students: list[StudentResponse]

class JobApplication(BaseModel):
    job_id: int

class EnrollStudent(BaseModel):
    training_id: int