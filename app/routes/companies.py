# Routes for Companies
from fastapi import APIRouter, Body, Depends, HTTPException
import mysql.connector
from db.connections import get_db
from models.company import CompanyLogin, CompanyResponse, CompanyRegistration
import bcrypt
import datetime
from main import create_access_token

router = APIRouter()


async def get_company_by_id(company_id: int, db: mysql.connector.MySQLConnection = Depends(get_db)):
    """
    Helper function to retrieve a company from the database by Company_ID, including phone number.
    """
    query = """
        SELECT c.Company_ID, c.Name, c.Industry_Type, c.Contact_Person, c.Website, cp.Phone_No, cl.Location, ce.Email_ID
        FROM Company c LEFT JOIN Company_Phone cp ON c.Company_ID = cp.Company_ID
        LEFT JOIN Company_Location cl ON c.Company_ID = cl.Company_ID
        LEFT JOIN Company_Email ce ON c.Company_ID = ce.Company_ID
        WHERE c.Company_ID = %s
    """
    try:
        cursor = db.cursor()
        cursor.execute(query, (company_id,))
        company = cursor.fetchone()

        if not company:
            raise HTTPException(status_code=404, detail="Company not found")

        # Convert the tuple to a dictionary
        company_data = {
            "Company_ID": company[0],
            "Name": company[1],
            "Industry_Type": company[2],
            "Contact_Person": company[3],
            "Website": company[4],
            "Phone_No": company[5],
            "Location": company[6],
            "Email_ID": company[7],
        }

        return CompanyResponse(**company_data)

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()


@router.get("/{company_id}", response_model=CompanyResponse)
async def get_company(
    company_id: int,
    db: mysql.connector.MySQLConnection = Depends(get_db),
):
    """
    Retrieve a company from the database by Company_ID.
    """
    return await get_company_by_id(company_id, db)

@router.get("/")
async def get_all_companies(
    db: mysql.connector.MySQLConnection = Depends(get_db),
):
    """
    Retrieve all companies from the database.
    """
    query = "SELECT * FROM Company"
    try:
        cursor = db.cursor()
        cursor.execute(query)
        companies = cursor.fetchall()

        if not companies:
            raise HTTPException(status_code=404, detail="No companies found")

        # Convert the list of tuples to a list of dictionaries
        company_list = [
            {
                "Company_ID": company[0],
                "Name": company[1],
                "Industry_Type": company[2],
                "Contact_Person": company[3],
                "Website": company[4],
                "Password": company[5],
            }
            for company in companies
        ]

        return {"companies": company_list}

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

@router.post("/register")
async def register_company(
    company_data: CompanyRegistration = Body(...),  # Use CompanyResponse model
    db: mysql.connector.MySQLConnection = Depends(get_db),
):
    """
    Register a new company.
    """
    try:
        cursor = db.cursor()

        # Hash the password
        hashed_password = bcrypt.hashpw(company_data.password.encode("utf-8"), bcrypt.gensalt())

        # Call the stored procedure
        cursor.callproc("AddCompanyWithDetails", (
            company_data.company_id,
            company_data.name,
            company_data.industry_type,
            company_data.contact_person,
            company_data.website,
            hashed_password,  # Pass the hashed password
            company_data.email,
            company_data.phone_no,
            company_data.location,
        ))

        db.commit()

        return {"message": "Company registered successfully"}

    except mysql.connector.Error as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Registration failed: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()


async def login_company(
    email: str, password: str,  # Use CompanyLogin model
    db: mysql.connector.MySQLConnection = Depends(get_db),
):
    """
    Login a company using their email and password with raw SQL and return a JWT token.
    """
    query = """
        SELECT c.Company_ID, c.Password
        FROM Company c
        JOIN Company_Email ce ON c.Company_ID = ce.Company_ID
        WHERE ce.Email_ID = %s
    """
    company_data = CompanyLogin(email=email, password=password)

    try:
        cursor = db.cursor()
        cursor.execute(query, (company_data.email,))
        company_credentials = cursor.fetchone()

        if not company_credentials:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        company_id, password_hash = company_credentials

        # Verify the password
        if not bcrypt.checkpw(company_data.password.encode('utf-8'), password_hash):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # Generate JWT token
        access_token_expires = datetime.timedelta(minutes=30)  # Token expiration time
        access_token = create_access_token(
            data={"sub": str(company_id)}, expires_delta=access_token_expires
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


@router.get("/hiring_history/{company_id}")
async def get_hiring_history(
    company_id: int,
    db: mysql.connector.MySQLConnection = Depends(get_db),
):
    """
    Retrieve the hiring history of a company using the GetHiringHistoryDetails stored procedure.
    """
    try:
        cursor = db.cursor()
        cursor.callproc("GetHiringHistoryDetails", (company_id,))

        for result in cursor.stored_results():
            hiring_history = result.fetchall()

            if not hiring_history:
                raise HTTPException(status_code=404, detail="No hiring history found")

            # Convert the list of tuples to a list of dictionaries
            hiring_list = [
                {
                    "Company_Name": row[0],
                    "Candidate_Name": row[1],
                    "Department": row[2],
                    "Hiring_Period": row[3],
                    "Job_Roles": row[4],
                }
                for row in hiring_history
            ]

        return {"hiring_history": hiring_list}

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()


