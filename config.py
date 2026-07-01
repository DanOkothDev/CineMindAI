import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "cinemind-dev-secret-change-in-production"
    )

    database_url = os.getenv("DATABASE_URL")

    if database_url:
        database_url = database_url.replace(
            "postgresql://",
            "postgresql+psycopg://",
            1
        )

    SQLALCHEMY_DATABASE_URI = database_url

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_ALGORITHM = "HS256"
    JWT_EXPIRATION_DAYS = 7