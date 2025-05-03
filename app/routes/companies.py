# Routes for Companies
from fastapi import APIRouter, Body, Depends, HTTPException
import mysql.connector
from db.connections import get_db
from models.company import CompanyLogin, CompanyResponse, CompanyRegistration
import bcrypt

router = APIRouter()

async def get_company_by_id(company_id: int, db: mysql.connector.MySQLConnection = Depends(get_db)):
    """
    Helper function to retrieve a company from the database by Company_ID, including phone number.
    """
    query = """
        SELECT c.Company_ID, c.Name, c.Industry_Type, c.Contact_Person, c.Website, cp.Phone_No, cl.Location
        FROM Company c LEFT JOIN Company_Phone cp ON c.Company_ID = cp.Company_ID
        LEFT JOIN Company_Location cl ON c.Company_ID = cl.Company_ID
        WHERE Company_ID = %s
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
        }

        return CompanyResponse(**company_data)

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        cursor.close()
        db.close()

async def login_company(
    company_data: CompanyLogin = Body(...),  # Use CompanyLogin model
    db: mysql.connector.MySQLConnection = Depends(get_db),
):
    """
    Login a company using their email and password with raw SQL.
    """
    query = """
        SELECT Company_ID, Password_Hash
        FROM Company_Credentials
        WHERE Email_ID = %s
    """

    try:
        cursor = db.cursor()
        cursor.execute(query, (company_data.email,))
        company_credentials = cursor.fetchone()

        if not company_credentials:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        company_id, password_hash = company_credentials

        # Verify the password
        if not bcrypt.checkpw(company_data.password.encode('utf-8'), password_hash.encode('utf-8')):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        # If password is correct, retrieve the company using raw SQL
        company_info = await get_company_by_id(company_id, db)

        # Return the company (without the password hash)
        return company_info

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        cursor.close()
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

        # Insert the company into the Company table
        query_company = """
            INSERT INTO Company (Name, Industry_Type, Contact_Person, Website)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(query_company, (company_data.name, company_data.industry_type, company_data.contact_person, company_data.website))
        company_id = cursor.lastrowid  # Get the auto-generated ID

        # Insert the email into the Company_Email table
        query_email = """
            INSERT INTO Company_Email (Company_ID, Email_ID)
            VALUES (%s, %s)
        """
        cursor.execute(query_email, (company_id, company_data.email))

        # Insert the phone number into the Company_Phone table
        query_phone = """
            INSERT INTO Company_Phone (Company_ID, Phone_No)
            VALUES (%s, %s)
        """
        cursor.execute(query_phone, (company_id, company_data.phone_no))

        # Insert the location into the Company_Location table
        query_location = """
            INSERT INTO Company_Location (Company_ID, Location)
            VALUES (%s, %s)
        """
        cursor.execute(query_location, (company_id, company_data.location))

        # Insert the credentials into the Company_Credentials table
        query_credentials = """
            INSERT INTO Company_Credentials (Company_ID, Password_Hash)
            VALUES (%s, %s)
        """
        cursor.execute(query_credentials, (company_id, hashed_password.decode("utf-8")))

        db.commit()  # Commit the transaction

        return {"message": "Company registered successfully", "company_id": company_id}

    except mysql.connector.Error as e:
        db.rollback()  # Rollback in case of error
        raise HTTPException(status_code=500, detail=f"Registration failed: {e}")
    finally:
        cursor.close()
        db.close()