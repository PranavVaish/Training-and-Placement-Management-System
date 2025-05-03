from pydantic import BaseModel, Field
from typing import Optional

class Feedback(BaseModel):
    Feedback_ID: int
    Student_ID: int
    Company_ID: int
    Rating: int
    Trainer_ID: int
    Comments: Optional[str]
    Feedback_Type: Optional[str] = Field(..., max_length=50)