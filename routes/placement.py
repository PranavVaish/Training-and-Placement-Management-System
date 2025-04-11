from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def read_placements():
    return {"message": "List of placements"}