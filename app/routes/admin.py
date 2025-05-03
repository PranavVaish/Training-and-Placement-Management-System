# Routes for Admin
import bcrypt
from fastapi import APIRouter, Body, Depends, HTTPException
import mysql.connector
from db.connections import get_db
from mysql.connector import MySQLConnection
from models.admin import AdminLogin, AdminResponse
from typing import List

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

        return {"access_token": "test_token"}

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

