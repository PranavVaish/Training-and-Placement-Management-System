# Models for Job
from pydantic import BaseModel, Field
from datetime import date
from typing import List

class JobResponse(BaseModel):
    Job_ID: int
    Company_Name: str  
    Title: str
    Salary: float
    Job_Type: str
    Application_Deadline: date
    Job_Description: str
    Vacancies: int
    Location_List: List[str]
    Eligibility_Criteria_List: List[str]

class JobListResponse(BaseModel):
    jobs: List[JobResponse]

class JobCreate(BaseModel):
    Job_Title: str = Field(..., alias="title")
    Job_Type: str = Field(..., alias="type")
    Location_List: List[str] = Field(..., alias="location")
    Vacancies: int = Field(..., alias="vacancy")
    Application_Deadline: date = Field(..., alias="deadline")
    Salary: float = Field(..., alias="salary")
    Job_Description: str = Field(..., alias="description")
    Eligibility_Criteria_List: List[str] = Field(..., alias="eligibility")