import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

dbconfig = {
    "user": os.getenv("DATABASE_USER", "root"),
    "password": os.getenv("DATABASE_PASSWORD", "root"),
    "host": os.getenv("DATABASE_HOST", "localhost"),
    "port": os.getenv("DATABASE_PORT", 3306),
    "database": os.getenv("DATABASE_NAME", "mydb"),
    "raise_on_warnings": True
}

try:
    pool = mysql.connector.pooling.MySQLConnectionPool(pool_name="mypool",
                                            pool_size=5,
                                            **dbconfig)
    print("Connection pool created successfully")
except mysql.connector.Error as e:
    print(f"Error creating connection pool: {e}")
    pool = None
# Create a ConnectionPool

def get_db():
    """
    Get a connection from the connection pool.
    """
    if pool:
        try:
            connection = pool.get_connection()
            return connection
        except mysql.connector.Error as e:
            print(f"Error getting connection from pool: {e}")
            return None
    else:
        print("Connection pool is not available")
        return None
