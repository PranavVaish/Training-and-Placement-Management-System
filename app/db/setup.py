import mysql.connector
import os
import pathlib
import re

def execute_sql_file(cursor, filepath):
    """Execute a SQL file with proper handling for CREATE PROCEDURE statements."""
    try:
        print(f"Executing SQL file: {filepath}")
        
        # Check if the file exists
        if not os.path.isfile(filepath):
            print(f"Error: SQL file not found: {filepath}")
            return False
            
        with open(filepath, 'r') as f:
            # Read the SQL file content
            content = f.read()
            
        # Special handling for stored procedures
        if "CREATE PROCEDURE" in content:
            # First, execute any non-procedure statements
            # Extract and execute all statements that don't contain "CREATE PROCEDURE"
            # This uses regex to split on semicolons but not inside procedure bodies
            statements = []
            # Split by DROP PROCEDURE and CREATE PROCEDURE separately
            procedure_pattern = r'(DROP\s+PROCEDURE\s+IF\s+EXISTS\s+\w+;|CREATE\s+PROCEDURE\s+(?:IF\s+NOT\s+EXISTS\s+)?\w+\s*\([\s\S]*?END;)'
            
            # Find all procedure statements
            proc_matches = re.finditer(procedure_pattern, content, re.IGNORECASE | re.MULTILINE)
            
            for match in proc_matches:
                proc_stmt = match.group(0)
                statements.append(proc_stmt)
                # Remove the procedure from content to handle the rest separately
                content = content.replace(proc_stmt, "")
            
            # Handle remaining SQL statements (non-procedures)
            for stmt in content.split(';'):
                stmt = stmt.strip()
                if stmt:
                    statements.append(stmt + ';')
            
            # Now execute all gathered statements one by one
            for stmt in statements:
                stmt = stmt.strip()
                if stmt:
                    try:
                        print(f"Executing statement (first 50 chars): {stmt[:50]}...")
                        cursor.execute(stmt)
                        if cursor.with_rows:
                            print(f"Query results: {cursor.fetchall()}")
                    except mysql.connector.Error as e:
                        print(f"Error executing statement: {e}")
                        print(f"Failed statement: {stmt}")
                        # Continue to next statement instead of aborting
        else:
            # Regular SQL file without procedures
            statements = content.split(';')
            for stmt in statements:
                stmt = stmt.strip()
                if stmt:
                    try:
                        cursor.execute(stmt)
                        if cursor.with_rows:
                            print(f"Query results: {cursor.fetchall()}")
                    except mysql.connector.Error as e:
                        print(f"Error executing statement: {e}")
                        print(f"Failed statement: {stmt}")
                        # Continue with other statements
        
        return True
    except Exception as e:
        print(f"Error processing file {filepath}: {e}")
        return False

def setup_database():
    """
    Set up the database by executing the required SQL scripts.
    """
    # Get the project root directory
    # Assuming this file is in app/db/setup.py, adjust accordingly
    current_file = pathlib.Path(__file__)
    scripts_root = current_file.parent # Go up three levels to reach project root
    
    # Database connection settings - consider using environment variables
    db_host = os.environ.get('DB_HOST', 'localhost')
    db_port = int(os.environ.get('DB_PORT', 3306))
    db_name = os.environ.get('DB_NAME', 'mydb')
    
    connection = None
    cursor = None
    success = False

    try:
        # Connect to the database
        print(f"Connecting to database {db_name} at {db_host}:{db_port}")
        connection = mysql.connector.connect(
            user=os.environ.get('DB_USER', 'root'),
            password=os.environ.get('DB_PASSWORD', 'root'),
            host=db_host,
            port=db_port,
            database=db_name
        )
        cursor = connection.cursor()
        
        # Define the SQL files to execute in order with proper path resolution
        script_files = [
            os.path.join(scripts_root, "scripts", "create_tables.sql"),
            os.path.join(scripts_root, "scripts", "create_procedures.sql")
        ]
        
        # Execute each SQL file
        all_successful = True
        for sql_file in script_files:
            if not execute_sql_file(cursor, sql_file):
                print(f"Failed to execute {sql_file}")
                all_successful = False
                break
        
        if all_successful:
            connection.commit()
            print("Database setup completed successfully")
            success = True
        else:
            print("Database setup failed, rolling back changes")
            connection.rollback()

    except mysql.connector.Error as e:
        print(f"Database connection error: {e}")

    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()
            
    return success