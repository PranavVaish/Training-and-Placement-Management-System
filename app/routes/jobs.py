from fastapi import APIRouter, Depends, HTTPException, Body, Header
import mysql.connector
from db.connections import get_db
from models.jobs import JobListResponse, JobResponse, JobCreate
from utils import verify_token

router = APIRouter()

@router.get("/", response_model=JobListResponse)
async def get_all_jobs(db: mysql.connector.MySQLConnection = Depends(get_db)):
    """
    Retrieve all active jobs with company name from the database using a stored procedure.
    """
    cursor = db.cursor()
    try:
        cursor.callproc("GetNotExpiredJobListingsWithCompanyName")

        results = []
        for result in cursor.stored_results():
            jobs = result.fetchall()

            if not jobs:
                raise HTTPException(status_code=404, detail="Jobs not found")

            # Convert the tuple to a dictionary or a Job object
            job_list = []
            for job in jobs:
                job_data = {
                    "Job_ID": job[0],
                    "Title": job[1],
                    "Company_Name": job[3],  # Assuming company name is the 4th column
                    "Location_List": job[8].split(",") if job[8] else [],
                    "Salary": job[2],
                    "Job_Type": job[4],
                    "Application_Deadline": job[5],
                    "Job_Description": job[6],
                    "Vacancies": job[7],
                    "Eligibility_Criteria_List": job[9].split(",") if job[9] else [],
                }
                job_list.append(JobResponse(**job_data))
            results.append(job_list)

        if results:
            return JobListResponse(jobs=results[0])
        else:
            raise HTTPException(status_code=404, detail="Jobs not found")

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

@router.post("/")
async def create_job(
    job_data: JobCreate = Body(...),
    db: mysql.connector.MySQLConnection = Depends(get_db),
    authorization: str = Header(None),  # Get the Authorization header
):
    """
    Create a new job listing using the AddJobWithMultipleDetails stored procedure.
    Only companies are allowed to create jobs.
    """
    cursor = db.cursor()
    try:
        if not authorization:
            raise HTTPException(status_code=401, detail="Authorization header is missing")

        try:
            token_prefix, token = authorization.split(" ")
            if token_prefix.lower() != "bearer":
                raise HTTPException(status_code=401, detail="Invalid authorization scheme")
        except ValueError:
            raise HTTPException(status_code=401, detail="Invalid authorization header format")

        # Verify the token and extract the company ID
        company_id = verify_token(token)

        # Check if the user is a company
        query = """
            SELECT Company_ID FROM Company WHERE Company_ID = %s
        """
        
        cursor.execute(query, (company_id,))
        company = cursor.fetchone()

        if not company:
            raise HTTPException(
                status_code=403, detail="Only companies are allowed to create jobs"
            )

        locations = ",".join(job_data.Location_List)
        eligibility_criteria = ",".join(job_data.Eligibility_Criteria_List)

        # Call the stored procedure
        cursor.callproc(
            "AddJobWithMultipleDetails",
            (
                job_data.Job_Title,
                job_data.Job_Description,
                job_data.Salary,
                job_data.Company_ID,
                job_data.Job_Type,
                job_data.Vacancies,
                job_data.Application_Deadline,
                eligibility_criteria,
                locations,
            ),
        )
        db.commit()
        return {"message": "Job created successfully"}

    except mysql.connector.Error as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()


@router.get("/active/{company_id}", response_model=JobListResponse)
async def get_active_jobs_by_company(company_id: int, db: mysql.connector.MySQLConnection = Depends(get_db)):
    """
    Retrieve all active jobs for a specific company from the database using a stored procedure.
    """
    cursor = db.cursor()
    try:
        cursor.callproc("GetActiveJobListingsByCompany", (company_id,))

        results = []
        for result in cursor.stored_results():
            jobs = result.fetchall()

            if not jobs:
                raise HTTPException(status_code=404, detail="Jobs not found")

            # Convert the tuple to a dictionary or a Job object
            job_list = []
            for job in jobs:
                job_data = {
                    "Title": job[1],
                    "Salary": job[2],
                    "Job_Type": job[4],
                    "Application_Deadline": job[5],
                    "Job_ID": job[0],
                    "Job_Description": job[6],
                    "Vacancies": job[7],
                    "Location_List": job[8].split(",") if job[8] else [],
                    "Eligibility_Criteria_List": job[9].split(",") if job[9] else [],
                }
                job_list.append(JobResponse(**job_data))
            results.append(job_list)

        if results:
            return JobListResponse(jobs=results[0])
        else:
            raise HTTPException(status_code=404, detail="Jobs not found")

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()


@router.get("/expired/{company_id}", response_model=JobListResponse)
async def get_expired_jobs_by_company(company_id: int, db: mysql.connector.MySQLConnection = Depends(get_db)):
    """
    Retrieve all expired jobs for a specific company from the database using a stored procedure.
    """
    cursor = db.cursor()
    try:
        cursor.callproc("GetExpiredJobListingsByCompany", (company_id,))

        results = []
        for result in cursor.stored_results():
            jobs = result.fetchall()

            if not jobs:
                raise HTTPException(status_code=404, detail="Jobs not found")

            # Convert the tuple to a dictionary or a Job object
            job_list = []
            for job in jobs:
                job_data = {
                    "Job_ID": job[0],
                    "Company_Name": job[3],  # Assuming company name is the 4th column
                    "Title": job[1],
                    "Salary": job[2],
                    "Job_Type": job[4],
                    "Application_Deadline": job[5],
                }
                job_list.append(JobResponse(**job_data))
            results.append(job_list)

        if results:
            return JobListResponse(jobs=results[0])
        else:
            raise HTTPException(status_code=404, detail="Jobs not found")

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()