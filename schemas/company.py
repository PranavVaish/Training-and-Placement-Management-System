# Create "Company" related Pydantic models here.
from pydantic import BaseModel, List

class Company(BaseModel):
    id: int
    name: str
    location: str
    website: str
    contanct_person: str
    hiring_history: int
    industry_type: str
    email_id: List[str]
    phone_number: List[str]

