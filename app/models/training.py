from pydantic import BaseModel, Field
from typing import EmailStr
from datetime import date

class Trainer(BaseModel):
    Trainer_ID: int
    Expertise: str = Field(..., max_length=100)
    Name: str = Field(..., max_length=100)
    Organisation: str = Field(..., max_length=100)

class Trainer_Email(BaseModel):
    Email: EmailStr = Field(..., max_length=100)
    Trainer_ID: int

class Trainer_Phone(BaseModel):
    Phone_No: str = Field(..., max_length=15)
    Trainer_ID: int


class Training_Program(BaseModel):
    Training_ID: int
    Training_Name: str
    Training_Description: str
    Duration: int
    Trainer_ID: int
    Start_Date: date  # Use datetime.date for stricter type checking
    End_Date: date    # Use datetime.date for stricter type checking
    Mode: str = Field(..., max_length=50)
    Certification_Provided: bool
    Training_Cost: float = Field(..., max_digits=10, decimal_places=2)


class Training_Enrollment(BaseModel):
    Enrollment_ID: int
    Training_ID: int
    Student_ID: int
    Performance_Grade: str = Field(..., max_length=10)
    Completion_Status: str = Field(..., max_length=20)