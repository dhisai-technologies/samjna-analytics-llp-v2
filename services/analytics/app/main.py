from fastapi import FastAPI, Form, BackgroundTasks, Depends,WebSocket, WebSocketDisconnect
from fastapi.routing import APIRoute
from fastapi.responses import JSONResponse
import uvicorn
import concurrent.futures
from app.modules.nursing.utils import initAnalyzer
from app.utils.file import get_file_or_url, get_filepath
from app.utils.socket import ConnectionManager
from app.utils.api import NursingAPI, InterviewAPI
from app.modules.stress.controller import analyze_stress
from app.modules.nursing.controller import analyze_nursing
from app.modules.interview.controller import analyze_interview
import hydra
from datetime import datetime


app = FastAPI()
executor = concurrent.futures.ThreadPoolExecutor(max_workers=10)
connection_manager = ConnectionManager()
service_name = "analytics-service"

@app.get(f"/{service_name}/health")
async def read_root():
    print("Health check")
    return {"ok": "true" }

@app.websocket(f"/{service_name}/ws/{{uid}}")
async def websocket_endpoint(websocket: WebSocket, uid: str):
    await connection_manager.connect(websocket, uid)
    print(f"Connected to {uid}")
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        connection_manager.disconnect(uid)


# Stress Module

# API route for stress
@app.post(f"/{service_name}/analyze/stress")
async def stress_controller(background_tasks: BackgroundTasks, uid: str = Form(...), count : str = Form(...), final : str = Form(...), user_id: str = Form(...), file_or_url: tuple = Depends(get_file_or_url)):
    files, url = file_or_url
    count = int(count)
    final = final.lower() == 'true'
    file_path = await get_filepath(uid, count, files, url)
    if not file_path:
            return JSONResponse(status_code=400, content={"message": "Error processing file/url"})

    def log(message: str):
        connection_manager.send_log_background(uid, message)
        

    background_tasks.add_task(lambda: executor.submit(analyze_stress, file_path, uid, user_id, count, final, log))
    return JSONResponse(status_code=200, content={"message": "URL downloaded and sent for processing", "data": {"uid": uid}})


# Nursing Module

# Initialize Hydra - Initialize with relative path only
hydra.initialize(config_path="facetorch/conf")
cfg = hydra.compose("config")
analyzer = initAnalyzer(cfg)

# API route for nursing
@app.post(f"/{service_name}/analyze/nursing")
async def nursing_controller(background_tasks: BackgroundTasks, uid: str = Form(...), count : str = Form(...), final : str = Form(...), test: str = Form(...), question_id: str = Form(...), user_id: str = Form(...), file_or_url: tuple = Depends(get_file_or_url)):
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"Received request: Nursing for {uid} - {count}, at {current_time}")
    files, url = file_or_url
    count = int(count)
    final = final.lower() == 'true'
    test = test.lower() == 'true'
    file_path = await get_filepath(uid, count, files, url)
    if not file_path:
            return JSONResponse(status_code=400, content={"message": "Error processing file/url"})
    
    api = NursingAPI(uid, user_id, "")	

    def log(message: str):
        connection_manager.send_log_background(uid, message)
        api.update_info(message)

    background_tasks.add_task(lambda: executor.submit(analyze_nursing, file_path, uid, user_id, count, final, test, question_id, log, cfg, analyzer))
    return JSONResponse(status_code=200, content={"message": "URL downloaded and sent for processing", "data": {"uid": uid}})


# Interview Module

# API route for interview
@app.post(f"/{service_name}/analyze/interview")
async def interview_controller(background_tasks: BackgroundTasks, uid: str = Form(...), count : str = Form(...), final : str = Form(...), test: str = Form(...), question_id: str = Form(...), user_id: str = Form(...), file_or_url: tuple = Depends(get_file_or_url)):
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"Received request: Interview for {uid} - {count}, at {current_time}")
    files, url = file_or_url
    count = int(count)
    final = final.lower() == 'true'
    test = test.lower() == 'true'
    file_path = await get_filepath(uid, count, files, url)
    if not file_path:
            return JSONResponse(status_code=400, content={"message": "Error processing file/url"})
    
    api = InterviewAPI(uid, user_id, "")	

    def log(message: str):
        connection_manager.send_log_background(uid, message)
        api.update_info(message)

    background_tasks.add_task(lambda: executor.submit(analyze_interview, file_path, uid, user_id, count, final, test, question_id, log))
    return JSONResponse(status_code=200, content={"message": "URL downloaded and sent for processing", "data": {"uid": uid}})


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0")

