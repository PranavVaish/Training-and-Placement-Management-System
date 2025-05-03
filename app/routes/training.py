# Routes for Jobs
from fastapi import APIRouter, Body, Depends, HTTPException
import mysql.connector
from db.connections import get_db
from models.training import TrainerRegistration  # Assuming you have a TrainerRegistration model

router = APIRouter()

@router.post("/register")
async def register_trainer(
    trainer_data: TrainerRegistration = Body(...),
    db: mysql.connector.MySQLConnection = Depends(get_db),
):
    """
    Register a new trainer using a stored procedure.
    """
    try:
        cursor = db.cursor()

        # Call the stored procedure
        cursor.callproc("AddTrainerWithDetails", (
            trainer_data.trainer_id,
            trainer_data.expertise,
            trainer_data.name,
            trainer_data.organisation,
            trainer_data.email,
            trainer_data.phone_no,
        ))

        # Commit the changes
        db.commit()

        return {"message": "Trainer registered successfully"}

    except mysql.connector.Error as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Registration failed: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()