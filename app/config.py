from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


ROOT_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_env: str = "local"
    database_url: str = f"sqlite:///{(ROOT_DIR / 'data' / 'gjakova_cases.db').as_posix()}"
    kb_dir: Path = ROOT_DIR / "knowledge"
    artifacts_dir: Path = ROOT_DIR / "artifacts"
    data_dir: Path = ROOT_DIR / "data"
    embedding_model: str = "intfloat/multilingual-e5-small"
    duplicate_window_days: int = 30
    merge_threshold: float = 0.78
    geo_radius_meters: float = 100.0
    log_level: str = "INFO"
    host: str = "127.0.0.1"
    port: int = 8000
    kb_version: str = "1.0.0"
    model_version: str = "2.0.0"


settings = Settings()
