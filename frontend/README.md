# CampusCare – Hostel Management System

CampusCare is a hostel management system developed to simplify hostel administration using a web-based application.

## Features

- Student management
- Hostel room management and allocation
- Mess attendance tracking
- Student complaint management
- Dashboard for hostel information
- Machine learning-based attendance prediction
- ETL data processing pipeline
- Task scheduling and completion tracking

## Technology Stack

**Frontend**
- React
- Vite
- CSS

**Backend**
- Python
- FastAPI
- SQLite

**Data Processing and Machine Learning**
- Pandas
- NumPy
- Scikit-learn

## Running the Project Locally

### Backend

1. Open a terminal in the `backend` folder.
2. Activate your Python virtual environment.
3. Install dependencies:

   `pip install -r requirements.txt`

4. Start the FastAPI server:

   `uvicorn main:app --reload`

5. Open the API documentation at `http://127.0.0.1:8000/docs`.

### Frontend

1. Open a terminal in the `frontend` folder.
2. Install dependencies:

   `npm install`

3. Start the frontend:

   `npm run dev`

4. Open the local URL displayed in the terminal.

## Project Status

The core application has been developed and tested locally. Deployment is a separate step and has not yet been completed.