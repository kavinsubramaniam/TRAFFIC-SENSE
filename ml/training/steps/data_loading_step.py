from minio import Minio
from zenml import step

import dotenv
import os
import shutil
import logging 
import shutil

dotenv.load_dotenv()
logging.basicConfig(level=logging.INFO)

class DataLoader:
    def __init__(self, project_name: str = os.getenv("TWO_WHEELER_DETECTION_PROJECT_NAME")):
        self.client = Minio(
            endpoint=os.getenv("MINIO_ENDPOINT"),
            access_key=os.getenv("MINIO_ACCESS_KEY"),
            secret_key=os.getenv("MINIO_SECRET_KEY"),
            secure=os.getenv("MINIO_SECURE", "true").lower() == "true"
        )
        self.bucket_name = os.getenv("MINIO_BUCKET_NAME")
        self.project_name = project_name
        self.dataset_path = f"datasets/{self.project_name}"

        self._clear_and_load_data_dir()
    
    def _clear_and_load_data_dir(self):
        shutil.rmtree(self.dataset_path, ignore_errors=True)
        os.makedirs(self.dataset_path, exist_ok=True)
    
    def load_data(self, version_number) -> str:
        self.client.fget_object(
            bucket_name=self.bucket_name,
            object_name=f"datasets/{self.project_name}-{version_number}.zip",
            file_path=f"{self.dataset_path}.zip"
        )
        shutil.unpack_archive(f"{self.dataset_path}.zip", self.dataset_path)
        logging.info(f"Dataset version {version_number} loaded successfully to {self.dataset_path}")
        return f"datasets/{self.project_name}/{self.project_name}-{version_number}"
    
@step(enable_cache=False)
def data_loading_step(project_name: str, version_number: int) -> str:
    loader = DataLoader(project_name=project_name)
    return loader.load_data(version_number=version_number)
