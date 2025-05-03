import mysql.connector

db_user = "root"
db_password = "root"
db_host = "localhost"
db_port = 3306
db_name = "mydb"

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
