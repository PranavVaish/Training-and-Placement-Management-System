-- Registration Procedures
-- Stored Procedure: Register Admin
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS AddAdminWithContact(
    IN p_AdminID INT,
    IN p_Name VARCHAR(100),
    IN p_Role VARCHAR(50),
    IN p_Password VARCHAR(100),
    IN p_EmailID VARCHAR(100),
    IN p_PhoneNo VARCHAR(20)
)
BEGIN
    -- Insert into Admin table
    INSERT INTO Admin (Admin_ID, Name, Role, Password)
    VALUES (p_AdminID, p_Name, p_Role, p_Password);

    -- Insert into Email table
    INSERT INTO Email (Email_ID, Admin_ID)
    VALUES (p_EmailID, p_AdminID);

    -- Insert into Phone table
    INSERT INTO Phone (Phone_No, Admin_ID)
    VALUES (p_PhoneNo, p_AdminID);
END //

DELIMITER ;

--Stored Procedure: Register Student
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS AddStudentWithContact(
    IN p_StudentID INT,
    IN p_Name VARCHAR(100),
    IN p_CGPA DECIMAL(3,2),
    IN p_GraduationYear INT,
    IN p_Department VARCHAR(100),
    IN p_Password VARCHAR(100),
    IN p_EmailID VARCHAR(100),
    IN p_PhoneNo VARCHAR(15)
)
BEGIN
    -- Insert into Student table
    INSERT INTO Student (Student_ID, Name, CGPA, Graduation_Year, Department, Password)
    VALUES (p_StudentID, p_Name, p_CGPA, p_GraduationYear, p_Department, p_Password);

    -- Insert into Student_Email table
    INSERT INTO Student_Email (Email_ID, Student_ID)
    VALUES (p_EmailID, p_StudentID);

    -- Insert into Student_Phone table
    INSERT INTO Student_Phone (Phone_No, Student_ID)
    VALUES (p_PhoneNo, p_StudentID);
END //

DELIMITER ;

-- Stored Procedure: Register Company
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS AddCompanyWithDetails(
    IN p_CompanyID INT,
    IN p_Name VARCHAR(100),
    IN p_IndustryType VARCHAR(100),
    IN p_ContactPerson VARCHAR(100),
    IN p_Website VARCHAR(100),
    IN p_Password VARCHAR(100),
    IN p_EmailID VARCHAR(100),
    IN p_PhoneNo VARCHAR(15),
    IN p_Location VARCHAR(100)
)
BEGIN
    -- Insert into Company table
    INSERT INTO Company (Company_ID, Name, Industry_Type, Contact_Person, Website, Password)
    VALUES (p_CompanyID, p_Name, p_IndustryType, p_ContactPerson, p_Website, p_Password);

    -- Insert into Company_Email table
    INSERT INTO Company_Email (Email_ID, Company_ID)
    VALUES (p_EmailID, p_CompanyID);

    -- Insert into Company_Phone table
    INSERT INTO Company_Phone (Phone_No, Company_ID)
    VALUES (p_PhoneNo, p_CompanyID);

    -- Insert into Company_Location table
    INSERT INTO Company_Location (Company_ID, Location)
    VALUES (p_CompanyID, p_Location);
END //

DELIMITER ;

--Stored Procedure: Register Trainer
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS AddTrainerWithDetails(
    IN p_TrainerID INT,
    IN p_Expertise VARCHAR(100),
    IN p_Name VARCHAR(100),
    IN p_Organisation VARCHAR(100),
    IN p_Email VARCHAR(100),
    IN p_PhoneNo VARCHAR(15)
)
BEGIN
    -- Insert into Trainer table
    INSERT INTO Trainer (Trainer_ID, Expertise, Name, Organisation)
    VALUES (p_TrainerID, p_Expertise, p_Name, p_Organisation);

    -- Insert into Trainer_Email table
    INSERT INTO Trainer_Email (Email, Trainer_ID)
    VALUES (p_Email, p_TrainerID);

    -- Insert into Trainer_Phone table
    INSERT INTO Trainer_Phone (Phone_No, Trainer_ID)
    VALUES (p_PhoneNo, p_TrainerID);
END //

DELIMITER ;
