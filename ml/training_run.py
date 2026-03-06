"""
YOLO Training with Custom Dataset and MLflow Logging
Requirements:
    pip install ultralytics mlflow
"""
from datetime import datetime
from training.training_pipeline import training_pipeline

import os
import logging
import dotenv

logging.basicConfig(level=logging.INFO)

dotenv.load_dotenv()


if __name__ == "__main__":
    date = datetime.now().strftime("%Y-%m-%d")
    time = datetime.now().strftime("%H-%M-%S")
    logging.info("Starting training run...")
    PROJECT_NAME = os.getenv("TWO_WHEELER_DETECTION_PROJECT_NAME")
    VERSION_NUMBER = 3
    training_pipeline.with_options(run_name=f"training_experiment_run_{date}_{time}")(project_name=PROJECT_NAME, version_number=VERSION_NUMBER)
