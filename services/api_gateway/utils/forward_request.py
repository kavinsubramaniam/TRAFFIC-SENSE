import httpx
from fastapi import Request, Response

import os
import logging
import dotenv

dotenv.load_dotenv()
logging.basicConfig(level=logging.INFO)

async def forward_request(request: Request) -> Response:
    logging.info(f"Forwarding request to {request.url}")
    try:
        service_name = request.url.path.split("/")[1]
        service_port = os.getenv(f'{service_name.upper()}_PORT')

        if service_name is None or service_port is None:
            logging.error(f"Service {service_name} not found in AVAILABLE_SERVICES")
            return Response(content=f"Service {service_name} not found", status_code=404, media_type="text/plain")

        if os.getenv("ENVIRONMENT") == "local":
            service_url = f"http://localhost:{service_port}"
        else:
            service_url = f"http://{service_name}:{service_port}"
        
        url = f"{service_url}{request.url.path}"
        method = request.method
        headers = dict(request.headers)
        body = await request.body()

        logging.info(f"Forwarding {method} request to {url}")

    
        async with httpx.AsyncClient() as client:
            response = await client.request(method, url, headers=headers, content=body)
            return Response(content=response.content, status_code=response.status_code, headers=response.headers)
    except httpx.RequestError as e:
        logging.error(f"Error forwarding request: {e}")
        return Response(content=f"Error forwarding request: {e}", status_code=500, media_type="text/plain")
    # return Response(content=f"Forwarding {method} request to {url}", media_type="text/plain")