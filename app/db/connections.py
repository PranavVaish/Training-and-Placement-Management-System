import os
import mysql.connector

db_user = os.getenv("DATABASE_USER")
db_password = os.getenv("DATABASE_PASSWORD")
db_host = os.getenv("DATABASE_HOST")
db_port = os.getenv("DATABASE_PORT")
db_name = os.getenv("DATABASE_NAME")

dbconfig = {
    "user": db_user,
    "password": db_password,
    "host": db_host,
    "port": db_port,
    "database": db_name,
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
