import mysql.connector
import os

dbconfig = {
    "user": os.environ.get("DATABASE_USER", "root"),
    "password": os.environ.get("DATABASE_PASSWORD", "password"),
    "host": os.environ.get("DATABASE_HOST", "localhost"),
    "port": os.environ.get("DATABASE_PORT", 3306),
    "database": os.environ.get("DATABASE_NAME", "mydb"),
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
