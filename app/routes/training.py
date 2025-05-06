# Routes for Jobs
from fastapi import APIRouter, Body, Depends, HTTPException
import mysql.connector
from db.connections import get_db
from models.training import TrainerRegistration, TrainerProgram, CreateTrainingProgram

router = APIRouter()

@router.post("/register")
async def register_trainer(
    trainer_data: TrainerRegistration = Body(...),
    db: mysql.connector.MySQLConnection = Depends(get_db),
):
    """
    Register a new trainer using a stored procedure.
    """
    cursor = db.cursor()
    try:

        # Call the stored procedure
        cursor.callproc("AddTrainerWithDetails", (
            trainer_data.trainer_id,
            trainer_data.expertise,
            trainer_data.name,
            trainer_data.organization,
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

    
@router.get("/trainers")
async def get_trainers(
    db: mysql.connector.MySQLConnection = Depends(get_db),
):
    """
    Get all trainers.
    """
    cursor = db.cursor(dictionary=True)
    try:

        # Call the stored procedure
        cursor.callproc("GetAllTrainersRowByRow")

        # Fetch all results
        trainers = []
        for result in cursor.stored_results():
            trainers.extend(result.fetchall())

        return {"trainers": trainers}

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch trainers: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()


@router.post("/create-program")
async def create_training_program(
    program_data: CreateTrainingProgram = Body(...),
    db: mysql.connector.MySQLConnection = Depends(get_db),
):
    """
    Create a new training program using a stored procedure.
    Only allowed if the user is an admin.
    """
    cursor = db.cursor()
    try:
        admin_id = program_data.admin_id
        cursor.execute("SELECT 1 FROM Admin WHERE Admin_ID = %s", (admin_id,))
        result = cursor.fetchone()
        if not result:
            raise HTTPException(status_code=403, detail="User is not authorized to create a training program")

        # Call the stored procedure
        cursor.callproc("AddTrainingProgram", (
            program_data.training_name,
            program_data.training_description,
            program_data.duration,
            program_data.trainer_id,
            program_data.start_date,
            program_data.end_date,
            program_data.mode,
            program_data.certification_provided,
            program_data.cost,
        ))

        # Commit the changes
        db.commit()

        return {"message": "Training program created successfully"}

    except mysql.connector.Error as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create training program: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()


@router.get("/programs", response_model=list[TrainerProgram])
async def get_training_programs(
    db: mysql.connector.MySQLConnection = Depends(get_db),
):
    """
    Get all training programs.
    """
    try:
        cursor = db.cursor(dictionary=True)

        # Call the stored procedure
        cursor.callproc("GetAllTrainingProgramsRowByRow")

        # Fetch all results
        programs = []
        for result in cursor.stored_results():
            programs.extend(result.fetchall())

        return programs

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch training programs: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()