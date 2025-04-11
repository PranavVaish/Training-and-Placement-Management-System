from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def read_companies():
    return {"message": "List of companies"}