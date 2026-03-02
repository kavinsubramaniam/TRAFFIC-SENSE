from minio import Minio
from zenml import step

import dotenv
import os
import logging
import cv2
import av
import io
import pandas as pd

# --------------------------------------------
# Configuration Setup
# --------------------------------------------
dotenv.load_dotenv()
logging.basicConfig(level=logging.INFO)

# --------------------------------------------
# Video to Frame Step
# --------------------------------------------

class VideoToFramesError(Exception):
    """Custom exception for VideoToFrame errors."""
    pass

class VideoToFrames:

    def __init__(
            self, 
            video_path: str, 
            skip_frames: int = 0, 
            output_dir: str = "frames_for_labeling"
        ):

        self.client = Minio(
            os.getenv("MINIO_ENDPOINT"),
            access_key=os.getenv("MINIO_ACCESS_KEY"),
            secret_key=os.getenv("MINIO_SECRET_KEY"),
            secure=os.getenv("MINIO_SECURE").lower() == 'true'
        )
        self.bucket_name = os.getenv("MINIO_BUCKET_NAME")
        
        self.video_path = video_path
        self.video_name = video_path.split("/")[-1].split(".")[0]
        self.skip_frames = skip_frames
        self.output_dir = output_dir

    def extract_frames(self, output_dir: str):
        """
        Extract frames from the given video and save them to the output directory.
        """
        response = self.client.get_object(
            bucket_name=self.bucket_name,
            object_name=self.video_path
        )
        container = av.open(response)

        frame_count = 0
        frame_paths = []
        for frame in container.decode(video=0):
            if frame_count % self.skip_frames == 0:
                img = frame.to_ndarray(format='bgr24')

                success, buffer = cv2.imencode(".jpg", img)
                if not success:
                    continue

                frame_bytes = buffer.tobytes()

                object_name = f"{self.output_dir}/{self.video_name}_{frame_count:06d}.jpg"
                self.save_frame(frame_bytes, object_name)
                frame_paths.append(object_name)
            frame_count += 1
        logging.info(f"Extracted {frame_count} frames from video '{self.video_name}' and saved to '{output_dir}'")
        return frame_paths

    def save_frame(self, frame: list, object_name: str) -> list:
        """
        Upload the extracted frames to MinIO and return their paths.
        """
        self.client.put_object(
            bucket_name=self.bucket_name,
            object_name=object_name,
            data=io.BytesIO(frame),
            length=len(frame),
            content_type="image/jpeg"
        )
        
@step
def video_to_frame_step(
    video_paths: pd.DataFrame, 
    skip_frames: int = 100, 
    output_dir: str = "frames_for_labeling"
) -> pd.DataFrame:
    try:
        frame_paths = []
        for _, row in video_paths.iterrows():
            video_path = row["video_path"]
            extractor = VideoToFrames(video_path=video_path, skip_frames=skip_frames, output_dir=output_dir)
            frame_paths.extend(extractor.extract_frames(output_dir=output_dir))
        logging.info(f"Successfully extracted frames from {len(video_paths)} videos and saved to '{output_dir}'")
        return pd.DataFrame(frame_paths, columns=["frame_path"])
    except Exception as e:
        logging.error(f"Error in video_to_frame_step: {e}")
        raise VideoToFramesError(f"Failed to extract frames: {e}")

if __name__ == "__main__":
    video_paths = pd.DataFrame(["raw_videos/video105.mp4"], columns=["video_path"])
    frame_paths = video_to_frame_step(video_paths=video_paths, skip_frames=100, output_dir="frames_for_labeling")
    print(frame_paths)
        