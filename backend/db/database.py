
import os
import re
import sqlite3
from pathlib import Path

import psycopg2

BASE_DIR = Path(__file__).resolve().parent
DB_FILE = BASE_DIR / "campuscare.db"


class PostgreSQLCursor:
    """Support existing SQLite-style queries on PostgreSQL."""

    ID_COLUMNS = {
        "students": "student_id",
        "rooms": "room_id",
        "mess_attendance": "attendance_id",
        "complaints": "complaint_id",
        "allocations": "allocation_id",
    }

    def __init__(self, cursor):
        self._cursor = cursor
        self.lastrowid = None

    def execute(self, query, params=None):
        sql = query.replace("?", "%s")
        match = re.match(
            r"\s*INSERT\s+INTO\s+([a-zA-Z_][a-zA-Z0-9_]*)",
            sql,
            re.IGNORECASE,
        )

        id_column = None

        if match:
            self.lastrowid = None
            table = match.group(1).lower()
            id_column = self.ID_COLUMNS.get(table)

        if (
            match
            and id_column
            and not re.search(r"\bRETURNING\b", sql, re.IGNORECASE)
        ):
            sql = sql.rstrip().rstrip(";")
            sql += f" RETURNING {id_column}"

        if params is None:
            self._cursor.execute(sql)
        else:
            self._cursor.execute(sql, params)

        if match and id_column and re.search(
            r"\bRETURNING\b", sql, re.IGNORECASE
        ):
            inserted = self._cursor.fetchone()
            if inserted:
                self.lastrowid = inserted[0]

        return self

    def fetchone(self):
        return self._cursor.fetchone()

    def fetchall(self):
        return self._cursor.fetchall()

    @property
    def rowcount(self):
        return self._cursor.rowcount

    def close(self):
        self._cursor.close()


class PostgreSQLConnection:
    """Keep the connection methods used by main.py."""

    def __init__(self, connection):
        self._connection = connection

    def cursor(self):
        return PostgreSQLCursor(self._connection.cursor())

    def commit(self):
        self._connection.commit()

    def close(self):
        self._connection.close()


def get_connection():
    """Use PostgreSQL when DATABASE_URL is configured; otherwise SQLite."""

    database_url = os.getenv("DATABASE_URL")

    if database_url:
        connection = psycopg2.connect(
            database_url,
            sslmode="require",
        )
        return PostgreSQLConnection(connection)

    connection = sqlite3.connect(DB_FILE)
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def create_tables():
    use_postgres = bool(os.getenv("DATABASE_URL"))

    if use_postgres:
        id_type = "SERIAL PRIMARY KEY"
    else:
        id_type = "INTEGER PRIMARY KEY AUTOINCREMENT"

    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(f"""
            CREATE TABLE IF NOT EXISTS students (
                student_id {id_type},
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                phone TEXT,
                department TEXT,
                year INTEGER
            )
        """)

        cursor.execute(f"""
            CREATE TABLE IF NOT EXISTS rooms (
                room_id {id_type},
                room_number TEXT UNIQUE NOT NULL,
                capacity INTEGER NOT NULL,
                occupied INTEGER DEFAULT 0,
                status TEXT DEFAULT 'Available'
            )
        """)

        cursor.execute(f"""
            CREATE TABLE IF NOT EXISTS mess_attendance (
                attendance_id {id_type},
                student_id INTEGER NOT NULL,
                attendance_date TEXT NOT NULL,
                present INTEGER NOT NULL,
                FOREIGN KEY (student_id)
                    REFERENCES students(student_id)
            )
        """)

        cursor.execute(f"""
            CREATE TABLE IF NOT EXISTS complaints (
                complaint_id {id_type},
                student_id INTEGER NOT NULL,
                category TEXT NOT NULL,
                description TEXT NOT NULL,
                status TEXT DEFAULT 'Pending',
                created_at TEXT NOT NULL,
                FOREIGN KEY (student_id)
                    REFERENCES students(student_id)
            )
        """)

        cursor.execute(f"""
            CREATE TABLE IF NOT EXISTS allocations (
                allocation_id {id_type},
                student_id INTEGER NOT NULL,
                room_id INTEGER NOT NULL,
                allocated_at TEXT NOT NULL,
                FOREIGN KEY (student_id)
                    REFERENCES students(student_id),
                FOREIGN KEY (room_id)
                    REFERENCES rooms(room_id)
            )
        """)

        connection.commit()
        print("CampusCare database tables created successfully!")

    except Exception:
        connection.rollback() if hasattr(connection, "rollback") else None
        raise

    finally:
        cursor.close()
        connection.close()


if __name__ == "__main__":
    create_tables()
