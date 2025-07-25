# 🌐 Training and Placement Management System

A full-stack web application designed to streamline the training and placement process for colleges and universities.  
This project is divided into two parts:

- 🎨 **Frontend:** HTML, CSS, JavaScript (Vanilla)
- 🚀 **Backend:** Python FastAPI + SQLAlchemy + SQLite (or replaceable with PostgreSQL/MySQL)

---

## 📁 Project Structure

```bash
Training-and-Placement-Management-System/
├── backend/
│   ├── main.py
│   ├── models/
│   ├── routers/
│   ├── schemas/
│   ├── database.py
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── images/
└── README.md
```

---

## 🚀 Setup Instructions

### 🧩 Prerequisites

- Git
- Python (≥ 3.9)
- VS Code / Any IDE
- Live Server Extension (for frontend preview)

---

## 🔧 Clone the Repository

```bash
git clone https://github.com/PranavVaish/Training-and-Placement-Management-System.git
cd Training-and-Placement-Management-System
```

---

## 🎯 Frontend Setup

```bash
cd frontend
# Open in your preferred editor (e.g., VS Code)
npm i
npm run dev
```

Frontend Features:

- Student / Admin / Company Login
- Job listings, Placement records
- Feedback, Interview scheduling
- Fully navigable UI with form validation

---

## 🔙 Backend Setup

```bash
cd backend

# (Optional but Recommended) Create Virtual Environment
python -m venv venv
venv\Scripts\activate

# Install Dependencies
pip install -r requirements.txt

# Run the Server
uvicorn main:app --reload
```

Visit your backend at: [http://127.0.0.1:8000](http://127.0.0.1:8000)

Test with Swagger Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🧪 API Preview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/students/` | GET | List all students |
| `/companies/` | POST | Add a new company |
| `/login/` | POST | User login |
| `/training-programs/` | GET | View programs |

More APIs can be explored in Swagger UI.

---

## ✨ Future Enhancements

- JWT-based authentication 🔐
- Admin dashboard with analytics 📊
- MongoDB support for flexibility 🌱
- Email notifications 📧

---

## 👤 Author

- GitHub: [PranavVaish](https://github.com/PranavVaish)
- LinkedIn: [pranavvaish20](https://www.linkedin.com/in/pranavvaish20/)

---

## License

This project is licensed under the [MIT License](./LICENSE) © 2025 Pranav Vaish.
