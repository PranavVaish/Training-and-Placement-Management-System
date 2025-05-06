# Routes for Admin
import bcrypt
from fastapi import APIRouter, Body, Depends, HTTPException
import mysql.connector
from db.connections import get_db
from mysql.connector import MySQLConnection
from models.admin import AdminLogin, AdminResponse, AdminRegistration, AdminTrainingProgram
from typing import List
import datetime
from utils import create_access_token

router = APIRouter()

@router.get("/profile", response_model=List[AdminResponse])
async def get_admin(db: mysql.connector.MySQLConnection = Depends(get_db)):
    """
    Retrieve admin data using the GetAdminData stored procedure.
    """
    cursor = db.cursor()
    try:
        cursor.callproc("GetAdminData")

        results = []
        for result in cursor.stored_results():
            admins = result.fetchall()

            if not admins:
                raise HTTPException(status_code=404, detail="Admins not found")

            # Convert the tuple to a dictionary or an Admin object
            admin_list = []
            for admin in admins:
                admin_data = {
                    "Admin_ID": admin[0],
                    "Admin_Name": admin[1],
                    "Role": admin[2],
                    "Email": admin[3],
                    "Phone": admin[4],
                }
                admin_list.append(AdminResponse(**admin_data))
            results.append(admin_list)

        if results:
            return results[0]
        else:
            raise HTTPException(status_code=404, detail="Admins not found")

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

@router.get("/stats")
async def get_admin_stats(db: MySQLConnection = Depends(get_db)):
    """
    Retrieve admin stats data using the stored procedures:
    GetTotalPlacementsThisYear, GetActiveTrainingPrograms, GetTotalCompanies, GetTotalStudents.
    """
    cursor = db.cursor()
    try:
        # Call the GetTotalPlacementsThisYear procedure
        cursor.callproc("GetTotalPlacementsThisYear")
        total_placements = 0
        for result in cursor.stored_results():
            total_placements = result.fetchone()[0]

        # Call the GetActiveTrainingPrograms procedure
        cursor.callproc("GetActiveTrainingPrograms")
        active_training_programs = 0
        for result in cursor.stored_results():
            active_training_programs = result.fetchone()[0]

        # Call the GetTotalCompanies procedure
        cursor.callproc("GetTotalCompanies")
        total_companies = 0
        for result in cursor.stored_results():
            total_companies = result.fetchone()[0]

        # Call the GetTotalStudents procedure
        cursor.callproc("GetTotalStudents")
        total_students = 0
        for result in cursor.stored_results():
            total_students = result.fetchone()[0]

        # Return the aggregated stats
        return {
            "total_placements_this_year": total_placements,
            "active_training_programs": active_training_programs,
            "total_companies": total_companies,
            "total_students": total_students,
        }

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

@router.get("/companies")
async def get_companies(db: MySQLConnection = Depends(get_db)):
    """
    Retrieve all companies using the GetDistinctCompanies stored procedure.
    """
    cursor = db.cursor()
    try:
        cursor.callproc("GetDistinctCompanies")
        companies = []
        for result in cursor.stored_results():
            companies = result.fetchall()

        if not companies:
            raise HTTPException(status_code=404, detail="Companies not found")

        # Convert the tuple to a dictionary or an Admin object
        companies_list = []
        for department in companies:
            company_data = {
                "name": department[0],
                "id": department[1],
            }
            companies_list.append(company_data)

        return companies_list

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

@router.get("/training_programs", response_model=List[AdminTrainingProgram])
async def get_admin_training_programs(db: mysql.connector.MySQLConnection = Depends(get_db)):
    """
    Retrieve all training programs with trainer information.
    """
    query = """
        SELECT 
            tp.Training_ID,
            tp.Training_Name,
            t.Name AS Trainer_Name,
            tp.Duration,
            tp.Mode,
            tp.Training_Cost
        FROM 
            Training_Program tp
        JOIN 
            Trainer t ON tp.Trainer_ID = t.Trainer_ID
    """
    cursor = db.cursor()
    try:
        cursor.execute(query)
        training_programs = cursor.fetchall()

        # Convert the list of tuples to a list of dictionaries
        training_program_list = []
        for program in training_programs:
            program_data = {
                "Training_ID": program[0],
                "Training_Name": program[1],
                "Trainer_Name": program[2],
                "Duration": program[3],
                "Mode": program[4],
                "Cost": program[5],
            }
            training_program_list.append(AdminTrainingProgram(**program_data))

        return training_program_list

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()   

@router.post("/register")
async def register_admin(
    admin_data: AdminRegistration = Body(...),
    db: mysql.connector.MySQLConnection = Depends(get_db)
):
    """
    Register a new admin using the AddAdminWithContact stored procedure.
    """
    # Hash the password
    hashed_password = bcrypt.hashpw(admin_data.password.encode('utf-8'), bcrypt.gensalt())
    cursor = db.cursor()
    try:
        # Call the AddAdminWithContact stored procedure
        cursor.callproc("AddAdminWithContact", [
            admin_data.id,
            admin_data.name,
            admin_data.role,
            hashed_password,
            admin_data.email,
            admin_data.phone_number
        ])

        db.commit()
        return {"message": "Admin registered successfully"}

    except mysql.connector.Error as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

async def login_admin(
    admin_data: AdminLogin = Body(...),
    db: MySQLConnection = Depends(get_db),
):
    """
    Login an admin using their email and password with raw SQL.
    """
    # Construct the raw SQL query to fetch admin credentials
    query = """
        SELECT a.Admin_ID, a.Password
        FROM Admin a
        WHERE a.Admin_ID = %s
    """

    cursor = db.cursor()
    try:
        cursor.execute(query, (admin_data.id,))
        admin_credentials = cursor.fetchone()

        if not admin_credentials:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        admin_id, password_hash = admin_credentials

        # Verify the password
        if not bcrypt.checkpw(admin_data.password.encode('utf-8'), password_hash):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        access_token_expires = datetime.timedelta(minutes=30)  # Token expiration time
        access_token = create_access_token(
            data={"sub": str(admin_id)}, expires_delta=access_token_expires
        )

        return {"access_token": access_token, "token_type": "bearer"}

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

