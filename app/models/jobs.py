# Models for Job
from pydantic import BaseModel
from datetime import date
from typing import List

class JobResponse(BaseModel):
    Job_ID: int
    Company_ID: int
    Title: str
    Description: str
    Requirements: str
    Location: str
    Salary: float
    Date_Posted: date

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