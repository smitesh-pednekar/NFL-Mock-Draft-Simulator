import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    groq_api_key: str = ""
    cors_origins: list[str] = ["http://localhost:3000"]
    draft_session_ttl_seconds: int = 3600  # 1 hour

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
