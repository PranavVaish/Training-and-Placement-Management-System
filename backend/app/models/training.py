from pydantic import BaseModel, Field, EmailStr
from datetime import date

class TrainerRegistration(BaseModel):
    trainer_id: int = Field(..., gt=0, alias="trainerId")
    expertise: str = Field(..., max_length=100, alias="expertise")
    name: str = Field(..., max_length=100, alias="name")
    organization: str = Field(..., max_length=100, alias="organization")
    email: EmailStr = Field(..., max_length=100, alias="email")
    phone_no: str = Field(..., max_length=15, alias="phone")

class TrainerProgram(BaseModel):
    training_name: str = Field(..., alias="Training_Name")
    training_description: str = Field(..., alias="Training_Description")
    duration: int = Field(..., alias="Duration")
    start_date: date = Field(..., alias="Start_Date")
    mode: str = Field(..., alias="Mode")
    certification_provided: bool = Field(..., alias="Certification_Provided")
    training_cost: float = Field(..., alias="Training_Cost")
    trainer_name: str = Field(..., alias="Trainer_Name")

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