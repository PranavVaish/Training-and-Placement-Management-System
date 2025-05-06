from pydantic import BaseModel, Field, EmailStr
from datetime import date

class TrainerRegistration(BaseModel):
    Trainer_ID: int
    Expertise: str = Field(..., max_length=100)
    Name: str = Field(..., max_length=100)
    Organisation: str = Field(..., max_length=100)
    Email: EmailStr = Field(..., max_length=100)
    Phone_No: str = Field(..., max_length=15)

class TrainerProgram(BaseModel):
    trainer_id: int
    training_name: str
    training_description: str
    duration: int
    start_date: date
    end_date: date
    mode: str
    certification_provided: bool
    training_cost: float
    trainer_name: str

class CreateTrainingProgram(BaseModel):
    training_name: str = Field(..., alias="trainingName")
    training_description: str = Field(..., alias="trainingDescription")
    duration: int = Field(..., alias="duration")
    trainer_id: int = Field(..., alias="trainerId")
    start_date: date = Field(..., alias="startDate")
    end_date: date = Field(..., alias="endDate")
    mode: str = Field(..., alias="mode")
    certification_provided: bool = Field(..., alias="certificationProvided")
    cost: float = Field(..., alias="cost")
    admin_id: int = Field(..., alias="universal_id")