
from datetime import datetime


tasks = []


def add_task(task_name, task_type, scheduled_time):
    task = {
        "task_id": len(tasks) + 1,
        "task_name": task_name,
        "task_type": task_type,
        "scheduled_time": scheduled_time,
        "status": "Pending"
    }

    tasks.append(task)

    return task


def get_tasks():
    return tasks


def complete_task(task_id):
    for task in tasks:
        if task["task_id"] == task_id:
            task["status"] = "Completed"
            return task

    return None


if __name__ == "__main__":

    print("====================================")
    print("CampusCare Scheduling Module")
    print("====================================")

    add_task(
        "Room Inspection",
        "Maintenance",
        "2026-10-08 10:00"
    )

    add_task(
        "Mess Cleaning",
        "Cleaning",
        "2026-10-08 14:00"
    )

    add_task(
        "Dinner Preparation",
        "Mess",
        "2026-10-08 18:00"
    )

    print("\nScheduled Tasks:")

    for task in get_tasks():
        print(task)

    print("\nScheduling module working successfully!")