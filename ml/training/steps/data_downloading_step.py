from roboflow import Roboflow
from utils.buffer import Buffer
from minio import Minio
from zenml import step

import dotenv
import os
import shutil
import logging 

dotenv.load_dotenv()
logging.basicConfig(level=logging.INFO)

ROBOFLOW_API_KEY = os.getenv("ROBOFLOW_API_KEY")
WORKSPACE_NAME = os.getenv("ROBOFLOW_WORKSPACE_NAME")

class DataDownloader:
    def __init__(self, project_name: str = os.getenv("TWO_WHEELER_DETECTION_PROJECT_NAME")):
        self.rf = Roboflow(api_key=ROBOFLOW_API_KEY)
        self.client = Minio(
            endpoint=os.getenv("MINIO_ENDPOINT"),
            access_key=os.getenv("MINIO_ACCESS_KEY"),
            secret_key=os.getenv("MINIO_SECRET_KEY"),
            secure=os.getenv("MINIO_SECURE", "true").lower() == "true"
        )
        self.project_name = project_name

    def download_dataset(self, version_number) -> str:
        logging.info(f"Downloading dataset version {version_number} from Roboflow...")
        project = self.rf.workspace(WORKSPACE_NAME).project(self.project_name)
        version = project.version(version_number)
        buffer = Buffer()
        try:
            location = buffer.buffer_location + f"/{self.project_name}-{version_number}"
            version.download("yolov8", location=location)
            logging.info(f"Dataset version {version_number} downloaded successfully to {location}")
            shutil.make_archive(location, 'zip', buffer.buffer_location)
            self._upload_to_minio(version_number, f"{location}.zip")

        except Exception as e:
            logging.error(f"Error downloading dataset version {version_number}: {e}")
        finally:
            buffer.clear_buffer()
            return f"datasets/{self.project_name}-{version_number}.zip"
    
    def _upload_to_minio(self, version_number, file_path):
        try:
            self.client.fput_object(
                bucket_name=os.getenv("MINIO_BUCKET_NAME"),
                object_name=f"datasets/{self.project_name}-{version_number}.zip",
                file_path=file_path
            )
        except Exception as e:
            logging.error(f"Error uploading to MinIO: {e}")

        except Exception as e:
            logging.error(f"Error uploading to MinIO: {e}")


@step
def download_data_step(project_name: str, version_number: int) -> str:
    logging.info(f"Starting data download step for version {version_number}...")
    downloader = DataDownloader(project_name=project_name)
    return downloader.download_dataset(version_number=version_number)

if __name__ == "__main__":
    PROJECT_NAME = os.getenv("TWO_WHEELER_DETECTION_PROJECT_NAME")
    downloader = DataDownloader(project_name=PROJECT_NAME)
    downloader.download_dataset(version_number=3)