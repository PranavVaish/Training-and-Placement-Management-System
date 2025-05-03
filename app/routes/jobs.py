from fastapi import APIRouter, Depends, HTTPException
import mysql.connector
from db.connections import get_db
from app.models.jobs import JobListResponse, JobResponse  # Assuming you have JobResponse model

router = APIRouter()

@router.get("/", response_model=JobListResponse)
async def get_all_jobs(db: mysql.connector.MySQLConnection = Depends(get_db)):
    """
    Retrieve all jobs from the database.
    """
    query = """
        SELECT Job_ID, Company_ID, Title, Description, Requirements, Location, Salary, Date_Posted
        FROM Job
    """
    try:
        cursor = db.cursor()
        cursor.execute(query)
        jobs = cursor.fetchall()

        if not jobs:
            raise HTTPException(status_code=404, detail="Jobs not found")

        # Convert the tuple to a dictionary or a Job object
        job_list = []
        for job in jobs:
            job_data = {
                "Job_ID": job[0],
                "Company_ID": job[1],
                "Title": job[2],
                "Description": job[3],
                "Requirements": job[4],
                "Location": job[5],
                "Salary": job[6],
                "Date_Posted": job[7],
            }
            job_list.append(JobResponse(**job_data))

        return JobListResponse(jobs=job_list)

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

