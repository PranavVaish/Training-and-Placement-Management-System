from fastapi import APIRouter, Depends, HTTPException, Body
import mysql.connector
from db.connections import get_db
from models.records import PlacementReport, PlacementRecord, TopIndustry, PlacementRecordCreate
from typing import List, Dict, Any

router = APIRouter()

@router.get("/", response_model=List[PlacementRecord])
async def get_placement_records(db: mysql.connector.MySQLConnection = Depends(get_db)):
    """
    Retrieve all placement records from the database using the GetPlacementRecordsRowByRow stored procedure.
    """
    cursor = db.cursor()
    try:
        cursor.callproc("GetPlacementRecordsRowByRow")

        results = []
        for result in cursor.stored_results():
            placement_records = result.fetchall()

            if not placement_records:
                raise HTTPException(status_code=404, detail="No placement records found")

            # Convert the list of tuples to a list of dictionaries
            placement_list = []
            for record in placement_records:
                record_data = {
                    "Placement_ID": record[0],
                    "Student_Name": record[1],
                    "Company_Name": record[2],
                    "Job_Title": record[3],
                    "Package": record[4],
                    "Placement_Location": record[6],
                    "Placement_Date": record[5],
                }
                placement_list.append(PlacementRecord(**record_data))
            results.append(placement_list)

        if results:
            return results[0]
        else:
            raise HTTPException(status_code=404, detail="No placement records found")

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()


@router.get("/report", response_model=PlacementReport)
async def get_placement_report(db: mysql.connector.MySQLConnection = Depends(get_db)):
    """
    Retrieve the placement report from the database using the GetPlacementReport stored procedure.
    """
    cursor = db.cursor()
    try:
        cursor.callproc("GetPlacementReport")
        results = None
        for result in cursor.stored_results():
            results = result.fetchall()
            break

        if not results or not results[0]:
            raise HTTPException(status_code=404, detail="Placement report not found")

        report = results[0]
        placement_report = PlacementReport(
            Total_Placement_Current_Year=report[0],
            Percentage_Change_in_Total_Placement=report[1],
            Average_Package_Current_Year=report[2],
            Percentage_Change_in_Package=report[3],
            Placement_Rate_Current_Year=report[4],
            Percentage_Change_in_Placement_Rate=report[5],
        )
        return placement_report

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

@router.get("/top_industries", response_model=List[TopIndustry])
async def get_top_5_industries(db: mysql.connector.MySQLConnection = Depends(get_db)):
    """
    Retrieve the top 5 industries by placement count from the database using the GetTop5IndustriesByPlacement stored procedure.
    """
    cursor = db.cursor()
    try:
        cursor.callproc("GetTop5IndustriesByPlacement")

        results = []
        for result in cursor.stored_results():
            industry_data = result.fetchall()

            if not industry_data:
                raise HTTPException(status_code=404, detail="No industry data found")

            # Convert the list of tuples to a list of dictionaries
            industry_list = []
            for industry in industry_data:
                industry_dict = {
                    "Industry_Type": industry[0],
                    "No_of_Placements": industry[1],
                }
                industry_list.append(TopIndustry(**industry_dict))
            results.append(industry_list)

        if results:
            return results[0]
        else:
            raise HTTPException(status_code=404, detail="No industry data found")

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()

@router.get("/all_records", response_model=Dict[str, Any])
async def get_all_records(db: mysql.connector.MySQLConnection = Depends(get_db)):
    """
    Retrieve all placement records, placement report, and top 5 industries from the database.
    """
    cursor = db.cursor()
    try:

        # Get placement records
        cursor.callproc("GetPlacementRecordsRowByRow")
        placement_records = []
        for result in cursor.stored_results():
            records = result.fetchall()
            placement_records = [
                PlacementRecord(
                    Placement_ID=record[0],
                    Student_Name=record[1],
                    Company_Name=record[2],
                    Job_Title=record[3],
                    Package=record[4],
                    Placement_Date=record[5],
                    Placement_Location=record[6],
                )
                for record in records
            ]

        # Get placement report
        cursor.callproc("GetPlacementReport")
        placement_report = None
        for result in cursor.stored_results():
            report_data = result.fetchall()
            if report_data:
                report = report_data[0]
                placement_report = PlacementReport(
                    Total_Placement_Current_Year=report[0],
                    Percentage_Change_in_Total_Placement=report[1],
                    Average_Package_Current_Year=report[2],
                    Percentage_Change_in_Package=report[3],
                    Placement_Rate_Current_Year=report[4],
                    Percentage_Change_in_Placement_Rate=report[5],
                )

        # Get top industries
        cursor.callproc("GetTop5IndustriesByPlacement")
        top_industries = []
        for result in cursor.stored_results():
            industry_data = result.fetchall()
            top_industries = [
                TopIndustry(Industry_Type=industry[0], No_of_Placements=industry[1])
                for industry in industry_data
            ]

        return {
            "placement_records": placement_records,
            "placement_report": placement_report,
            "top_industries": top_industries,
        }

    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()


@router.post("/")
async def create_placement_record(
    placement_data: PlacementRecordCreate = Body(...),
    db: mysql.connector.MySQLConnection = Depends(get_db),
):
    """
    Create a new placement record using the AddPlacementRecord stored procedure.
    """
    cursor = db.cursor()
    try:
        cursor.callproc(
            "AddPlacementRecord",
            (
                placement_data.Placement_ID,
                placement_data.Student_ID,
                placement_data.Job_ID,
                placement_data.Company_ID,
                placement_data.Package,
                placement_data.Placement_Date,
                placement_data.Placement_Location,
            ),
        )
        db.commit()
        return {"message": "Placement record created successfully"}

    except mysql.connector.Error as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    finally:
        if cursor:
            cursor.close()
        if db:
            db.close()