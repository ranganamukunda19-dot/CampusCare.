import pandas as pd
from pathlib import Path


# Folder where transformed ETL data will be stored
BASE_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = BASE_DIR / "output"


def load_table(dataframe, table_name):
    """
    Save a transformed DataFrame as a CSV file.
    """

    OUTPUT_DIR.mkdir(exist_ok=True)

    output_file = OUTPUT_DIR / f"{table_name}.csv"

    dataframe.to_csv(
        output_file,
        index=False
    )

    print(f"Loaded: {output_file}")


def load_all_data(data):
    """
    Save all transformed CampusCare data.
    """

    for table_name, dataframe in data.items():
        load_table(dataframe, table_name)


if __name__ == "__main__":
    print("CampusCare ETL - LOAD")
    print("Load module loaded successfully!")