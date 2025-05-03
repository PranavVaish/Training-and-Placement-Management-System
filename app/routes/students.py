# Routes for Students
import bcrypt
from fastapi import APIRouter, Body, Depends, HTTPException
import mysql.connector
from db.connections import get_db
from models.student import StudentListResponse, StudentLogin, StudentRegistration, StudentResponse
import datetime
from main import create_access_token

router = APIRouter()

async def get_student_by_id(student_id: int, db: mysql.connector.MySQLConnection = Depends(get_db)):
    """
    Helper function to retrieve a student from the database by Student ID, including phone number.
    """
    query = """
        SELECT s.Student_ID, s.Name, s.CGPA, s.Graduation_Year, s.Department, sp.Phone_No
        FROM Student s
        LEFT JOIN Student_Phone sp ON s.Student_ID = sp.Student_ID
        WHERE s.Student_ID = %s
    """
    try:
        cursor = db.cursor()
        cursor.execute(query, (student_id,))
        student = cursor.fetchone()

        if not student:
            raise HTTPException(status_code=404, detail="Student not found")

        # Convert the tuple to a dictionary
        student_data = {
            "Student_ID": student[0],
            "Name": student[1],
            "CGPA": student[2],
            "Graduation_Year": student[3],
            "Department": student[4],
            "Phone_Number": student[5]  # Add phone number
        }

        return StudentResponse(**student_data)

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

@router.get("/", response_model=StudentListResponse)
async def get_all_students(db: mysql.connector.MySQLConnection = Depends(get_db)):
    """
    Retrieve all students from the database.
    """
    query = """
        SELECT s.Student_ID, s.Name, s.CGPA, s.Graduation_Year, s.Department, sp.Phone_No
        FROM Student s
        LEFT JOIN Student_Phone sp ON s.Student_ID = sp.Student_ID
    """
    try:
        cursor = db.cursor()
        cursor.execute(query)
        students = cursor.fetchall()

        if not students:
            raise HTTPException(status_code=404, detail="Students not found")

        # Convert the tuple to a dictionary or a Student object
        student_list = []
        for student in students:
            student_data = {
                "Student_ID": student[0],
                "Name": student[1],
                "CGPA": student[2],
                "Graduation_Year": student[3],
                "Department": student[4],
                "Phone_Number": student[5]  # Add phone number
            }
            student_list.append(StudentResponse(**student_data))
        return StudentListResponse(students=student_list)

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

@router.get("/{student_id}", response_model=StudentResponse)
async def get_student(student_id: int, db: mysql.connector.MySQLConnection = Depends(get_db)):
    """
    Retrieve a student from the database by Student ID.
    """
    return await get_student_by_id(student_id, db)

@router.post("/register")
async def register_student(
    student_data: StudentRegistration = Body(...),  # Use StudentRegistration model
    db: mysql.connector.MySQLConnection = Depends(get_db),
):
    """
    Register a new student using a stored procedure.
    """
    try:
        cursor = db.cursor()

        # Check if the student already exists
        query_check = """
            SELECT 1 FROM Student WHERE Student_ID = %s
        """
        cursor.execute(query_check, (student_data.student_id,))
        existing_student = cursor.fetchone()

        if existing_student:
            raise HTTPException(status_code=400, detail="Student with this ID already exists")

        # Hash the password
        hashed_password = bcrypt.hashpw(student_data.password.encode("utf-8"), bcrypt.gensalt())

        # Call the stored procedure
        cursor.callproc("AddStudentWithContact", (
            student_data.student_id,  # Assuming student_id is provided in the request
            student_data.name,
            student_data.cgpa,
            student_data.graduation_year,
            student_data.department,
            hashed_password.decode("utf-8"),
            student_data.email,
            student_data.phone_number
        ))

        # Commit the changes
        db.commit()

        return {"message": "Student registered successfully"}

    except mysql.connector.Error as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Registration failed: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()


async def login_student(
    student_data: StudentLogin = Body(...),  # Use StudentLogin model
    db: mysql.connector.MySQLConnection = Depends(get_db),
):
    """
    Login a student using their email and password with raw SQL and return a JWT token.
    """
    # Construct the raw SQL query to fetch student credentials
    query = """
        SELECT sc.Student_ID, sc.Password_Hash
        FROM Student_Credentials sc
        JOIN Student s ON s.Student_ID = sc.Student_ID
        JOIN Student_Email se ON s.Student_ID = se.Student_ID
        WHERE se.Email_ID = %s
    """

    try:
        cursor = db.cursor()
        cursor.execute(query, (student_data.email,))
        student_credentials = cursor.fetchone()

        if not student_credentials:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        student_id, password_hash = student_credentials

        # Verify the password
        if not bcrypt.checkpw(student_data.password.encode('utf-8'), password_hash.encode('utf-8')):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # Generate JWT token
        access_token_expires = datetime.timedelta(minutes=30)  # Token expiration time
        access_token = create_access_token(
            data={"sub": str(student_id)}, expires_delta=access_token_expires
        )

        # Return the token
        return {"access_token": access_token, "token_type": "bearer"}

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()
