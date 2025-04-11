# Placement Management System API

This project is a FastAPI-based backend for managing placements, jobs, companies, and students.

## Features
- Manage students, companies, jobs, and placements.
- RESTful API endpoints for CRUD operations.
- Modular structure with routers for different entities.

## Prerequisites
- Python 3.10 or higher installed on your system.

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Project
```

### 2. Create a Virtual Environment
```bash
python -m venv .venv
```

### 3. Activate the Virtual Environment
- **Linux/MacOS:**
    ```bash
    source .venv/bin/activate
    ```
- **Windows:**
    ```powershell
    .venv\Scripts\activate
    ```

### 4. Install Requirements
```bash
pip install -r requirements.txt
```

### 5. Run the Application
```bash
fastapi dev main.py
```

### 6. Access the API
- Open your browser and navigate to: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- API documentation is available at:
    - Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
    - ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

## Project Structure
```
Project/
├── main.py             # Entry point of the application
├── routes/             # API route definitions
├── schemas.py          # Pydantic models for data validation
├── db.py               # Database connection setup
├── queries.py          # SQL queries
├── requirements.txt    # Python dependencies
└── .gitignore          # Ignored files and directories
```

## License
This project is licensed under the MIT License.  