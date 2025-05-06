from pydantic import BaseModel
from datetime import date

class PlacementReport(BaseModel):
    Total_Placement_Current_Year: int
    Percentage_Change_in_Total_Placement: float
    Average_Package_Current_Year: float
    Percentage_Change_in_Package: float
    Placement_Rate_Current_Year: float
    Percentage_Change_in_Placement_Rate: float

class PlacementRecord(BaseModel):
    Placement_ID: int
    Student_Name: str
    Company_Name: str
    Job_Title: str
    Package: float
    Placement_Location: str
    Placement_: date

class TopIndustry(BaseModel):
    Industry_Type: str
    No_of_Placements: int

class PlacementRecordCreate(BaseModel):
    Placement_ID: int
    Student_ID: int
    Job_ID: int
    Company_ID: int
    Package: float
    Placement_Date: date
    Placement_Location: str