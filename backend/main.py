from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio
from routers import video, companions

sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')
app = FastAPI(title="AI Companion Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"]
)

app.include_router(video.router)
app.include_router(companions.router)

# Mount Socket.IO ASGI app at the correct path
socket_app = socketio.ASGIApp(sio, other_asgi_app=app, socketio_path='signal')

@sio.event
async def connect(sid, environ):
    print("Socket connected:", sid)

@sio.event
async def disconnect(sid):
    print("Socket disconnected:", sid)

@sio.event
async def join(sid, data):
    roomId = data.get("roomId")
    userId = data.get("userId")
    role = data.get("role")
    await sio.enter_room(sid, roomId)
    await sio.emit("joined", {"userId": userId, "role": role}, room=roomId)
    print(f"sid {sid} joined room {roomId}")

@sio.event
async def offer(sid, data):
    await sio.emit("offer", data, room=data.get("roomId"), skip_sid=sid)

@sio.event
async def answer(sid, data):
    await sio.emit("answer", data, room=data.get("roomId"), skip_sid=sid)

@sio.event
async def candidate(sid, data):
    await sio.emit("candidate", data, room=data.get("roomId"), skip_sid=sid)

@sio.event
async def leave(sid, data):
    await sio.emit("leave", data, room=data.get("roomId"))
    await sio.leave_room(sid, data.get("roomId"))