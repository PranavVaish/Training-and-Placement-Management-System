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


-- Job Listing Procedures
--Stored Procedure: Get All Active Jobs with Company Name
DELIMITER //

CREATE PROCEDURE GetNotExpiredJobListingsWithCompanyName()
BEGIN
    DECLARE done INT DEFAULT FALSE;

    -- Declare variables to hold each column
    DECLARE v_JobID INT;
    DECLARE v_JobTitle VARCHAR(100);
    DECLARE v_Salary DECIMAL(10,2);
    DECLARE v_CompanyName VARCHAR(100);
    DECLARE v_JobType VARCHAR(50);
    DECLARE v_Deadline DATE;

    -- Cursor for not expired (active) job listings with company name
    DECLARE job_cursor CURSOR FOR
        SELECT 
            j.Job_ID, j.Job_Title, j.Salary,
            c.Name, j.Job_Type, j.Application_Deadline
        FROM Job j
        JOIN Company c ON j.Company_ID = c.Company_ID
        WHERE j.Application_Deadline >= CURDATE();

    -- Handler for end of data
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN job_cursor;

    read_loop: LOOP
        FETCH job_cursor INTO v_JobID, v_JobTitle, v_Salary,
                             v_CompanyName, v_JobType, v_Deadline;

        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Output one row at a time
        SELECT 
            v_JobID AS Job_ID,
            v_JobTitle AS Job_Title,
            v_Salary AS Salary,
            v_CompanyName AS Company_Name,
            v_JobType AS Job_Type,
            v_Deadline AS Application_Deadline;
    END LOOP;

    CLOSE job_cursor;
END //

DELIMITER ;

--Stored Procedure: Get All Expired Jobs of a Company
DELIMITER //
CREATE PROCEDURE GetExpiredJobListingsByCompany(
    IN p_CompanyID INT
)
BEGIN
    DECLARE done INT DEFAULT FALSE;

    -- Declare variables to hold each column
    DECLARE v_JobID INT;
    DECLARE v_JobTitle VARCHAR(100);
    DECLARE v_Salary DECIMAL(10,2);
    DECLARE v_CompanyName VARCHAR(100);
    DECLARE v_JobType VARCHAR(50);
    DECLARE v_Deadline DATE;

    -- Cursor for expired job listings with company name for a specific company
    DECLARE job_cursor CURSOR FOR
        SELECT 
            j.Job_ID, j.Job_Title, j.Salary,
            c.Name, j.Job_Type, j.Application_Deadline
        FROM Job j
        JOIN Company c ON j.Company_ID = c.Company_ID
        WHERE j.Application_Deadline < CURDATE()
          AND j.Company_ID = p_CompanyID;

    -- Handler for end of data
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN job_cursor;

    read_loop: LOOP
        FETCH job_cursor INTO v_JobID, v_JobTitle, v_Salary,
                             v_CompanyName, v_JobType, v_Deadline;

        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Output one row at a time
        SELECT 
            v_JobID AS Job_ID,
            v_JobTitle AS Job_Title,
            v_Salary AS Salary,
            v_CompanyName AS Company_Name,
            v_JobType AS Job_Type,
            v_Deadline AS Application_Deadline;
    END LOOP;

    CLOSE job_cursor;
END //
DELIMITER ;

--Stored Procedure: Get All Expired Jobs of a Company
DELIMITER //
CREATE PROCEDURE GetActiveJobListingsByCompany(
    IN p_CompanyID INT
)
BEGIN
    DECLARE done INT DEFAULT FALSE;

    -- Declare variables to hold each column
    DECLARE v_JobID INT;
    DECLARE v_JobTitle VARCHAR(100);
    DECLARE v_Salary DECIMAL(10,2);
    DECLARE v_CompanyName VARCHAR(100);
    DECLARE v_JobType VARCHAR(50);
    DECLARE v_Deadline DATE;

    -- Cursor for expired job listings with company name for a specific company
    DECLARE job_cursor CURSOR FOR
        SELECT 
            j.Job_ID, j.Job_Title, j.Salary,
            c.Name, j.Job_Type, j.Application_Deadline
        FROM Job j
        JOIN Company c ON j.Company_ID = c.Company_ID
        WHERE j.Application_Deadline >= CURDATE()
          AND j.Company_ID = p_CompanyID;

    -- Handler for end of data
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    OPEN job_cursor;

    read_loop: LOOP
        FETCH job_cursor INTO v_JobID, v_JobTitle, v_Salary,
                             v_CompanyName, v_JobType, v_Deadline;

        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Output one row at a time
        SELECT 
            v_JobID AS Job_ID,
            v_JobTitle AS Job_Title,
            v_Salary AS Salary,
            v_CompanyName AS Company_Name,
            v_JobType AS Job_Type,
            v_Deadline AS Application_Deadline;
    END LOOP;

    CLOSE job_cursor;
END //
DELIMITER ;

-- Stored Procedure: Add Job with Multiple Details
DELIMITER //

CREATE PROCEDURE AddJobWithMultipleDetails(
    IN p_JobID INT,
    IN p_JobTitle VARCHAR(100),
    IN p_JobDescription TEXT,
    IN p_Salary DECIMAL(10,2),
    IN p_CompanyID INT,
    IN p_JobType VARCHAR(50),
    IN p_Vacancies INT,
    IN p_ApplicationDeadline DATE,
    IN p_EligibilityCriteriaList TEXT,   -- comma-separated
    IN p_LocationList TEXT               -- comma-separated
)
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE total_eligibility INT;
    DECLARE total_location INT;
    DECLARE criterion VARCHAR(100);
    DECLARE location VARCHAR(100);

    -- Insert into Job table
    INSERT INTO Job (Job_ID, Job_Title, Job_Description, Salary, Company_ID, Job_Type, Vacancies, Application_Deadline)
    VALUES (p_JobID, p_JobTitle, p_JobDescription, p_Salary, p_CompanyID, p_JobType, p_Vacancies, p_ApplicationDeadline);

    -- Count how many items are in the comma-separated strings
    SET total_eligibility = LENGTH(p_EligibilityCriteriaList) - LENGTH(REPLACE(p_EligibilityCriteriaList, ',', '')) + 1;
    SET total_location = LENGTH(p_LocationList) - LENGTH(REPLACE(p_LocationList, ',', '')) + 1;

    -- Insert into Job_Eligibility
    SET i = 1;
    WHILE i <= total_eligibility DO
        SET criterion = TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(p_EligibilityCriteriaList, ',', i), ',', -1));
        INSERT INTO Job_Eligibility (Job_ID, Eligibility_Criterion)
        VALUES (p_JobID, criterion);
        SET i = i + 1;
    END WHILE;

    -- Insert into Job_Location
    SET i = 1;
    WHILE i <= total_location DO
        SET location = TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(p_LocationList, ',', i), ',', -1));
        INSERT INTO Job_Location (Job_ID, Location)
        VALUES (p_JobID, location);
        SET i = i + 1;
    END WHILE;
END //

DELIMITER ;