# Routes for Students
import datetime
import bcrypt
import mysql.connector
from fastapi import APIRouter, Body, Depends, HTTPException
from db.connections import get_db
from models.student import (
    StudentListResponse,
    StudentLogin,
    StudentRegistration,
    StudentResponse,
    EnrollStudent,
    JobApplication,
    StudentApplicationResponse,
    StudentApplicationListResponse,
)
from main import create_access_token

router = APIRouter()

async def get_student_by_id(student_id: int, db: mysql.connector.MySQLConnection = Depends(get_db)):
    """
    Helper function to retrieve a student from the database by Student ID, including phone number.
    """
    query = """
        SELECT s.Student_ID, s.Name, s.CGPA, s.Graduation_Year, s.Department, sp.Phone_No, se.Email_ID
        FROM Student s
        LEFT JOIN Student_Phone sp ON s.Student_ID = sp.Student_ID
        LEFT JOIN Student_Email se ON s.Student_ID = se.Student_ID
        WHERE s.Student_ID = %s
    """
    cursor = db.cursor()
    try:
        cursor.execute(query, (student_id,))
        student = cursor.fetchone()

        if not student:
            raise HTTPException(status_code=404, detail="Student not found")

        # Convert the tuple to a dictionary
        student_data = {
            "Name": student[1],
            "Student_ID": student[0],
            "Email_ID": student[6], 
            "Phone_No": student[5], 
            "Department": student[4],
            "CGPA": student[2],
            "Graduation_Year": student[3],
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
    cursor = db.cursor()
    try:
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
    cursor = db.cursor()
    try:

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
            hashed_password,
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
        SELECT sc.Student_ID, sc.Password
        FROM Student sc
        WHERE sc.Student_ID = %s
    """

    cursor = db.cursor()
    try:
        cursor.execute(query, (student_data.id,))
        student_credentials = cursor.fetchone()

        if not student_credentials:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        student_id, password_hash = student_credentials

        # Verify the password
        if not bcrypt.checkpw(student_data.password.encode('utf-8'), password_hash):
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


@router.post("/apply")
async def apply_to_job(
    application_data: JobApplication = Body(...),
    db: mysql.connector.MySQLConnection = Depends(get_db)
):
    """
    Apply to a job using the Application table.
    """
    cursor = db.cursor()
    try:

        # Extract student_id from the access token
        student_id = application_data.student_id
        query = "SELECT 1 FROM Student WHERE Student_ID = %s"
        cursor.execute(query, (student_id,))
        student_exists = cursor.fetchone()
        if not student_exists:
            raise HTTPException(status_code=403, detail="Only Students can apply for jobs")

        # Call the stored procedure
        application_date = datetime.date.today()
        status = "Pending"
        cursor.callproc("ApplyToJob", (student_id, application_data.job_id, application_date, status))

        # Commit the changes
        db.commit()
        return {"message": "Application submitted successfully"}

    except mysql.connector.Error as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Application failed: {e}")
    except HTTPException as e:
        db.rollback()
        raise e
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

@router.get("/applications/{student_id}", response_model=StudentApplicationListResponse)
async def get_applications(
    student_id: int,
    db: mysql.connector.MySQLConnection = Depends(get_db),
):
    """
    Retrieve all job applications for a student using the stored procedure.
    """
    cursor = db.cursor()
    try:

        # Check if the student exists
        query_check = "SELECT 1 FROM Student WHERE Student_ID = %s"
        cursor.execute(query_check, (student_id,))
        student_exists = cursor.fetchone()
        if not student_exists:
            raise HTTPException(status_code=403, detail="Only Students can view applications")

        # Call the stored procedure
        cursor.callproc("GetJobApplicationsByStudent", (student_id,))

        # Fetch results from the procedure
        for result in cursor.stored_results():
            applications = result.fetchall()

        if not applications:
            raise HTTPException(status_code=404, detail="No job applications found for this student")

        # Convert the tuple to a StudentApplicationResponse object
        application_list = []
        for application in applications:
            application_data = {
                "applicationId": application[0],
                "jobId": application[1],
                "jobTitle": application[2],
                "applicationDate": application[3],
                "status": application[4],
                "companyName": application[5]
            }
            application_list.append(StudentApplicationResponse(**application_data))
        return StudentApplicationListResponse(applications=application_list)

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

@router.get("/enrolled_courses/{student_id}")
async def get_enrolled_courses(
    student_id: int,
    db: mysql.connector.MySQLConnection = Depends(get_db),
):
    """
    Retrieve all training programs a student is enrolled in using the stored procedure.
    """
    cursor = db.cursor()
    try:
        # Call the stored procedure
        cursor.callproc("GetTrainingEnrollmentsByStudent", (student_id,))

        enrollment_list = []
        for result in cursor.stored_results():
            enrollments = result.fetchall()
            for enrollment in enrollments:
                enrollment_data = {
                    "Enrollment_ID": enrollment[0],
                    "Duration": enrollment[1],
                    "Training_Name": enrollment[2],
                    "Start_Date": enrollment[3]
                }
                enrollment_list.append(enrollment_data)

        if not enrollment_list:
            raise HTTPException(status_code=404, detail="No training enrollments found for this student")

        return {"enrollments": enrollment_list}

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()


@router.post("/enroll")
async def enroll_student(
    enrollment_data: EnrollStudent,
    db: mysql.connector.MySQLConnection = Depends(get_db),
    current_user: dict = Depends(create_access_token),
):
    """
    Enroll a student in a training program using their access token and a stored procedure.
    """
    cursor = db.cursor()
    try:

        # Extract student_id from the access token
        student_id = current_user.get("sub")
        if not student_id:
            raise HTTPException(status_code=401, detail="Invalid access token")

        # Call the stored procedure
        cursor.callproc("EnrollStudentInTraining", (enrollment_data.training_id, student_id))

        # Commit the changes
        db.commit()

        return {"message": "Student enrolled successfully"}

    except mysql.connector.Error as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Enrollment failed: {e}")
    except HTTPException as e:
        db.rollback()
        raise e
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()