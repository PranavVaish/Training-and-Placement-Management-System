-- AUTH TABLES
CREATE TABLE IF NOT EXISTS refresh_tokens (
    refresh_token VARCHAR(255) PRIMARY KEY,
    user_id INT NOT NULL,
    expiry_date DATETIME NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE
);


-- ADMIN TABLES
CREATE TABLE IF NOT EXISTS Admin (
    Admin_ID INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Role VARCHAR(50),
    Password BLOB NOT NULL
);

CREATE TABLE IF NOT EXISTS Email (
    Email_ID VARCHAR(100) ,
    Admin_ID INT,
    FOREIGN KEY (Admin_ID) REFERENCES Admin(Admin_ID)
);

CREATE TABLE IF NOT EXISTS Phone (
    Phone_No VARCHAR(15) ,
    Admin_ID INT,
    FOREIGN KEY (Admin_ID) REFERENCES Admin(Admin_ID)
);


-- STUDENT TABLES
CREATE TABLE IF NOT EXISTS Student (
    Student_ID INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    CGPA DECIMAL(3,2),
    Graduation_Year INT,
    Department VARCHAR(100),
    Password BLOB NOT NULL
);

CREATE TABLE IF NOT EXISTS Student_Email (
    Email_ID VARCHAR(100) ,
    Student_ID INT,
    FOREIGN KEY (Student_ID) REFERENCES Student(Student_ID)
);

CREATE TABLE IF NOT EXISTS Student_Phone (
    Phone_No VARCHAR(15) ,
    Student_ID INT,
    FOREIGN KEY (Student_ID) REFERENCES Student(Student_ID)
);


-- COMPANY TABLES
CREATE TABLE IF NOT EXISTS Company (
    Company_ID INT PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Industry_Type VARCHAR(100),
    Contact_Person VARCHAR(100),
    Website VARCHAR(100),
    Password BLOB NOT NULL
);

CREATE TABLE IF NOT EXISTS Company_Email (
    Email_ID VARCHAR(100),
    Company_ID INT,
    FOREIGN KEY (Company_ID) REFERENCES Company(Company_ID)
);

CREATE TABLE IF NOT EXISTS Company_Phone (
    Phone_No VARCHAR(15) ,
    Company_ID INT,
    FOREIGN KEY (Company_ID) REFERENCES Company(Company_ID)
);

CREATE TABLE IF NOT EXISTS Company_Location (
    Company_ID INT,
    Location VARCHAR(100),
    PRIMARY KEY (Company_ID, Location),
    FOREIGN KEY (Company_ID) REFERENCES Company(Company_ID)
);

CREATE TABLE IF NOT EXISTS Company_Hiring_History (
    Company_ID INT,
    Hiring_Period VARCHAR(50),
    Job_Roles TEXT,
    PRIMARY KEY (Company_ID, Hiring_Period),
    FOREIGN KEY (Company_ID) REFERENCES Company(Company_ID)
);


-- JOB TABLE
CREATE TABLE IF NOT EXISTS Job (
    Job_ID INT PRIMARY KEY,
    Job_Title VARCHAR(100) NOT NULL,
    Job_Description TEXT,
    Salary DECIMAL(10,2),
    Company_ID INT,
    Job_Type VARCHAR(50),
    Vacancies INT,
    Application_Deadline DATE,
    FOREIGN KEY (Company_ID) REFERENCES Company(Company_ID)
);

CREATE TABLE IF NOT EXISTS Job_Eligibility (
    Job_ID INT,
    Eligibility_Criterion VARCHAR(100),
    PRIMARY KEY (Job_ID, Eligibility_Criterion),
    FOREIGN KEY (Job_ID) REFERENCES Job(Job_ID)
);

CREATE TABLE IF NOT EXISTS Job_Location (
    Job_ID INT,
    Location VARCHAR(100),
    PRIMARY KEY (Job_ID, Location),
    FOREIGN KEY (Job_ID) REFERENCES Job(Job_ID)
);

-- Trainer Set
CREATE TABLE IF NOT EXISTS Trainer (
    Trainer_ID INT PRIMARY KEY,
    Expertise VARCHAR(100),
    Name VARCHAR(100),
    Organisation VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Trainer_Email (
    Email VARCHAR(100),
    Trainer_ID INT,
    FOREIGN KEY (Trainer_ID) REFERENCES Trainer(Trainer_ID)
);

CREATE TABLE IF NOT EXISTS Trainer_Phone (
    Phone_No VARCHAR(15),
    Trainer_ID INT,
    FOREIGN KEY (Trainer_ID) REFERENCES Trainer(Trainer_ID)
);


-- Placement Records Set
CREATE TABLE IF NOT EXISTS Placement_Record (
    Placement_ID INT PRIMARY KEY,
    Student_ID INT,
    Job_ID INT,
    Company_ID INT,
    Package DECIMAL(10,2),
    Placement_Date DATE,
    Placement_Location VARCHAR(100),
    FOREIGN KEY (Student_ID) REFERENCES Student(Student_ID),
    FOREIGN KEY (Job_ID) REFERENCES Job(Job_ID),
    FOREIGN KEY (Company_ID) REFERENCES Company(Company_ID)
);


-- Feedback Set
CREATE TABLE IF NOT EXISTS Feedback (
    Feedback_ID INT PRIMARY KEY,
    Student_ID INT,
    Rating INT,
    Comments TEXT,
    Trainer_ID INT,
    FOREIGN KEY (Student_ID) REFERENCES Student(Student_ID),
    FOREIGN KEY (Trainer_ID) REFERENCES Trainer(Trainer_ID)
);


-- TRAINING PROGRAM
CREATE TABLE Training_Program (
    Training_ID INT PRIMARY KEY,
    Training_Name VARCHAR(100),
    Training_Description TEXT,
    Duration INT,  -- Duration in days/weeks/etc.
    Trainer_ID INT,
    Start_Date DATE,
    End_Date DATE,
    Mode VARCHAR(50),  -- e.g., Online, Offline, Hybrid
    Certification_Provided BOOLEAN,
    Training_Cost DECIMAL(10,2),
    FOREIGN KEY (Trainer_ID) REFERENCES Trainer(Trainer_ID)
);

-- TRAINING ENROLLMENT
CREATE TABLE Training_Enrollment (
    Enrollment_ID INT PRIMARY KEY AUTO_INCREMENT,
    Training_ID INT,
    Student_ID INT,
    Performance_Grade VARCHAR(10),
    Completion_Status VARCHAR(20),
    FOREIGN KEY (Training_ID) REFERENCES Training_Program(Training_ID),
    FOREIGN KEY (Student_ID) REFERENCES Student(Student_ID)
);



-- APPLICATION SET (WEAK ENTITY)
CREATE TABLE IF NOT EXISTS Application (
    Application_ID INT PRIMARY KEY AUTO_INCREMENT,
    Student_ID INT,
    Job_ID INT,
    Application_Date DATE,
    Status VARCHAR(50),
    FOREIGN KEY (Student_ID) REFERENCES Student(Student_ID),
    FOREIGN KEY (Job_ID) REFERENCES Job(Job_ID),
);

-- Interview Schedule Set (Weak Entity)
CREATE TABLE Interview_Schedule (
    Interview_ID INT PRIMARY KEY AUTO_INCREMENT,
    Application_ID INT,
    Date DATE,
    Time TIME,
    Mode VARCHAR(50),
    Interviewer_Name VARCHAR(100),
    FOREIGN KEY (Application_ID) REFERENCES Application(Application_ID)
);