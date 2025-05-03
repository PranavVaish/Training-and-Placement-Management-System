import os
import psycopg


db_user = os.getenv("DATABASE_USER")
db_password = os.getenv("DATABASE_PASSWORD")
db_host = os.getenv("DATABASE_HOST")
db_port = os.getenv("DATABASE_PORT")
db_name = os.getenv("DATABASE_NAME")


DATABASE_URL = os.getenv(f"postgres://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}")

def get_db_connection():
    return psycopg.connect(DATABASE_URL)
