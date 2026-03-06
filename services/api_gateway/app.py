from importlib.resources import path

from fastapi import FastAPI, Request
from utils.validate_user import validate_user
from utils.forward_request import forward_request

app = FastAPI()

ALL_METHODS = ["GET","POST","PUT","DELETE","PATCH","OPTIONS","HEAD"]



@app.api_route("/", methods=ALL_METHODS)
async def root(request: Request):
    if request.url.path.startswith("/user_service/login"):
        return await forward_request(request)

    user_id = await validate_user(request)

    return await forward_request(request)



@app.api_route("/{path:path}", methods=ALL_METHODS)
async def gateway(request: Request, path: str):
    if request.url.path.startswith("/user_service/login"):
        return await forward_request(request)

    user_id = await validate_user(request)

    return await forward_request(request)



if __name__ == "__main__":
    import uvicorn  

    uvicorn.run(app, host="0.0.0.0", port=8000)