import os
import hashlib

def hash_file_name(file_name: str) -> str:
    filename = os.path.basename(file_name)
    print(filename)
    return hashlib.sha256(filename.encode()).hexdigest()