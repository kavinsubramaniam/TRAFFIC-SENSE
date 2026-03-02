from minio import Minio
from zenml import step
from roboflow import Roboflow
from utils.buffer import Buffer
from utils.hash_utils import hash_file_name
from tqdm import tqdm

import dotenv
import os
import logging
import pandas as pd
import io


dotenv.load_dotenv()
logging.basicConfig(level=logging.INFO)

rf = Roboflow(api_key=os.getenv("ROBOFLOW_API_KEY"))
ROBOFLOW_WORKSPACE_NAME = os.getenv("ROBOFLOW_WORKSPACE_NAME")
ROBOFLOW_PROJECT_NAME = os.getenv("TWO_WHEELER_DETECTION_PROJECT_NAME")

class UploaderError(Exception):
    """Custom exception for Uploader errors."""
    pass    

class Uploader:

    def __init__(self):

        self.client = Minio(
            os.getenv("MINIO_ENDPOINT"),
            access_key=os.getenv("MINIO_ACCESS_KEY"),
            secret_key=os.getenv("MINIO_SECRET_KEY"),
            secure=os.getenv("MINIO_SECURE").lower() == 'true'
        )
        self.bucket_name = os.getenv("MINIO_BUCKET_NAME")
        self.uploader_log_path = "dataset/uploader_log.csv"
        self.uploader_log: pd.DataFrame = self._load_uploader_log()
        logging.info(f"Loaded uploader log with {len(self.uploader_log)} entries")
        self.project = rf.workspace(ROBOFLOW_WORKSPACE_NAME).project(ROBOFLOW_PROJECT_NAME)
    
    def _load_uploader_log(self):
        try:
            response = self.client.get_object(
                self.bucket_name,
                self.uploader_log_path
            )
            logging.info(f"Successfully loaded uploader log from '{self.uploader_log_path}' in bucket '{self.bucket_name}'")
            data = response.read()
            response.close()
            response.release_conn()

            return pd.read_csv(io.BytesIO(data))

        except Exception as e:
            logging.warning(
                f"Uploader log not found. A new log will be created. Error: {e}"
            )
            return pd.DataFrame(
                columns=["file_name", "hashed_name", "upload_time"]
            )
    
    def _get_new_files(self, filenames: list) -> pd.DataFrame:
        new_files = []
        for filename in filenames:
            hashed_name = hash_file_name(filename)
            if hashed_name not in self.uploader_log["hashed_name"].values:
                new_files.append({"file_name": filename, "hashed_name": hashed_name})
            else:
                logging.info(f"File '{filename}' has already been uploaded. Skipping.")
        return pd.DataFrame(new_files)

    def _save_uploader_log(self):
        # Convert DataFrame to CSV in memory
        csv_buffer = io.BytesIO()
        self.uploader_log.to_csv(csv_buffer, index=False)
        csv_buffer.seek(0)

        # Upload to MinIO
        self.client.put_object(
            self.bucket_name,
            self.uploader_log_path,
            data=csv_buffer,
            length=csv_buffer.getbuffer().nbytes,
            content_type="text/csv"
        )

        logging.info(f"Uploader log saved to '{self.uploader_log_path}' in bucket '{self.bucket_name}'")

    def upload_data(self, filenames: list) -> pd.DataFrame:
        new_files_df = self._get_new_files(filenames)
        if new_files_df.empty:
            logging.info("No new files to upload.")
            return
        
        buffer = Buffer()
        temp_log = []
        try:
            for _, row in tqdm(
                new_files_df.iterrows(),
                total=len(new_files_df),
                desc="Uploading frames",
                unit="file"
            ):
                file_name = row["file_name"]
                hashed_name = row["hashed_name"]
                buffer_file_path = os.path.join(buffer.buffer_location, os.path.basename(file_name))
                self.client.fget_object(
                    bucket_name=self.bucket_name,
                    object_name=file_name,
                    file_path=buffer_file_path
                )
                self.project.upload(buffer_file_path, file_name=os.path.basename(file_name))
                temp_log.append({
                    "file_name": file_name,
                    "hashed_name": hashed_name,
                    "upload_time": pd.Timestamp.now().isoformat()
                })

        except KeyboardInterrupt:
            logging.warning("Upload interrupted by user. Saving progress...")

        except Exception as e:
            logging.error(f"Unexpected error: {e}")

        finally:
            buffer.clear_buffer()

            if temp_log:
                self.uploader_log = pd.concat(
                    [self.uploader_log, pd.DataFrame(temp_log)],
                    ignore_index=True
                )

            self._save_uploader_log()
            logging.info("Uploader log saved safely.")  
        return self.uploader_log

    def __del__(self):
        self._save_uploader_log()
    

@step(enable_cache=False)
def uploading_frames_step(
    frame_paths: pd.DataFrame
):
    uploader = Uploader()
    uploader_log = uploader.upload_data(frame_paths["frame_path"].tolist())
    logging.info(f"Completed uploading {len(frame_paths)} frames to Roboflow")
    return uploader_log

if __name__ == "__main__":
    # Example usage of the hash_file_name function
    file_name = "videos/example_video.mp4"
    hashed_name = hash_file_name(file_name)
    print(f"Original filename: {file_name}")
    print(f"Hashed filename: {hashed_name}")