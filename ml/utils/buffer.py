from minio import Minio

import dotenv
import os
import shutil
import logging

dotenv.load_dotenv()
logging.basicConfig(level=logging.INFO)

class BufferError(Exception):
    """Custom exception for Buffer errors."""
    pass

class Buffer:

    def __init__(self):    
        self._buffer_location = os.getenv("BUFFER_LOCATION", "../data/buffer")

    @property
    def buffer_location(self):
        return self._buffer_location

    def _create_buffer_folder(self):
        os.mkdir(self._buffer_location, exist_ok=True)
    
    def clear_buffer(self):
        if os.path.exists(self._buffer_location):
            shutil.rmtree(self._buffer_location)
        logging.info(f"Cleared existing buffer at '{self._buffer_location}'")
        
    def __del__(self):
        self.clear_buffer()
        