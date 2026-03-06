from data_ingestion.data_ingestion_pipeline import data_ingestion_pipeline
from datetime import datetime

import sys

if __name__ == "__main__":
    date = datetime.now().strftime("%Y-%m-%d")
    time = datetime.now().strftime("%H-%M-%S")
    skip_frames = sys.argv[1]
    data_ingestion_pipeline.with_options(run_name=f"data_ingestion_experiment_run_{date}_{time}")(skip_frames)