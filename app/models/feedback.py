from pydantic import BaseModel
from typing import Optional

class FeedbackCreate(BaseModel):
    Feedback_ID: int
    Student_ID: int
    Rating: int
    Comments: str
    Trainer_ID: Optional[int] = None