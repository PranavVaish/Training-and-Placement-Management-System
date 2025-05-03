-- AUTH TABLES
CREATE TABLE refresh_tokens (
    refresh_token VARCHAR(255) PRIMARY KEY,
    user_id INT NOT NULL,
    expiry_date DATETIME NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE
);

--ADMIN TABLES
CREATE TABLE Admin (
    Admin_ID INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Role VARCHAR(50),
    Password BLOB NOT NULL
);

CREATE TABLE Email (
    Email_ID VARCHAR(100) PRIMARY KEY,
    Admin_ID INT,
    FOREIGN KEY (Admin_ID) REFERENCES Admin(Admin_ID)
);

CREATE TABLE Phone (
    Phone_No VARCHAR(15) PRIMARY KEY,
    Admin_ID INT,
    FOREIGN KEY (Admin_ID) REFERENCES Admin(Admin_ID)
);


--STUDENT TABLES
CREATE TABLE Student (
    Student_ID INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    CGPA DECIMAL(3,2),
    Graduation_Year INT,
    Department VARCHAR(100),
    Password BLOB NOT NULL
);

CREATE TABLE Student_Email (
    Email_ID VARCHAR(100) PRIMARY KEY,
    Student_ID INT,
    FOREIGN KEY (Student_ID) REFERENCES Student(Student_ID)
);

CREATE TABLE Student_Phone (
    Phone_No VARCHAR(15) PRIMARY KEY,
    Student_ID INT,
    FOREIGN KEY (Student_ID) REFERENCES Student(Student_ID)
);


--COMPANY TABLES
CREATE TABLE Company (
    Company_ID INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Industry_Type VARCHAR(100),
    Contact_Person VARCHAR(100),
    Website VARCHAR(100),
    Password BLOB NOT NULL
);

CREATE TABLE Company_Email (
    Email_ID VARCHAR(100) PRIMARY KEY,
    Company_ID INT,
    FOREIGN KEY (Company_ID) REFERENCES Company(Company_ID)
);

CREATE TABLE Company_Phone (
    Phone_No VARCHAR(15) PRIMARY KEY,
    Company_ID INT,
    FOREIGN KEY (Company_ID) REFERENCES Company(Company_ID)
);

CREATE TABLE Company_Location (
    Company_ID INT,
    Location VARCHAR(100),
    PRIMARY KEY (Company_ID, Location),
    FOREIGN KEY (Company_ID) REFERENCES Company(Company_ID)
);

CREATE TABLE Company_Hiring_History (
    Company_ID INT,
    Hiring_Period VARCHAR(50),
    Job_Roles TEXT,
    PRIMARY KEY (Company_ID, Hiring_Period),
    FOREIGN KEY (Company_ID) REFERENCES Company(Company_ID)
);