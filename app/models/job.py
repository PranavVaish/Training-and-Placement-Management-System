# Models for Job
from pydantic import BaseModel, Field
from datetime import date

class Job(BaseModel):
    Job_ID: int
    Job_Title: str = Field(..., max_length=100)
    Job_Description: str
    Salary: float = Field(..., max_digits=10, decimal_places=2)
    Company_ID: int  # Foreign key to Company
    Job_Type: str = Field(..., max_length=50)  # e.g., Full-time, Part-time, Internship
    Vacancies: int
    Application_Deadline: date

class Job_Eligibility(BaseModel):
    Job_ID: int  # Foreign key to Job
    Eligibility_Criterion: str = Field(..., max_length=100)  # e.g., CGPA, Year of Study

class Job_Location(BaseModel):
    Job_ID: int  # Foreign key to Job
    Location: str = Field(..., max_length=100)  # e.g., City, State, Country

