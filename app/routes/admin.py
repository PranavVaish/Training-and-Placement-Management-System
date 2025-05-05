# Routes for Admin
import bcrypt
from fastapi import APIRouter, Body, Depends, HTTPException
import mysql.connector
from db.connections import get_db
from mysql.connector import MySQLConnection
from models.admin import AdminLogin, AdminResponse, AdminRegistration
from typing import List
import datetime
from utils import create_access_token

router = APIRouter()

@router.get("/", response_model=List[AdminResponse])
async def get_admin(db: MySQLConnection = Depends(get_db)):
    """
    Retrieve admin data using the GetAdminData stored procedure.
    """
    try:
        cursor = db.cursor()
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

@router.get("/dashboard")
async def get_admin_dashboard(db: MySQLConnection = Depends(get_db)):
    """
    Retrieve admin dashboard data using the GetAdminDashboard stored procedure.
    """
    ...

@router.post("/register")
async def register_admin(
    admin_data: AdminRegistration = Body(...),
    db: MySQLConnection = Depends(get_db)
):
    """
    Register a new admin using the AddAdminWithContact stored procedure.
    """
    # Hash the password
    hashed_password = bcrypt.hashpw(admin_data.password.encode('utf-8'), bcrypt.gensalt())

    try:
        cursor = db.cursor()
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
        SELECT a.Admin_ID, a.Password_Hash
        FROM Admin a
        JOIN Admin_Email ae ON a.Admin_ID = ae.Admin_ID
        WHERE ae.Email_ID = %s
    """

    try:
        cursor = db.cursor()
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

