
from ultralytics import YOLO
import torch.multiprocessing as mp

CONFIG = {
    # Model
    "model": "yolo11m.pt",          # pretrained weights  (yolov8n/s/m/l/x.pt)
    "data_yaml": r"A:\PORJECTS\TRAFFIC-SENSE\ml\datasets\two-wheeler-detection-uyzmj\two-wheeler-detection-uyzmj-3\data.yaml",    # path to your dataset YAML

    # Training hyper-params
    "epochs": 100,
    "imgsz": 512,
    "batch": 8,
    "workers": 0,
    "lr0": 0.01,
    "lrf": 0.01,
    "momentum": 0.937,
    "weight_decay": 0.0005,
    "warmup_epochs": 3,
    "conf_thres": 0.25,
    "iou_thres": 0.45,

    # Output
    "project": "two_wheeler_detection_runs/train",
    "name": "two_wheeler_detector",
    "device": "0",                  # "0" for GPU, "cpu" for CPU
}

def main():
    model = YOLO(CONFIG["model"])
    custom_model = model.train(
        data=CONFIG["data_yaml"],
        epochs=CONFIG["epochs"],
        batch=CONFIG["batch"],
        workers=CONFIG["workers"],
        imgsz=CONFIG["imgsz"],
        name=CONFIG["name"],
        device=CONFIG["device"],
        project=CONFIG["project"],
    )   

def parse_results(results):
    """Extract scalar metrics from a YOLO Results object."""
    metrics = {}
    if hasattr(results, "results_dict"):
        metrics.update({k: float(v) for k, v in results.results_dict.items()
                        if isinstance(v, (int, float))})
    # speed
    if hasattr(results, "speed"):
        for k, v in results.speed.items():
            metrics[f"speed/{k}"] = float(v)
    return metrics


def validate(weights: str = None, data_yaml: str = None):
    """Run validation and log metrics to a new MLflow run."""
    weights   = weights
    data_yaml = data_yaml or CONFIG["data_yaml"]


    model   = YOLO(weights)
    results = model.val(data=data_yaml, imgsz=CONFIG["imgsz"])

    val_metrics = parse_results(results)
    print(val_metrics)

def video_detection(video_path: str, weights: str = None):
    """Run inference on a video and save results."""
    weights   = weights

    model = YOLO(weights)
    model.predict(source=video_path, imgsz=CONFIG["imgsz"], conf=CONFIG["conf_thres"], iou=CONFIG["iou_thres"], save=True, save_txt=True, project="video_detections", name="detection_results")

if __name__ == "__main__":
    mp.freeze_support()
    # main()

    # validate(
    #     weights=r"A:\PORJECTS\TRAFFIC-SENSE\ml\runs\detect\two_wheeler_detection_runs\train\two_wheeler_detector\weights\best.pt", 
    #     data_yaml=CONFIG["data_yaml"]
    # )

    video_detection(
        video_path=r"A:\PORJECTS\COMPUTER_VISION_PROJECTS\CV08-TRAFFIC-VIOLATION-DETECTION\data\raw_videos\video117.mp4",
        weights=r"A:\PORJECTS\TRAFFIC-SENSE\ml\runs\detect\two_wheeler_detection_runs\train\two_wheeler_detector3\weights\best.pt",
    )