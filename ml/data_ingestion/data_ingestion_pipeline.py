from zenml import pipeline
from data_ingestion.steps.video_indexing_step import video_indexing_step
from data_ingestion.steps.video_to_frame_step import video_to_frame_step
from data_ingestion.steps.uploading_frames_step import uploading_frames_step

@pipeline(name="data_ingestion_pipeline_v2")
def data_ingestion_pipeline():
    video_paths = video_indexing_step(
        prefix="raw_videos",
        tag_key="data_category",
        tag_label="self"
    )

    frame_paths = video_to_frame_step(
        video_paths=video_paths,
        skip_frames=100,
        output_dir="frames_for_labeling"
    )

    uploading_frames_step(
        frame_paths=frame_paths
    )
