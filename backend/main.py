from pathlib import Path
from uuid import uuid4

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from starlette.concurrency import run_in_threadpool

from app.separation.service import separate_audio

app = FastAPI(
title="VocalSplit AI Backend",
description="AI-powered audio source separation service",
version="1.0.0"
)

app.add_middleware(
CORSMiddleware,
allow_origins=["http://localhost:5173"],
allow_credentials=False,
allow_methods=["GET", "POST"],
allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
TEMP_DIR = BASE_DIR / "temp"

SUPPORTED_FORMATS = {
".wav",
".mp3",
".flac",
".aac",
".m4a",
}

MAX_FILE_SIZE = 100 * 1024 * 1024

@app.get("/")
async def root():
    return {
        "application": "VocalSplit AI",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "VocalSplit AI Backend",
        "ai_engine": "Demucs"
    }


@app.post("/api/separate")
async def separate(file: UploadFile = File(...)):
    extension = Path(file.filename or "").suffix.lower()

    if extension not in SUPPORTED_FORMATS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported audio format."
        )

    TEMP_DIR.mkdir(parents=True, exist_ok=True)

    job_id = str(uuid4())
    input_path = TEMP_DIR / f"{job_id}{extension}"

    try:
        file_size = 0

        with input_path.open("wb") as audio_file:
            while chunk := await file.read(1024 * 1024):
                file_size += len(chunk)

                if file_size > MAX_FILE_SIZE:
                    raise HTTPException(
                        status_code=413,
                        detail="Audio file exceeds the 100 MB limit."
                    )

                audio_file.write(chunk)

        result = await run_in_threadpool(
            separate_audio,
            input_path
        )

        return {
            "status": "completed",
            "message": "Audio separation completed successfully.",
            **result
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        ) from error

    finally:
        if input_path.exists():
            input_path.unlink()

