from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, EmailStr, Field
import mysql.connector

from db.connections import get_db
from models.student import StudentLogin

from routes.students import router as students_router, login_student
from routes.companies import login_company, router as company_router
from routes.admin import login_admin, router as admin_router

app = FastAPI()
app.include_router(students_router, prefix="/students")
app.include_router(company_router, prefix="/companies")
app.include_router(admin_router, prefix="/admin")

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI application!"}


class GenericLogin(BaseModel):
    role: str = Field(..., description="Role of the user (e.g., 'student', 'company', 'admin')")
    email: EmailStr = Field(..., max_length=100)
    password: str

@app.post("/login")
async def login_user(user_data: GenericLogin, db: mysql.connector.MySQLConnection = Depends(get_db)):
    """
    Login a user (student, company, or admin) using their email and password.
    """
    role = user_data.role.lower()
    if role == "student":
        # Call the student login function
        student_login_data = StudentLogin(email=user_data.email, password=user_data.password)
        return await login_student(student_login_data, db)
    elif role == "company":
        # Call the company login function
        return await login_company(user_data.email, user_data.password, db)
    elif role == "admin":
        # Call the admin login function
        return await login_admin(user_data.email, user_data.password, db)
    else:
        raise HTTPException(
            status_code=400,
            detail="Invalid role. Please specify 'student', 'company', or 'admin'."
        )