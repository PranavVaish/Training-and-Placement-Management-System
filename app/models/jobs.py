# Models for Job
from pydantic import BaseModel
from datetime import date
from typing import List

class JobResponse(BaseModel):
    Job_ID: int
    Company_Name: str  # Assuming company name is the 4th column
    Title: str
    Salary: float
    Job_Type: str
    Application_Deadline: date

class JobListResponse(BaseModel):
    jobs: List[JobResponse]

class JobCreate(BaseModel):
    Job_ID: int
    Job_Title: str
    Job_Description: str
    Salary: float
    Company_ID: int
    Job_Type: str
    Vacancies: int
    Application_Deadline: date
    Eligibility_Criteria_List: List[str]
    Location_List: List[str]