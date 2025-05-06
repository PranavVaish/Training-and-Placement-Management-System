from pydantic import BaseModel, Field
from typing import Optional

class FeedbackCreate(BaseModel):
    Student_ID: int = Field(..., alias="studentId")
    Rating: int = Field(..., ge=1, le=5, alias="rating")
    Comments: str = Field(..., alias="comments")
    Trainer_ID: Optional[int] = Field(None, alias="trainerId")
    Training_Program_ID: Optional[int] = Field(None, alias="trainingsId")