from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def read_jobs():
    return {"message": "List of jobs"}