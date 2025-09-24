from pydantic_settings import BaseSettings
from pydantic import AnyUrl
from typing import List
import os

class Settings(BaseSettings):
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./app.db")
    secret_key: str = os.getenv("SECRET_KEY", "change_me_dev_secret")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    algorithm: str = "HS256"
    cors_origins: List[str] = (
        os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
        if os.getenv("CORS_ORIGINS")
        else ["http://localhost:5173"]
    )

settings = Settings()
