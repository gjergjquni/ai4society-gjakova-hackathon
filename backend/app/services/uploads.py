from __future__ import annotations

import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile

from ..config import MAX_UPLOAD_BYTES, PUBLIC_BASE_URL, UPLOAD_DIR

ALLOWED_SUFFIXES = {".jpg", ".jpeg", ".png", ".webp", ".gif"}


def public_upload_url(filename: str) -> str:
    path = f"/api/v1/uploads/{filename}"
    if PUBLIC_BASE_URL:
        return f"{PUBLIC_BASE_URL}{path}"
    return path


def save_photo(upload: UploadFile | None) -> str | None:
    if upload is None or not upload.filename:
        return None
    suffix = Path(upload.filename).suffix.lower()
    if suffix not in ALLOWED_SUFFIXES:
        raise HTTPException(status_code=422, detail="Fotoja duhet të jetë JPG, PNG, WEBP ose GIF")
    content = upload.file.read()
    if not content:
        return None
    if len(content) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=422, detail="Fotoja është shumë e madhe (maks. 8 MB)")
    filename = f"{uuid.uuid4().hex}{suffix}"
    dest = UPLOAD_DIR / filename
    dest.write_bytes(content)
    return public_upload_url(filename)


def resolve_upload_path(filename: str) -> Path:
    safe = Path(filename).name
    path = (UPLOAD_DIR / safe).resolve()
    if path.parent != UPLOAD_DIR.resolve() or not path.is_file():
        raise HTTPException(status_code=404, detail="File not found")
    return path
