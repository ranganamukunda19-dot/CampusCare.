import sqlite3
import pandas as pd
from pathlib import Path


# Find the CampusCare database
BASE_DIR = Path(__file__).resolve().parent.parent
DB_FILE = BASE_DIR / "db" / "campuscare.db"


def get_connection():
    return sqlite3.connect(DB_FILE)


def extract_table(table_name):
    """
    Extract one table from the CampusCare SQLite database
    and return it as a pandas DataFrame.
    """

    connection = get_connection()

    try:
        query = f"SELECT * FROM {table_name}"
        dataframe = pd.read_sql_query(query, connection)
        return dataframe

    finally:
        connection.close()


def extract_all_data():
    """
    Extract all CampusCare tables.
    """

    data = {}

    tables = [
        "students",
        "rooms",
        "mess_attendance",
        "complaints",
        "allocations"
    ]

    for table in tables:
        data[table] = extract_table(table)

    return data


if __name__ == "__main__":

    print("====================================")
    print("CampusCare ETL - EXTRACT")
    print("====================================")

    data = extract_all_data()

    for table_name, dataframe in data.items():

        print(f"\nTable: {table_name}")
        print(f"Rows: {len(dataframe)}")
        print(f"Columns: {list(dataframe.columns)}")

        print("\nData:")
        print(dataframe)

    print("\n====================================")
    print("Extraction completed successfully!")
    print("====================================")