# Pydantic Models for Company
from pydantic import BaseModel, Field

class Company(BaseModel):
    Company_ID: int
    Name: str = Field(..., max_length=100)  # VARCHAR(100)
    Industry_Type: str = Field(..., max_length=100)  # VARCHAR(100), e.g., IT, Finance, etc.
    Contact_Person: str = Field(..., max_length=100)  # VARCHAR(100)
    Website: str = Field(..., max_length=100)  # VARCHAR(100)

class Company_Email(BaseModel):
    Email_ID: str = Field(..., max_length=100)  # VARCHAR(100), PRIMARY KEY
    Company_ID: int  # Foreign key to Company

class Company_Phone(BaseModel):
    Phone_No: str = Field(..., max_length=15)  # VARCHAR(15), PRIMARY KEY
    Company_ID: int  # Foreign key to Company

class Company_Location(BaseModel):
    Company_ID: int  # Foreign key to Company
    Location: str = Field(..., max_length=100)  # VARCHAR(100), part of composite PRIMARY KEY

class Company_Hiring_History(BaseModel):
    Company_ID: int  # Foreign key to Company
    Hiring_Period: str = Field(..., max_length=50)  # VARCHAR(50), part of composite PRIMARY KEY
    Job_Roles: str  # TEXT
