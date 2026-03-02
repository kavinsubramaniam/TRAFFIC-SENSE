from zenml import pipeline
from training.steps.data_downloading_step import download_data_step
from training.steps.data_loading_step import data_loading_step
from training.steps.training_step import train_step

@pipeline(name="training_pipeline_v1")
def training_pipeline(project_name: str, version_number: int):
    dataset_zip_path = download_data_step(project_name=project_name, version_number=version_number)
    dataset_path = data_loading_step(project_name=project_name, version_number=version_number)
    train_step(dataset_path=dataset_path)