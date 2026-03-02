from minio import Minio
from zenml import step

import dotenv
import pandas as pd
import os
import logging

# --------------------------------------------
# Configuration and Logging Setup
# --------------------------------------------
dotenv.load_dotenv()
logging.basicConfig(level=logging.INFO)

# --------------------------------------------
# Video Indexing Step
# --------------------------------------------
class VideoIndexerError(Exception):
    """Custom exception for VideoIndexer errors."""
    pass

class VideoIndexer:

    def __init__(self):
        self.client = Minio(
            os.getenv("MINIO_ENDPOINT"),
            access_key=os.getenv("MINIO_ACCESS_KEY"),
            secret_key=os.getenv("MINIO_SECRET_KEY"),
            secure=os.getenv("MINIO_SECURE").lower() == 'true'
        )
        self.bucket_name = os.getenv("MINIO_BUCKET_NAME")
    
    def list_videos(
            self, 
            prefix: str = "raw_videos", 
            tag_key: str = "data_category", 
            tag_label: str = "self"
        ) -> list:

        """
        List all video files in the specified MinIO bucket and prefix.
        """

        video_index = []
        for obj in self.client.list_objects(self.bucket_name, prefix=prefix, recursive=True):
            tag = self.client.get_object_tags(self.bucket_name, obj.object_name)
            if tag is not None and tag.get(tag_key) == tag_label:
                video_index.append(obj.object_name)
        return video_index

# --------------------------------------------
# ZenML Step Definition
# --------------------------------------------
@step
def video_indexing_step(
    prefix: str = "raw_videos", 
    tag_key: str = "data_category", 
    tag_label: str = "self"
) -> pd.DataFrame:

    indexer: VideoIndexer = VideoIndexer()
    video_list: list = indexer.list_videos(prefix=prefix, tag_key=tag_key, tag_label=tag_label)
    logging.info(f"Successfully indexed {len(video_list)} videos with prefix '{prefix}' and tag '{tag_key}={tag_label}'")
    return pd.DataFrame(video_list, columns=["video_path"])

