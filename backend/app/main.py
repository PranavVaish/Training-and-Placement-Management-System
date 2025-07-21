from fastapi import FastAPI, HTTPException, Depends, Body
from pydantic import BaseModel, Field
import mysql.connector
import datetime
from utils import create_access_token, generate_refresh_token
from fastapi.middleware.cors import CORSMiddleware

from db.connections import get_db
from models.student import StudentLogin
from models.admin import AdminLogin
from models.company import CompanyLogin

from routes.students import router as students_router, login_student
from routes.companies import router as company_router, login_company
from routes.admin import router as admin_router, login_admin
from routes.jobs import router as job_router
from routes.training import router as training_router
from routes.feedback import router as feedback_router
from routes.records import router as records_router

from contextlib import asynccontextmanager
from db.setup import setup_database  


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        setup_database()
    except Exception as e:
        print(f"Warning: Database setup failed: {e}")    
    yield
    pass

app = FastAPI(lifespan=lifespan)


# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(students_router, prefix="/students")
app.include_router(company_router, prefix="/companies")
app.include_router(admin_router, prefix="/admin")
app.include_router(job_router, prefix="/job")
app.include_router(training_router, prefix="/training")
app.include_router(feedback_router, prefix="/feedback")  
app.include_router(records_router, prefix="/record")

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI application!"}


class GenericLogin(BaseModel):
    role: str = Field(..., description="Role of the user (e.g., 'student', 'company', 'admin')")
    id: int = Field(..., gt=0, alias="user_id")
    password: str

@app.post("/login")
async def login_user(user_data: GenericLogin, db: mysql.connector.MySQLConnection = Depends(get_db)):
    """
    Login a user (student, company, or admin) using their email and password.
    """
    role = user_data.role.lower()
    if role == "student":
        # Call the student login function
        student_login_data = StudentLogin(user_id=user_data.id, password=user_data.password)
        return await login_student(student_login_data, db)
    elif role == "company":
        # Call the company login function
        company_login_data = CompanyLogin(user_id=user_data.id, password=user_data.password)
        return await login_company(company_login_data, db)
    elif role == "admin":
        # Call the admin login function
        admin_login_data = AdminLogin(user_id=user_data.id, password=user_data.password)
        return await login_admin(admin_login_data, db)
    else:
        raise HTTPException(
            status_code=400,
            detail="Invalid role. Please specify 'student', 'company', or 'admin'."
        )


@app.post("/refresh")  # Use POST request
async def refresh_token(
    refresh_token: str = Body(...),  # Get the refresh token from the request body
    db: mysql.connector.MySQLConnection = Depends(get_db),
):
    """
    Refresh an access token using a refresh token.
    """
    try:
        cursor = db.cursor()

        # Verify the refresh token (check if it exists, is valid, and hasn't been revoked)
        query = """
            SELECT user_id FROM refresh_tokens
            WHERE refresh_token = %s AND expiry_date > NOW() AND revoked = FALSE
        """
        cursor.execute(query, (refresh_token,))
        result = cursor.fetchone()

        if not result:
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        user_id = result[0]

        # Generate a new access token
        access_token_expires = datetime.timedelta(minutes=30)
        access_token = create_access_token(data={"sub": str(user_id)}, expires_delta=access_token_expires)

        # (Optional) Generate a new refresh token and revoke the old one (refresh token rotation)
        new_refresh_token = generate_refresh_token()

        # Revoke the old refresh token
        query_revoke = """
            UPDATE refresh_tokens SET revoked = TRUE WHERE refresh_token = %s
        """
        cursor.execute(query_revoke, (refresh_token,))

        # Store the new refresh token
        expiry_date = datetime.datetime.utcnow() + datetime.timedelta(days=30)  # Example expiry date
        query_insert = """
            INSERT INTO refresh_tokens (refresh_token, user_id, expiry_date, revoked)
            VALUES (%s, %s, %s, FALSE)
        """
        cursor.execute(query_insert, (new_refresh_token, user_id, expiry_date))

        db.commit()

        return {"access_token": access_token, "token_type": "bearer", "refresh_token": new_refresh_token}

    except mysql.connector.Error as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()


@app.post("/logout")  # Use POST request
async def logout(
    refresh_token: str = Body(...),  # Get the refresh token from the request body
    db: mysql.connector.MySQLConnection = Depends(get_db),
):
    """
    Logout the user by revoking the refresh token.
    """
    try:
        cursor = db.cursor()
        query = """
            UPDATE refresh_tokens SET revoked = TRUE WHERE refresh_token = %s
        """
        cursor.execute(query, (refresh_token,))

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Refresh token not found")

        db.commit()

        return {"message": "Logged out successfully"}

    except mysql.connector.Error as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()