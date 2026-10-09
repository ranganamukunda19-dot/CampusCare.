import pandas as pd
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score
import joblib


BASE_DIR = Path(__file__).resolve().parent.parent

ATTENDANCE_FILE = (
    BASE_DIR / "etl" / "output" / "mess_attendance.csv"
)

MODEL_FILE = (
    Path(__file__).resolve().parent / "attendance_model.pkl"
)


def train_model():
    print("====================================")
    print("CampusCare ML - Attendance Model")
    print("====================================")

    # Load attendance data
    df = pd.read_csv(ATTENDANCE_FILE)

    print("\nAttendance data:")
    print(df)

    # Create attendance status
    df["attendance_status"] = df["present"].apply(
        lambda x: 1 if x == 1 else 0
    )

    # Input and target
    X = df[["student_id"]]
    y = df["attendance_status"]

    # Check data
    if y.nunique() < 2:
        print("\nNot enough data.")
        print("We need both Present and Absent records.")
        return

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42
    )

    # Create model
    model = DecisionTreeClassifier(
        random_state=42
    )

    # Train
    model.fit(X_train, y_train)

    # Test
    predictions = model.predict(X_test)

    accuracy = accuracy_score(
        y_test,
        predictions
    )

    print("\nModel accuracy:", accuracy)

    # Save model
    joblib.dump(model, MODEL_FILE)

    print("\nModel saved successfully!")
    print(MODEL_FILE)

    return model


def predict_attendance(student_id):
    """
    Predict attendance status for a student.
    """

    # Load trained model
    model = joblib.load(MODEL_FILE)

    # Create input
    input_data = pd.DataFrame({
        "student_id": [student_id]
    })

    # Make prediction
    prediction = model.predict(input_data)[0]

    if prediction == 1:
        result = "Good Attendance"
    else:
        result = "Low Attendance"

    print("\n====================================")
    print("CampusCare Attendance Prediction")
    print("====================================")
    print("Student ID:", student_id)
    print("Prediction:", result)
    print("====================================")

    return result


if __name__ == "__main__":

    train_model()

    # Example prediction
    predict_attendance(3)