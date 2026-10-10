# CampusCare – Hostel Management System

## 1. About the Project

CampusCare is a web-based hostel management system developed to simplify hostel administration. It combines student management, room management, room allocation, mess attendance, complaint management, dashboard information, machine learning-based attendance prediction, ETL data processing, and task scheduling in one application.

The project uses React for the frontend, Python FastAPI for the backend, and SQLite for database storage.

## 2. Project Objectives

- Manage student information.
- Manage hostel rooms and room occupancy.
- Allocate students to available rooms.
- Record and view mess attendance.
- Manage student complaints.
- Display hostel information on a dashboard.
- Process data using an ETL pipeline.
- Demonstrate attendance prediction using machine learning.
- Schedule hostel-related tasks and track their completion.

## 3. Modules and Their Functions

### 3.1 Student Management
- Add, view, retrieve, and delete student records.
- Store student name, email, phone number, department, and academic year.
- Database table: `students`

### 3.2 Room Management
- Add, view, update, and delete room records.
- Maintain room number, capacity, occupancy, and availability status.
- Database table: `rooms`

### 3.3 Room Allocation
- Allocate students to hostel rooms.
- Record the allocation date and time.
- View and remove allocation records.
- Check whether the student and room exist and whether the room has available capacity.
- Database table: `allocations`

### 3.4 Mess Attendance
- Record student attendance.
- View attendance records and individual student attendance history.
- Delete attendance records.
- Database table: `mess_attendance`

### 3.5 Complaint Management
- Register student complaints.
- Store complaint category and description.
- Track complaint status, such as Pending.
- View, update, and delete complaints.
- Database table: `complaints`

### 3.6 Dashboard
- Display hostel information provided by the backend dashboard API.
- Endpoint: `GET /dashboard`

### 3.7 Machine Learning Attendance Prediction
- Uses a Scikit-learn Decision Tree Classifier.
- Provides an attendance classification through an API.
- Endpoint: `GET /ml/predict-attendance/{student_id}`

**Note:** The current model uses student ID as its feature. It is an experimental demonstration, not a validated prediction of future attendance.

### 3.8 ETL Data Processing
ETL stands for Extract, Transform, and Load.

- `extract.py` – extracts application data.
- `transform.py` – transforms the data.
- `load.py` – loads processed data into CSV files.
- `pipeline.py` – runs the ETL pipeline.

The pipeline supports students, rooms, attendance, complaints, and allocations.

### 3.9 Task Scheduling
- Create tasks with a task name, type, and scheduled time.
- View scheduled tasks.
- Mark tasks as completed.

The current scheduler stores tasks in application memory. Tasks may be lost when the backend restarts.

## 4. Technologies Used

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| Vite | Frontend development server |
| CSS | Interface styling |
| Python | Backend programming |
| FastAPI | REST API development |
| Uvicorn | Backend server |
| SQLite | Database |
| Pandas | Data processing |
| NumPy | Numerical operations |
| Scikit-learn | Machine learning |
| Joblib | Model file handling, where used |
| Git | Version control |
| GitHub | Source code hosting |

## 5. System Architecture

```text
User
 |
 v
React Frontend
 |
 v
FastAPI Backend
 |
 +---- Student Management
 +---- Room Management
 +---- Room Allocation
 +---- Mess Attendance
 +---- Complaint Management
 +---- Dashboard
 +---- Machine Learning
 +---- Task Scheduling
 |
 v
SQLite Database
 |
 v
ETL Pipeline
 |
 v
Processed CSV Files
```

## 6. Project Folder Structure

```text
CAMPUSCARE/
|
|-- backend/
|   |-- db/
|   |   |-- database.py
|   |-- etl/
|   |   |-- extract.py
|   |   |-- transform.py
|   |   |-- load.py
|   |   |-- pipeline.py
|   |-- ml/
|   |   |-- attendance_model.py
|   |-- scheduling/
|   |   |-- scheduler.py
|   |-- main.py
|   |-- requirements.txt
|
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- App.jsx
|   |   |-- App.css
|   |   |-- index.css
|   |   |-- main.jsx
|   |-- package.json
|   |-- package-lock.json
|   |-- vite.config.js
|
|-- .gitignore
|-- README.md
```

## 7. Software Requirements

Install the following software to run the project:

1. **Python 3.10 or later**  
   https://www.python.org/downloads/

2. **Node.js LTS and npm**  
   https://nodejs.org/

3. **Git** (if cloning through the terminal)  
   https://git-scm.com/downloads

4. **Visual Studio Code** (recommended)  
   https://code.visualstudio.com/

SQLite is available through Python's built-in `sqlite3` module. A separate database server is not required.

## 8. How to Download the Project

Clone the repository using the HTTPS URL shown in the GitHub repository's Code menu:

```bash
git clone <YOUR_REPOSITORY_URL>
cd CAMPUSCARE
```

Alternatively, click **Code → Download ZIP** on GitHub and extract the downloaded ZIP file.

## 9. How to Run the Backend

Open a terminal in the project folder.

### Step 1: Enter the backend folder

```powershell
cd backend
```

### Step 2: Create a Python virtual environment

```powershell
python -m venv venv
```

### Step 3: Activate the environment on Windows

```powershell
.\venv\Scripts\Activate.ps1
```

### Step 4: Install Python dependencies

```powershell
pip install -r requirements.txt
```

### Step 5: Initialize the database

```powershell
python db/database.py
```

This creates the SQLite database and tables. Since the local database is excluded from Git, a fresh installation may not contain the original development records.

### Step 6: Start the backend server

```powershell
uvicorn main:app --reload
```

Backend address:

`http://127.0.0.1:8000`

API documentation:

`http://127.0.0.1:8000/docs`

Keep the backend terminal running.

## 10. How to Run the Frontend

Open a second terminal in VS Code.

### Step 1: Enter the frontend folder

```powershell
cd frontend
```

### Step 2: Install frontend dependencies

```powershell
npm install
```

### Step 3: Start the frontend

```powershell
npm run dev
```

Open the local URL displayed in the terminal, usually:

`http://localhost:5173`

If Vite displays a different port, use the URL printed in the terminal.

## 11. API Endpoints

| Module | Main API endpoints |
|---|---|
| General | `GET /`, `GET /health` |
| Students | `GET /students`, `POST /students`, `GET /students/{student_id}`, `DELETE /students/{student_id}` |
| Rooms | `GET /rooms`, `POST /rooms`, `GET /rooms/{room_id}`, `PUT /rooms/{room_id}`, `DELETE /rooms/{room_id}` |
| Attendance | `GET /attendance`, `POST /attendance`, `GET /attendance/student/{student_id}`, `DELETE /attendance/{attendance_id}` |
| Complaints | `GET /complaints`, `POST /complaints`, `GET /complaints/{complaint_id}`, `PUT /complaints/{complaint_id}`, `DELETE /complaints/{complaint_id}` |
| Allocations | `GET /allocations`, `POST /allocations`, `GET /allocations/student/{student_id}`, `DELETE /allocations/{allocation_id}` |
| Dashboard | `GET /dashboard` |
| Machine Learning | `GET /ml/predict-attendance/{student_id}` |
| Scheduling | `GET /schedule`, `POST /schedule`, `PUT /schedule/{task_id}/complete` |

Use `http://127.0.0.1:8000/docs` to inspect request formats and test the APIs.

## 12. How to Test the Project

1. Start the backend and frontend.
2. Add a test student.
3. Add a room with a valid capacity.
4. Allocate the student to that room.
5. Verify that the allocation appears and room occupancy updates.
6. Add an attendance record for the student.
7. Create a complaint and update its status.
8. Check the dashboard.
9. Run the ETL pipeline and inspect the generated CSV files.
10. Generate the ML model before testing the prediction endpoint, if the model file is not present.
11. Create a scheduled task and mark it as completed.

Use test records rather than real student information. The database must contain the necessary students and rooms before testing related features.

## 13. How to Run the ETL Pipeline

From the `backend` folder:

```powershell
python etl/extract.py
```

Run the complete pipeline:

```powershell
python etl/pipeline.py
```

The pipeline generates CSV files in `backend/etl/output/`. These are generated locally and are excluded from Git.

## 14. Machine Learning Setup

The machine learning code is located at:

`backend/ml/attendance_model.py`

The project uses a Decision Tree Classifier for attendance classification.

The trained model file is excluded from Git. On a new computer, inspect the training script and run it using the appropriate command to generate the required model file before testing the prediction API.

The current model is a prototype. More relevant features, representative training data, and proper evaluation are needed before it can be used for real-world decisions.

## 15. Database Tables

| Table | Information stored |
|---|---|
| `students` | Student and academic details |
| `rooms` | Room number, capacity, occupancy, and status |
| `mess_attendance` | Student attendance records |
| `complaints` | Complaint descriptions, categories, and statuses |
| `allocations` | Student-room allocation records |

## 16. Troubleshooting

**Backend dependencies are missing:** Activate the virtual environment and run `pip install -r requirements.txt`.

**Frontend dependencies are missing:** Enter `frontend` and run `npm install`.

**Database tables are missing:** From `backend`, run `python db/database.py`.

**Frontend cannot connect to the backend:** Check the backend server, frontend API URL, and CORS configuration.

**ML model file is missing:** Generate the model using the project's training script.

**ETL output is missing:** Run `python etl/pipeline.py` from the `backend` directory.

**Room allocation fails:** Check that the student and room exist and the room has available capacity.

## 17. Current Project Status

- [x] React frontend
- [x] FastAPI backend
- [x] SQLite database
- [x] Student management
- [x] Room management
- [x] Room allocation
- [x] Mess attendance
- [x] Complaint management
- [x] Dashboard API
- [x] Attendance prediction prototype
- [x] ETL pipeline
- [x] Task scheduling
- [x] GitHub source code upload
- [ ] Production deployment
- [ ] Automated testing suite
- [ ] Persistent scheduling storage
- [ ] Authentication and role-based access

## 18. Future Enhancements

- Add login and authentication for students and administrators.
- Introduce role-based access control.
- Store scheduled tasks persistently.
- Improve the machine learning model and its evaluation.
- Add automated tests.
- Improve validation, security, and error handling.
- Deploy the frontend and backend online.

## 19. Project Information

**Project Name:** CampusCare – Hostel Management System  
**Frontend:** React and Vite  
**Backend:** Python and FastAPI  
**Database:** SQLite  
**Repository:** https://github.com/ranganamukunda19-dot/CampusCare.

CampusCare is an academic project demonstrating full-stack development, database management, ETL processing, machine learning, and task scheduling.
