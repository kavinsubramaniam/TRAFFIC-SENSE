from sqlalchemy.orm import declarative_base
from sqlalchemy import create_engine

import os
import dotenv
import logging

logging.basicConfig(level=logging.INFO)
dotenv.load_dotenv()

SERVICE_NAME = os.getenv("CHALLAN_SERVICE_NAME", "challan_service")
DATABASE_URL = os.getenv(f"{SERVICE_NAME.upper()}_DB_URL")

logging.info(f"Connecting to database at {DATABASE_URL}")
engine = create_engine(DATABASE_URL)

Base = declarative_base()