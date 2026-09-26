from fastapi import APIRouter
from fastapi.responses import FileResponse

from ..services.uploads import resolve_upload_path

router = APIRouter(tags=["uploads"])


@router.get("/uploads/{filename}")
def get_upload(filename: str):
    path = resolve_upload_path(filename)
    return FileResponse(path)
