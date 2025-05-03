# Routes for Admin
import bcrypt
from fastapi import APIRouter, Body, Depends, HTTPException
import mysql.connector
from db.connections import get_db
from mysql.connector import MySQLConnection
from models.admin import AdminLogin, AdminResponse

router = APIRouter()

async def get_admin_by_id(admin_id: int, db: MySQLConnection = Depends(get_db)):
    """
    Helper function to retrieve an admin from the database by Admin ID, including phone number.
    """
    query = """
        SELECT a.Admin_ID, a.Name, a.Role, ap.Phone_No
        FROM Admin a
        LEFT JOIN Admin_Phone ap ON a.Admin_ID = ap.Admin_ID
        WHERE a.Admin_ID = %s
    """
    try:
        cursor = db.cursor()
        cursor.execute(query, (admin_id,))
        admin = cursor.fetchone()

        if not admin:
            raise HTTPException(status_code=404, detail="Admin not found")

        # Convert the tuple to a dictionary
        admin_data = {
            "Admin_ID": admin[0],
            "Name": admin[1],
            "Role": admin[2],
            "Phone_Number": admin[3]  # Add phone number
        }

        return AdminResponse(**admin_data)

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

async def login_admin(
    admin_data: AdminLogin = Body(...),  # Use AdminLogin model
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
        cursor.execute(query, (admin_data.email,))
        admin_credentials = cursor.fetchone()

        if not admin_credentials:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        admin_id, password_hash = admin_credentials

        # Verify the password
        if not bcrypt.checkpw(admin_data.password.encode('utf-8'), password_hash.encode('utf-8')):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # If password is correct, retrieve the admin using raw SQL
        admin_info = await get_admin_by_id(admin_id, db)

        # Return the admin (without the password hash)
        return admin_info

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

