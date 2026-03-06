from fastapi import FastAPI
from routes import router

import os
import dotenv

dotenv.load_dotenv()

app = FastAPI()

app.include_router(router, prefix="/user_service")

if __name__ == "__main__":
    import uvicorn  
    if os.getenv("ENVIRONMENT") == "local":
        uvicorn.run(app, host="0.0.0.0", port=8001)
    else:
        uvicorn.run(app, host=os.getenv("USER_SERVICE_HOST"), port=int(os.getenv("USER_SERVICE_PORT")))