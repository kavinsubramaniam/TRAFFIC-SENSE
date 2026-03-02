"""
YOLO Training with Custom Dataset and MLflow Logging
Requirements:
    pip install ultralytics mlflow
"""
from datetime import datetime

from training.training_pipeline import training_pipeline


import os
import yaml
import mlflow
import mlflow.pytorch
from ultralytics import YOLO
from pathlib import Path
import logging
import torch.multiprocessing as mp
import dotenv

logging.basicConfig(level=logging.INFO)

dotenv.load_dotenv()

# ─────────────────────────────────────────────
# 1.  Configuration
# ─────────────────────────────────────────────
CONFIG = {
    # Model
    "model": "yolov8n.pt",          # pretrained weights  (yolov8n/s/m/l/x.pt)
    "data_yaml": "dataset.yaml",    # path to your dataset YAML

    # Training hyper-params
    "epochs": 50,
    "imgsz": 512,
    "batch": 4,
    "workers": 0,
    "lr0": 0.01,
    "lrf": 0.01,
    "momentum": 0.937,
    "weight_decay": 0.0005,
    "warmup_epochs": 3,
    "conf_thres": 0.25,
    "iou_thres": 0.45,

    # Output
    "project": "runs/train",
    "name": "yolo_custom",
    "device": "0",                  # "0" for GPU, "cpu" for CPU
}

MLFLOW_TRACKING_URI = "http://localhost:5000"
MLFLOW_EXPERIMENT   = "YOLO-Custom-Training"


# ─────────────────────────────────────────────
# 3.  Helper – parse Ultralytics results
# ─────────────────────────────────────────────
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


# ─────────────────────────────────────────────
# 4.  Main training loop
# ─────────────────────────────────────────────
def train_step(dataset_path: str = CONFIG["data_yaml"]):
    mp.freeze_support()   # Ensure dataset path is absolute
    mlflow.set_tracking_uri(MLFLOW_TRACKING_URI)
    mlflow.set_experiment(MLFLOW_EXPERIMENT)

    with mlflow.start_run(run_name=CONFIG["name"]) as run:
        print(f"\n[MLflow] Run ID : {run.info.run_id}")
        print(f"[MLflow] Experiment: {MLFLOW_EXPERIMENT}\n")
        logging.info(f"Starting training with dataset: {dataset_path} and cwd: {os.getcwd()}")
        # ── Log all hyper-parameters ──────────────────────────────────────
        mlflow.log_params({
            "model":          CONFIG["model"],
            "data_yaml":      dataset_path + "/data.yaml",
            "epochs":         CONFIG["epochs"],
            "imgsz":          CONFIG["imgsz"],
            "batch":          CONFIG["batch"],
            "workers":        CONFIG["workers"],
            "lr0":            CONFIG["lr0"],
            "lrf":            CONFIG["lrf"],
            "momentum":       CONFIG["momentum"],
            "weight_decay":   CONFIG["weight_decay"],
            "warmup_epochs":  CONFIG["warmup_epochs"],
            "conf_thres":     CONFIG["conf_thres"],
            "iou_thres":      CONFIG["iou_thres"],
            "device":         CONFIG["device"],
        })

        # ── Load model ────────────────────────────────────────────────────
        model = YOLO(CONFIG["model"])

        # ── Train ─────────────────────────────────────────────────────────
        results = model.train(
            data          = dataset_path + "/data.yaml",
            epochs        = CONFIG["epochs"],
            imgsz         = CONFIG["imgsz"],
            batch         = CONFIG["batch"],
            lr0           = CONFIG["lr0"],
            lrf           = CONFIG["lrf"],
            momentum      = CONFIG["momentum"],
            weight_decay  = CONFIG["weight_decay"],
            warmup_epochs = CONFIG["warmup_epochs"],
            project       = CONFIG["project"],
            name          = CONFIG["name"],
            device        = CONFIG["device"],
            exist_ok      = True,
            verbose       = True,
        )

        # ── Log final metrics ─────────────────────────────────────────────
        final_metrics = parse_results(results)
        if final_metrics:
            mlflow.log_metrics(final_metrics)
            print(f"\n[MLflow] Logged metrics: {list(final_metrics.keys())}")

        # ── Log per-epoch metrics from CSV ────────────────────────────────
        save_dir = Path(CONFIG["project"]) / CONFIG["name"]
        results_csv = save_dir / "results.csv"
        if results_csv.exists():
            import csv
            with open(results_csv) as f:
                reader = csv.DictReader(f)
                for row in reader:
                    epoch = int(float(row.get("epoch", 0)))
                    epoch_metrics = {}
                    for k, v in row.items():
                        k = k.strip()
                        if k == "epoch":
                            continue
                        try:
                            epoch_metrics[k] = float(v)
                        except (ValueError, TypeError):
                            pass
                    if epoch_metrics:
                        mlflow.log_metrics(epoch_metrics, step=epoch)
            print(f"[MLflow] Per-epoch metrics logged from {results_csv}")

        # ── Log best weights as artifact ──────────────────────────────────
        best_weights = save_dir / "weights" / "best.pt"
        last_weights = save_dir / "weights" / "last.pt"

        if best_weights.exists():
            mlflow.log_artifact(str(best_weights), artifact_path="weights")
            print(f"[MLflow] Artifact logged: {best_weights}")

        if last_weights.exists():
            mlflow.log_artifact(str(last_weights), artifact_path="weights")

        # ── Log plots / images ────────────────────────────────────────────
        for img_file in save_dir.glob("*.png"):
            mlflow.log_artifact(str(img_file), artifact_path="plots")

        # ── Log the dataset YAML ──────────────────────────────────────────
        mlflow.log_artifact(dataset_path + "/data.yaml", artifact_path="config")

        # ── (Optional) Register model in MLflow Model Registry ───────────
        # Uncomment to register:
        # mlflow.pytorch.log_model(
        #     pytorch_model=model.model,
        #     artifact_path="model",
        #     registered_model_name="YOLO-Custom"
        # )

        print("\n[INFO] Training complete.")
        print(f"[INFO] Results saved to : {save_dir}")
        print(f"[MLflow] View UI        : mlflow ui --backend-store-uri {MLFLOW_TRACKING_URI}")


# ─────────────────────────────────────────────
# 5.  Validate (optional stand-alone usage)
# ─────────────────────────────────────────────
def validate(weights: str = None, data_yaml: str = None):
    """Run validation and log metrics to a new MLflow run."""
    weights   = weights   or str(Path(CONFIG["project"]) / CONFIG["name"] / "weights" / "best.pt")
    data_yaml = data_yaml or CONFIG["data_yaml"]

    mlflow.set_tracking_uri(MLFLOW_TRACKING_URI)
    mlflow.set_experiment(MLFLOW_EXPERIMENT)

    with mlflow.start_run(run_name=f"{CONFIG['name']}_val"):
        mlflow.log_params({"weights": weights, "data_yaml": data_yaml,
                           "imgsz": CONFIG["imgsz"]})

        model   = YOLO(weights)
        results = model.val(data=data_yaml, imgsz=CONFIG["imgsz"])

        val_metrics = parse_results(results)
        if val_metrics:
            mlflow.log_metrics(val_metrics)

        print(f"[MLflow] Validation metrics: {val_metrics}")


if __name__ == "__main__":
    date = datetime.now().strftime("%Y-%m-%d")
    time = datetime.now().strftime("%H-%M-%S")
    logging.info("Starting training run...")
    PROJECT_NAME = os.getenv("TWO_WHEELER_DETECTION_PROJECT_NAME")
    VERSION_NUMBER = 3
    training_pipeline.with_options(run_name=f"training_experiment_run_{date}_{time}")(project_name=PROJECT_NAME, version_number=VERSION_NUMBER)

    # loader = DataLoader()
    # loader.load_data(version_number=3)
    train_step(r"A:\PORJECTS\TRAFFIC-SENSE\ml\datasets\two-wheeler-detection-uyzmj\two-wheeler-detection-uyzmj-3")
