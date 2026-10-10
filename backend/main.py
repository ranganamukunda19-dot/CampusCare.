from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ml.attendance_model import predict_attendance
from pydantic import BaseModel
import sqlite3

from db.database import get_connection, create_tables
from scheduling.scheduler import add_task, get_tasks, complete_task


app = FastAPI(
    title="CampusCare API",
    description="Hostel Management System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://campuscare-frontend-8zlb.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables when the application starts
@app.on_event("startup")
def startup():
    create_tables()


# -------------------------
# Home
# -------------------------

@app.get("/")
def home():
    return {
        "message": "Welcome to CampusCare!"
    }


# -------------------------
# Health Check
# -------------------------

@app.get("/health")
def health():
    return {
        "status": "CampusCare backend is running"
    }


# -------------------------
# Student Model
# -------------------------

class Student(BaseModel):
    name: str
    email: str
    phone: str | None = None
    department: str | None = None
    year: int | None = None


# -------------------------
# ADD STUDENT
# -------------------------

@app.post("/students")
def add_student(student: Student):

    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""
            INSERT INTO students
            (name, email, phone, department, year)
            VALUES (?, ?, ?, ?, ?)
        """, (
            student.name,
            student.email,
            student.phone,
            student.department,
            student.year
        ))

        connection.commit()

        student_id = cursor.lastrowid

        return {
            "message": "Student added successfully",
            "student_id": student_id
        }

    except sqlite3.IntegrityError:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    finally:
        connection.close()


# -------------------------
# GET ALL STUDENTS
# -------------------------

@app.get("/students")
def get_students():

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT student_id, name, email, phone, department, year
        FROM students
    """)

    rows = cursor.fetchall()

    connection.close()

    students = []

    for row in rows:
        students.append({
            "student_id": row[0],
            "name": row[1],
            "email": row[2],
            "phone": row[3],
            "department": row[4],
            "year": row[5]
        })

    return students


# -------------------------
# GET STUDENT BY ID
# -------------------------

@app.get("/students/{student_id}")
def get_student(student_id: int):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT student_id, name, email, phone, department, year
        FROM students
        WHERE student_id = ?
    """, (student_id,))

    row = cursor.fetchone()

    connection.close()

    if row is None:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return {
        "student_id": row[0],
        "name": row[1],
        "email": row[2],
        "phone": row[3],
        "department": row[4],
        "year": row[5]
    }


# -------------------------
# DELETE STUDENT
# -------------------------

@app.delete("/students/{student_id}")
def delete_student(student_id: int):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        "DELETE FROM students WHERE student_id = ?",
        (student_id,)
    )

    connection.commit()

    deleted = cursor.rowcount

    connection.close()

    if deleted == 0:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return {
        "message": "Student deleted successfully"
    }

# -------------------------
# Room Model
# -------------------------

class Room(BaseModel):
    room_number: str
    capacity: int
    occupied: int = 0
    status: str = "Available"


# -------------------------
# ADD ROOM
# -------------------------

@app.post("/rooms")
def add_room(room: Room):

    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""
            INSERT INTO rooms
            (room_number, capacity, occupied, status)
            VALUES (?, ?, ?, ?)
        """, (
            room.room_number,
            room.capacity,
            room.occupied,
            room.status
        ))

        connection.commit()

        room_id = cursor.lastrowid

        return {
            "message": "Room added successfully",
            "room_id": room_id
        }

    except sqlite3.IntegrityError:
        raise HTTPException(
            status_code=400,
            detail="Room number already exists"
        )

    finally:
        connection.close()
# -------------------------
# GET ALL ROOMS
# -------------------------

@app.get("/rooms")
def get_rooms():

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT room_id, room_number, capacity, occupied, status
        FROM rooms
    """)

    rows = cursor.fetchall()

    connection.close()

    rooms = []

    for row in rows:
        rooms.append({
            "room_id": row[0],
            "room_number": row[1],
            "capacity": row[2],
            "occupied": row[3],
            "status": row[4]
        })

    return rooms

# -------------------------
# GET ROOM BY ID
# -------------------------

@app.get("/rooms/{room_id}")
def get_room(room_id: int):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT room_id, room_number, capacity, occupied, status
        FROM rooms
        WHERE room_id = ?
    """, (room_id,))

    row = cursor.fetchone()

    connection.close()

    if row is None:
        raise HTTPException(
            status_code=404,
            detail="Room not found"
        )

    return {
        "room_id": row[0],
        "room_number": row[1],
        "capacity": row[2],
        "occupied": row[3],
        "status": row[4]
    }

# -------------------------
# DELETE ROOM
# -------------------------

@app.delete("/rooms/{room_id}")
def delete_room(room_id: int):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        "DELETE FROM rooms WHERE room_id = ?",
        (room_id,)
    )

    connection.commit()

    deleted = cursor.rowcount

    connection.close()

    if deleted == 0:
        raise HTTPException(
            status_code=404,
            detail="Room not found"
        )

    return {
        "message": "Room deleted successfully"
    }

# -------------------------
# UPDATE ROOM
# -------------------------

@app.put("/rooms/{room_id}")
def update_room(room_id: int, room: Room):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        UPDATE rooms
        SET room_number = ?,
            capacity = ?,
            occupied = ?,
            status = ?
        WHERE room_id = ?
    """, (
        room.room_number,
        room.capacity,
        room.occupied,
        room.status,
        room_id
    ))

    connection.commit()

    updated = cursor.rowcount

    connection.close()

    if updated == 0:
        raise HTTPException(
            status_code=404,
            detail="Room not found"
        )

    return {
        "message": "Room updated successfully",
        "room_id": room_id
    }


# -------------------------
# Mess Attendance Model
# -------------------------

class Attendance(BaseModel):
    student_id: int
    attendance_date: str
    present: int

# -------------------------
# ADD MESS ATTENDANCE
# -------------------------

@app.post("/attendance")
def add_attendance(attendance: Attendance):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO mess_attendance
        (student_id, attendance_date, present)
        VALUES (?, ?, ?)
    """, (
        attendance.student_id,
        attendance.attendance_date,
        attendance.present
    ))

    connection.commit()

    attendance_id = cursor.lastrowid

    connection.close()

    return {
        "message": "Attendance added successfully",
        "attendance_id": attendance_id
    }

# -------------------------
# GET ALL ATTENDANCE
# -------------------------

@app.get("/attendance")
def get_attendance():

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT attendance_id, student_id, attendance_date, present
        FROM mess_attendance
    """)

    rows = cursor.fetchall()

    connection.close()

    attendance_records = []

    for row in rows:
        attendance_records.append({
            "attendance_id": row[0],
            "student_id": row[1],
            "attendance_date": row[2],
            "present": row[3]
        })

    return attendance_records

# -------------------------
# GET ATTENDANCE BY STUDENT
# -------------------------

@app.get("/attendance/student/{student_id}")
def get_student_attendance(student_id: int):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT attendance_id, student_id, attendance_date, present
        FROM mess_attendance
        WHERE student_id = ?
    """, (student_id,))

    rows = cursor.fetchall()

    connection.close()

    attendance_records = []

    for row in rows:
        attendance_records.append({
            "attendance_id": row[0],
            "student_id": row[1],
            "attendance_date": row[2],
            "present": row[3]
        })

    return attendance_records

# -------------------------
# DELETE ATTENDANCE
# -------------------------

@app.delete("/attendance/{attendance_id}")
def delete_attendance(attendance_id: int):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        "DELETE FROM mess_attendance WHERE attendance_id = ?",
        (attendance_id,)
    )

    connection.commit()

    deleted = cursor.rowcount

    connection.close()

    if deleted == 0:
        raise HTTPException(
            status_code=404,
            detail="Attendance record not found"
        )

    return {
        "message": "Attendance deleted successfully"
    }

class Complaint(BaseModel):
    student_id: int
    category: str
    description: str
    status: str = "Pending"
    created_at: str

@app.post("/complaints")
def add_complaint(complaint: Complaint):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO complaints
        (student_id, category, description, status, created_at)
        VALUES (?, ?, ?, ?, ?)
    """, (
        complaint.student_id,
        complaint.category,
        complaint.description,
        complaint.status,
        complaint.created_at
    ))

    connection.commit()
    complaint_id = cursor.lastrowid
    connection.close()

    return {
        "message": "Complaint added successfully",
        "complaint_id": complaint_id
    }

@app.get("/complaints")
def get_complaints():
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT complaint_id, student_id, category,
               description, status, created_at
        FROM complaints
    """)

    rows = cursor.fetchall()
    connection.close()

    complaints = []

    for row in rows:
        complaints.append({
            "complaint_id": row[0],
            "student_id": row[1],
            "category": row[2],
            "description": row[3],
            "status": row[4],
            "created_at": row[5]
        })

    return complaints

@app.get("/complaints/{complaint_id}")
def get_complaint(complaint_id: int):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT complaint_id, student_id, category,
               description, status, created_at
        FROM complaints
        WHERE complaint_id = ?
    """, (complaint_id,))

    row = cursor.fetchone()
    connection.close()

    if row is None:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    return {
        "complaint_id": row[0],
        "student_id": row[1],
        "category": row[2],
        "description": row[3],
        "status": row[4],
        "created_at": row[5]
    }

@app.put("/complaints/{complaint_id}")
def update_complaint(complaint_id: int, complaint: Complaint):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        UPDATE complaints
        SET student_id = ?,
            category = ?,
            description = ?,
            status = ?,
            created_at = ?
        WHERE complaint_id = ?
    """, (
        complaint.student_id,
        complaint.category,
        complaint.description,
        complaint.status,
        complaint.created_at,
        complaint_id
    ))

    connection.commit()
    updated = cursor.rowcount
    connection.close()

    if updated == 0:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    return {
        "message": "Complaint updated successfully",
        "complaint_id": complaint_id
    }

@app.delete("/complaints/{complaint_id}")
def delete_complaint(complaint_id: int):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        "DELETE FROM complaints WHERE complaint_id = ?",
        (complaint_id,)
    )

    connection.commit()
    deleted = cursor.rowcount
    connection.close()

    if deleted == 0:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    return {
        "message": "Complaint deleted successfully"
    }

class Allocation(BaseModel):
    student_id: int
    room_id: int
    allocated_at: str

@app.post("/allocations")
def add_allocation(allocation: Allocation):
    connection = get_connection()
    cursor = connection.cursor()

    # Check that the student exists
    cursor.execute(
        "SELECT student_id FROM students WHERE student_id = ?",
        (allocation.student_id,)
    )
    student = cursor.fetchone()

    if student is None:
        connection.close()
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    # Check that the room exists
    cursor.execute(
        "SELECT room_id, capacity, occupied FROM rooms WHERE room_id = ?",
        (allocation.room_id,)
    )
    room = cursor.fetchone()

    if room is None:
        connection.close()
        raise HTTPException(
            status_code=404,
            detail="Room not found"
        )

    # Check whether room is full
    if room[2] >= room[1]:
        connection.close()
        raise HTTPException(
            status_code=400,
            detail="Room is full"
        )

    # Create allocation
    cursor.execute("""
        INSERT INTO allocations
        (student_id, room_id, allocated_at)
        VALUES (?, ?, ?)
    """, (
        allocation.student_id,
        allocation.room_id,
        allocation.allocated_at
    ))

    # Increase room occupancy
    cursor.execute("""
        UPDATE rooms
        SET occupied = occupied + 1,
            status = CASE
                WHEN occupied + 1 >= capacity THEN 'Full'
                ELSE 'Occupied'
            END
        WHERE room_id = ?
    """, (allocation.room_id,))

    connection.commit()

    allocation_id = cursor.lastrowid
    connection.close()

    return {
        "message": "Room allocated successfully",
        "allocation_id": allocation_id
    }

@app.get("/allocations")
def get_allocations():
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT allocation_id, student_id, room_id, allocated_at
        FROM allocations
    """)

    rows = cursor.fetchall()
    connection.close()

    allocations = []

    for row in rows:
        allocations.append({
            "allocation_id": row[0],
            "student_id": row[1],
            "room_id": row[2],
            "allocated_at": row[3]
        })

    return allocations

@app.get("/allocations/student/{student_id}")
def get_student_allocation(student_id: int):
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute("""
        SELECT allocation_id, student_id, room_id, allocated_at
        FROM allocations
        WHERE student_id = ?
    """, (student_id,))

    rows = cursor.fetchall()
    connection.close()

    allocations = []

    for row in rows:
        allocations.append({
            "allocation_id": row[0],
            "student_id": row[1],
            "room_id": row[2],
            "allocated_at": row[3]
        })

    return allocations

@app.delete("/allocations/{allocation_id}")
def delete_allocation(allocation_id: int):
    connection = get_connection()
    cursor = connection.cursor()

    # Find the allocation
    cursor.execute("""
        SELECT student_id, room_id
        FROM allocations
        WHERE allocation_id = ?
    """, (allocation_id,))

    allocation = cursor.fetchone()

    if allocation is None:
        connection.close()
        raise HTTPException(
            status_code=404,
            detail="Allocation not found"
        )

    student_id = allocation[0]
    room_id = allocation[1]

    # Delete the allocation
    cursor.execute("""
        DELETE FROM allocations
        WHERE allocation_id = ?
    """, (allocation_id,))

    # Decrease room occupancy
    cursor.execute("""
        UPDATE rooms
        SET occupied = occupied - 1,
            status = CASE
                WHEN occupied - 1 <= 0 THEN 'Available'
                ELSE 'Occupied'
            END
        WHERE room_id = ?
    """, (room_id,))

    connection.commit()
    connection.close()

    return {
        "message": "Allocation deleted successfully",
        "allocation_id": allocation_id,
        "student_id": student_id,
        "room_id": room_id
    }


@app.get("/dashboard")
def get_dashboard():
    connection = get_connection()
    cursor = connection.cursor()

    # Total students
    cursor.execute("SELECT COUNT(*) FROM students")
    total_students = cursor.fetchone()[0]

    # Total rooms
    cursor.execute("SELECT COUNT(*) FROM rooms")
    total_rooms = cursor.fetchone()[0]

    # Occupied students/beds
    cursor.execute("SELECT COALESCE(SUM(occupied), 0) FROM rooms")
    total_occupied = cursor.fetchone()[0]

    # Available beds
    cursor.execute("""
        SELECT COALESCE(SUM(capacity - occupied), 0)
        FROM rooms
    """)
    available_beds = cursor.fetchone()[0]

    # Total complaints
    cursor.execute("SELECT COUNT(*) FROM complaints")
    total_complaints = cursor.fetchone()[0]

    # Pending complaints
    cursor.execute("""
        SELECT COUNT(*)
        FROM complaints
        WHERE status = 'Pending'
    """)
    pending_complaints = cursor.fetchone()[0]

    # Resolved complaints
    cursor.execute("""
        SELECT COUNT(*)
        FROM complaints
        WHERE status = 'Resolved'
    """)
    resolved_complaints = cursor.fetchone()[0]

    connection.close()

    return {
        "total_students": total_students,
        "total_rooms": total_rooms,
        "total_occupied": total_occupied,
        "available_beds": available_beds,
        "total_complaints": total_complaints,
        "pending_complaints": pending_complaints,
        "resolved_complaints": resolved_complaints
    }


@app.get("/ml/predict-attendance/{student_id}")
def predict_student_attendance(student_id: int):
    result = predict_attendance(student_id)

    return {
        "student_id": student_id,
        "prediction": result
    }

@app.post("/schedule")
def create_schedule(
    task_name: str,
    task_type: str,
    scheduled_time: str
):
    return add_task(
        task_name,
        task_type,
        scheduled_time
    )


@app.get("/schedule")
def get_schedule():
    return get_tasks()


@app.put("/schedule/{task_id}/complete")
def mark_schedule_completed(task_id: int):
    task = complete_task(task_id)

    if task is None:
        return {
            "error": "Task not found"
        }

    return task