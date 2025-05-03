import mysql.connector
import os

def setup_database():
    """
    Execute the master SQL script to set up the database.
    """
    db_user = os.getenv("DATABASE_USER")
    db_password = os.getenv("DATABASE_PASSWORD")
    db_host = os.getenv("DATABASE_HOST")
    db_port = os.getenv("DATABASE_PORT")
    db_name = os.getenv("DATABASE_NAME")

    try:
        connection = mysql.connector.connect(
            user=db_user,
            password=db_password,
            host=db_host,
            port=db_port,
            database=db_name,
            multiple_statements=True  # Allow multiple statements in one query
        )
        cursor = connection.cursor()

        # Read the SQL script from file
        with open("./setup_database.sql", "r") as f:
            sql_script = f.read()

        # Execute the SQL script
        for result in cursor.execute(sql_script, multi=True):
            if result.with_rows:
                print("Fetched rows:", result.fetchall())
            else:
                print("Command executed")
        connection.commit()
        print("Database setup script executed successfully")

    except mysql.connector.Error as e:
        print(f"Error executing database setup script: {e}")

    finally:
        if connection and connection.is_connected():
            cursor.close()
            connection.close()