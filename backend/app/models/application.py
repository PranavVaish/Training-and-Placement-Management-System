# Pydantic models for Application
from pydantic import BaseModel, Field
from datetime import date, time

class Application(BaseModel):
    Application_ID: int
    Student_ID: int
    Job_ID: int 
    Interview_Schedule: int
    Application_Date: date
    Status: str = Field(..., max_length=50)  # Status with a max length of 50 characters

class Interview_Schedule(BaseModel):
    Interview_ID: int 
    Application_ID: int
    Date: date
    Time: time
    Mode: str = Field(..., max_length=50)  # Mode with a max length of 50 characters
    Interviewer_Name: str = Field(..., max_length=100)  # Interviewer name with a max length of 100 characters
