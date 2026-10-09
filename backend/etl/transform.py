import pandas as pd


def transform_students(dataframe):
    """
    Clean and prepare student data.
    """

    df = dataframe.copy()

    # Remove duplicate students
    df = df.drop_duplicates()

    # Clean text columns
    df["name"] = df["name"].astype(str).str.strip()
    df["email"] = df["email"].astype(str).str.strip().str.lower()
    df["department"] = df["department"].astype(str).str.strip()

    return df


def transform_rooms(dataframe):
    """
    Clean and prepare room data.
    """

    df = dataframe.copy()

    # Remove duplicate rooms
    df = df.drop_duplicates()

    # Clean room numbers
    df["room_number"] = df["room_number"].astype(str).str.strip()

    # Make sure numeric columns are numeric
    df["capacity"] = pd.to_numeric(df["capacity"], errors="coerce")
    df["occupied"] = pd.to_numeric(df["occupied"], errors="coerce")

    return df


def transform_attendance(dataframe):
    """
    Clean and prepare mess attendance data.
    """

    df = dataframe.copy()

    df = df.drop_duplicates()

    # Convert date column
    df["attendance_date"] = pd.to_datetime(
        df["attendance_date"],
        errors="coerce"
    )

    # Convert present column to integer
    df["present"] = pd.to_numeric(
        df["present"],
        errors="coerce"
    )

    return df


def transform_complaints(dataframe):
    """
    Clean and prepare complaint data.
    """

    df = dataframe.copy()

    df = df.drop_duplicates()

    df["category"] = df["category"].astype(str).str.strip()
    df["description"] = df["description"].astype(str).str.strip()
    df["status"] = df["status"].astype(str).str.strip()

    df["created_at"] = pd.to_datetime(
        df["created_at"],
        errors="coerce"
    )

    return df


def transform_allocations(dataframe):
    """
    Clean and prepare room allocation data.
    """

    df = dataframe.copy()

    df = df.drop_duplicates()

    df["allocated_at"] = pd.to_datetime(
        df["allocated_at"],
        errors="coerce"
    )

    return df


def transform_all_data(data):
    """
    Transform all extracted CampusCare data.
    """

    transformed_data = {}

    transformed_data["students"] = transform_students(
        data["students"]
    )

    transformed_data["rooms"] = transform_rooms(
        data["rooms"]
    )

    transformed_data["mess_attendance"] = transform_attendance(
        data["mess_attendance"]
    )

    transformed_data["complaints"] = transform_complaints(
        data["complaints"]
    )

    transformed_data["allocations"] = transform_allocations(
        data["allocations"]
    )

    return transformed_data


if __name__ == "__main__":
    print("CampusCare ETL - TRANSFORM")
    print("Transform module loaded successfully!")