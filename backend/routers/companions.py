from fastapi import APIRouter, HTTPException
import os, aiohttp
router = APIRouter(prefix="/api/companions", tags=["companions"])
SOURCE = os.environ.get("PERSONA_FETCHER_URL", "https://persona-fetcher-api.up.railway.app/personas")

@router.get("/")
async def list_companions():
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(SOURCE) as resp:
                if resp.status != 200:
                    raise HTTPException(status_code=502, detail="Upstream fetch failed")
                data = await resp.json()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
