from fastapi import APIRouter, Depends, HTTPException
import mysql.connector
from db.connections import get_db
from models.placement import PlacementRecord  # Assuming you have a PlacementRecord model
from typing import List

router = APIRouter()

@router.get("/", response_model=List[PlacementRecord])
async def get_placement_records(db: mysql.connector.MySQLConnection = Depends(get_db)):
    """
    Retrieve all placement records from the database using the GetPlacementRecordsRowByRow stored procedure.
    """
    try:
        cursor = db.cursor()
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
                    "Placement_Date": record[5],
                    "Placement_Location": record[6],
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