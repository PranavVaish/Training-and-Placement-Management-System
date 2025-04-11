from fastapi import FastAPI
from routes import student, company, job, placement

app = FastAPI()

# Include routers
app.include_router(student.router, prefix="/students", tags=["Students"])
app.include_router(company.router, prefix="/companies", tags=["Companies"])
app.include_router(job.router, prefix="/jobs", tags=["Jobs"])
app.include_router(placement.router, prefix="/placements", tags=["Placements"])

# Home route
@app.get("/")
def read_home():
    return({"message": "Welcome to the Placement Management System API!"})