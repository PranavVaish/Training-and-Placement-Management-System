from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def read_students():
    return {"message": "List of students"}