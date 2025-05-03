from pydantic import BaseModel, Field
from datetime import date

class PlacementRecord(BaseModel):
    Placement_ID: int
    Student_ID: int  # Foreign key to Student
    job_id: int  # Foreign key to Job
    company_id: int  # Foreign key to Company
    package: float = Field(..., max_digits=10, decimal_places=2)
    placement_date: date
    placement_location: str = Field(..., max_length=100)  # e.g., City, State, Country
