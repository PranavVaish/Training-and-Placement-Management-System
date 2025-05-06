from fastapi import APIRouter, Depends, HTTPException, Body
import mysql.connector
from db.connections import get_db
from models.feedback import FeedbackCreate  # Assuming you have a FeedbackCreate model

router = APIRouter()

@router.post("/")
async def create_feedback(
    feedback_data: FeedbackCreate = Body(...),
    db: mysql.connector.MySQLConnection = Depends(get_db),
):
    """
    Create a new feedback using the AddFeedback stored procedure.
    """
    cursor = db.cursor()
    try:
        cursor.callproc(
            "AddFeedback",
            (
                feedback_data.Feedback_ID,
                feedback_data.Student_ID,
                feedback_data.Company_ID,
                feedback_data.Rating,
                feedback_data.Comments,
                feedback_data.Feedback_Type,
                feedback_data.Trainer_ID,
            ),
        )
        db.commit()
        return {"message": "Feedback created successfully"}

    except mysql.connector.Error as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()


@router.get("/feedback_form")
async def get_feedback_form(
    db: mysql.connector.MySQLConnection = Depends(get_db)
):
    """
    Retrieve all data for the feedback form, including trainers and training programs.
    """
    cursor = db.cursor()
    try:

        # Fetch all trainers
        cursor.callproc("GetAllTrainersRowByRow")
        trainers = []
        for result in cursor.stored_results():
            trainers = result.fetchall()

        trainer_list = [
            {"Trainer_ID": row[0], "Name": row[1]} for row in trainers
        ]

        # Fetch all training programs
        cursor.callproc("GetTrainingProgramsRowByRow")
        training_programs = []
        for result in cursor.stored_results():
            training_programs = result.fetchall()

        training_program_list = [
            {"Training_Program_ID": row[0], "Name": row[1]} for row in training_programs
        ]

        return {
            "trainers": trainer_list,
            "training_programs": training_program_list
        }

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

