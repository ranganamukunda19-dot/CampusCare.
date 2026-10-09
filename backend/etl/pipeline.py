from extract import extract_all_data
from transform import transform_all_data
from load import load_all_data


def run_pipeline():
    print("====================================")
    print("CampusCare ETL PIPELINE")
    print("====================================")

    # Step 1: Extract
    print("\n[1] Extracting data...")
    extracted_data = extract_all_data()
    print("Extraction completed.")

    # Step 2: Transform
    print("\n[2] Transforming data...")
    transformed_data = transform_all_data(extracted_data)
    print("Transformation completed.")

    # Step 3: Load
    print("\n[3] Loading data...")
    load_all_data(transformed_data)
    print("Loading completed.")

    print("\n====================================")
    print("ETL PIPELINE COMPLETED SUCCESSFULLY!")
    print("====================================")


if __name__ == "__main__":
    run_pipeline()