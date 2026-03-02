from data_ingestion.data_ingestion_pipeline import data_ingestion_pipeline
from datetime import datetime

if __name__ == "__main__":
    date = datetime.now().strftime("%Y-%m-%d")
    time = datetime.now().strftime("%H-%M-%S")
    data_ingestion_pipeline.with_options(run_name=f"data_ingestion_experiment_run_{date}_{time}")()