import subprocess
import sys
import uuid

from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parents[2]

OUTPUT_DIR = BACKEND_DIR / "outputs"
TEMP_DIR = BACKEND_DIR / "temp"

MODEL_NAME = "htdemucs"

SUPPORTED_FORMATS = {
    ".wav",
    ".mp3",
    ".flac",
    ".aac",
    ".m4a",
}


def separate_audio(file_path: Path) -> dict:
    """
    Separate an audio file into vocals and instrumental tracks
    using the Demucs AI model.
    """
    file_path = Path(file_path)

    if not file_path.exists():
        raise FileNotFoundError("Input audio file does not exist.")

    if file_path.suffix.lower() not in SUPPORTED_FORMATS:
        raise ValueError("Unsupported audio format.")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    job_id = str(uuid.uuid4())
    job_output_dir = OUTPUT_DIR / job_id
    job_output_dir.mkdir(parents=True, exist_ok=True)

    command = [
        sys.executable,
        "-m",
        "demucs",
        "--two-stems=vocals",
        "-n",
        MODEL_NAME,
        "-o",
        str(job_output_dir),
        str(file_path),
    ]

    try:
        subprocess.run(
            command,
            capture_output=True,
            text=True,
            check=True,
        )
    except subprocess.CalledProcessError as error:
        raise RuntimeError(
            f"Demucs separation failed: {error.stderr}"
        ) from error

    track_name = file_path.stem
    result_dir = job_output_dir / MODEL_NAME / track_name

    vocals_path = result_dir / "vocals.wav"
    instrumental_path = result_dir / "no_vocals.wav"

    if not vocals_path.exists() or not instrumental_path.exists():
        raise RuntimeError("Demucs did not generate the expected output files.")

    return {
        "job_id": job_id,
        "model": MODEL_NAME,
        "vocals": str(vocals_path),
        "instrumental": str(instrumental_path),
    }

