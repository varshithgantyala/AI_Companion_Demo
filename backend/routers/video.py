from fastapi import APIRouter
import uuid, time
router = APIRouter(prefix="/api/video", tags=["video"])

@router.post("/rooms")
def create_room():
    room_id = str(uuid.uuid4())
    return {"roomId": room_id, "expiresAt": time.time() + 3600}

@router.get("/rooms/{room_id}")
def get_room(room_id: str):
    # In a real app you'd look up room status in DB
    return {"roomId": room_id, "status": "active"}

@router.get("/webrtc/config")
def get_ice_config():
    return {
        "iceServers": [
            {"urls": ["stun:stun.l.google.com:19302"]},
            {"urls": "turn:global.turn.twilio.com:3478", "username": "demo", "credential": "demo"}
        ]
    }
