from dotenv import load_dotenv
import os

load_dotenv()

class Settings:

    GROQ_API_KEY = os.getenv("GROQ_API_KEY")

    VECTOR_DB_PATH = os.getenv(
        "VECTOR_DB_PATH"
    )

    POSTGRES_HOST = os.getenv(
        "POSTGRES_HOST"
    )

    POSTGRES_PORT = os.getenv(
        "POSTGRES_PORT"
    )

    POSTGRES_DB = os.getenv(
        "POSTGRES_DB"
    )

    POSTGRES_USER = os.getenv(
        "POSTGRES_USER"
    )

    POSTGRES_PASSWORD = os.getenv(
        "POSTGRES_PASSWORD"
    )

settings = Settings()