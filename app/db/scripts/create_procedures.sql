-- Registration Procedures
-- Stored Procedure: Register Admin
DROP PROCEDURE IF EXISTS AddAdminWithContact;
CREATE PROCEDURE AddAdminWithContact(
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
END;

-- Stored Procedure: Retrieve Admin Data
DROP PROCEDURE IF EXISTS GetAdminData;
CREATE PROCEDURE GetAdminData()
BEGIN
    SELECT 
        a.Admin_ID,
        a.Name AS Admin_Name,
        a.Role,
        e.Email_ID AS Email,
        p.Phone_No AS Phone
    FROM 
        Admin a
    LEFT JOIN 
        Email e ON a.Admin_ID = e.Admin_ID
    LEFT JOIN 
        Phone p ON a.Admin_ID = p.Admin_ID
    ORDER BY 
        a.Name;
END;

-- Stored Procedure: Register Student
DROP PROCEDURE IF EXISTS AddStudentWithContact;
CREATE PROCEDURE AddStudentWithContact(
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
END;

-- ADD FEEDBACK
DROP PROCEDURE IF EXISTS AddFeedback;
CREATE PROCEDURE AddFeedback (
    IN p_Student_ID INT,
    IN p_Rating INT,
    IN p_Comments TEXT,
    IN p_Trainer_ID INT
)
BEGIN
    DECLARE v_Feedback_ID INT;
    DECLARE id_exists INT DEFAULT 1;

    generate_id: REPEAT
        SET v_Feedback_ID = FLOOR(100000 + (RAND() * 900000)); -- 6-digit random ID
        SELECT COUNT(*) INTO id_exists
        FROM Feedback
        WHERE Feedback_ID = v_Feedback_ID;
    UNTIL id_exists = 0 END REPEAT;

    -- Check if Student exists
    IF EXISTS (SELECT 1 FROM Student WHERE Student_ID = p_Student_ID) AND
       EXISTS (SELECT 1 FROM Trainer WHERE Trainer_ID = p_Trainer_ID) THEN

        INSERT INTO Feedback (Feedback_ID, Student_ID, Rating, Comments, Trainer_ID)
        VALUES (v_Feedback_ID, p_Student_ID, p_Rating, p_Comments, p_Trainer_ID);
    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid Student_ID, or Trainer_ID';
    END IF;
END;

-- Stored Procedure: Register Company
DROP PROCEDURE IF EXISTS AddCompanyWithDetails;
CREATE PROCEDURE AddCompanyWithDetails(
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
END;

-- Stored Procedure: Register Trainer
DROP PROCEDURE IF EXISTS AddTrainerWithDetails;
CREATE PROCEDURE AddTrainerWithDetails(
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
END;


-- Job Listing Procedures
-- Stored Procedure: Get All Active Jobs with Company Name
DROP PROCEDURE IF EXISTS GetNotExpiredJobListingsWithCompanyName;
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
    DECLARE v_Job_Description TEXT;
    DECLARE v_Vacancies INT;
    DECLARE v_Location VARCHAR(100);
    DECLARE v_eligibilty_criteria TEXT;

    -- Cursor for not expired (active) job listings with company name
    DECLARE job_cursor CURSOR FOR
        SELECT 
            j.Job_ID, j.Job_Title, j.Salary,
            c.Name, j.Job_Type, j.Application_Deadline,
            j.Job_Description, j.Vacancies, jl.Location,
            je.Eligibility_Criterion
        FROM Job j
        JOIN Company c ON j.Company_ID = c.Company_ID
        JOIN Job_Location jl ON j.Job_ID = jl.Job_ID
        JOIN Job_Eligibility je ON j.Job_ID = je.Job_ID
        WHERE j.Application_Deadline >= CURDATE();

    -- Handler for end of data
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN job_cursor;

    read_loop: LOOP
        FETCH job_cursor INTO v_JobID, v_JobTitle, v_Salary,
                            v_CompanyName, v_JobType, v_Deadline,
                            v_Job_Description, v_Vacancies, v_Location,
                            v_eligibilty_criteria;

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
            v_Deadline AS Application_Deadline,
            v_Job_Description AS Job_Description,
            v_Vacancies AS Vacancies,
            v_Location AS Location,
            v_eligibilty_criteria AS Eligibility_Criteria;
    END LOOP;

    CLOSE job_cursor;
END;

-- Stored Procedure: Get All Expired Jobs of a Company
DROP PROCEDURE IF EXISTS GetExpiredJobListingsByCompany;
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
END;

-- Stored Procedure: Get All Active Jobs of a Company
DROP PROCEDURE IF EXISTS GetActiveJobListingsByCompany;
CREATE PROCEDURE GetActiveJobListingsByCompany(
    IN p_CompanyID INT
)
BEGIN
    DECLARE done INT DEFAULT FALSE;

    -- Declare variables to hold each column
    DECLARE v_JobID INT;
    DECLARE v_JobTitle VARCHAR(100);
    DECLARE v_Salary DECIMAL(10,2);
    DECLARE v_Location VARCHAR(100);
    DECLARE v_Description TEXT;
    DECLARE v_eligibilty_criteria TEXT;
    DECLARE v_vanacancies INT;
    DECLARE v_JobType VARCHAR(50);
    DECLARE v_Deadline DATE;
    DECLARE v_CompanyName VARCHAR(100);

    -- Cursor for expired job listings with company name for a specific company
    DECLARE job_cursor CURSOR FOR
        SELECT 
            j.Job_ID, j.Job_Title, j.Salary,
            c.Name, j.Job_Type, j.Application_Deadline
        FROM Job j
        Join Job_Location k on j.Job_ID = k.Job_ID
        Join Job_Eligibility je on j.Job_ID = je.Job_ID
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
END;

-- Stored Procedure: Add Job with Multiple Details
DROP PROCEDURE IF EXISTS AddJobWithMultipleDetails;
CREATE PROCEDURE AddJobWithMultipleDetails(
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
    DECLARE new_JobID INT;

    -- Insert into Job table
    INSERT INTO Job (Job_Title, Job_Description, Salary, Company_ID, Job_Type, Vacancies, Application_Deadline)
    VALUES (p_JobTitle, p_JobDescription, p_Salary, p_CompanyID, p_JobType, p_Vacancies, p_ApplicationDeadline);

    -- Get the auto-generated Job_ID
    SET new_JobID = LAST_INSERT_ID();

    -- Count how many items are in the comma-separated strings
    SET total_eligibility = LENGTH(p_EligibilityCriteriaList) - LENGTH(REPLACE(p_EligibilityCriteriaList, ',', '')) + 1;
    SET total_location = LENGTH(p_LocationList) - LENGTH(REPLACE(p_LocationList, ',', '')) + 1;

    -- Insert into Job_Eligibility
    SET i = 1;
    WHILE i <= total_eligibility DO
        SET criterion = TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(p_EligibilityCriteriaList, ',', i), ',', -1));
        INSERT INTO Job_Eligibility (Job_ID, Eligibility_Criterion)
        VALUES (new_JobID, criterion);
        SET i = i + 1;
    END WHILE;

    -- Insert into Job_Location
    SET i = 1;
    WHILE i <= total_location DO
        SET location = TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(p_LocationList, ',', i), ',', -1));
        INSERT INTO Job_Location (Job_ID, Location)
        VALUES (new_JobID, location);
        SET i = i + 1;
    END WHILE;
END;


-- Trainer Procedures
-- Stored Procedure: GetAllTrainersRowByRow
DROP PROCEDURE IF EXISTS GetAllTrainersRowByRow;
CREATE PROCEDURE GetAllTrainersRowByRow()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_TrainerID INT;
    DECLARE v_Expertise VARCHAR(100);
    DECLARE v_Name VARCHAR(100);
    DECLARE v_Organisation VARCHAR(100);
    DECLARE v_Email VARCHAR(100);
    DECLARE v_PhoneNo VARCHAR(15);

    -- Declare the cursor
    DECLARE trainer_cursor CURSOR FOR
        SELECT 
            t.Trainer_ID, 
            t.Expertise, 
            t.Name, 
            t.Organisation,
            te.Email,
            tp.Phone_No
        FROM Trainer t
        JOIN Trainer_Email te ON t.Trainer_ID = te.Trainer_ID
        JOIN Trainer_Phone tp ON t.Trainer_ID = tp.Trainer_ID;

    -- Declare the exit handler
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- Open the cursor
    OPEN trainer_cursor;

    read_loop: LOOP
        FETCH trainer_cursor INTO v_TrainerID, v_Expertise, v_Name, v_Organisation, v_Email, v_PhoneNo;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Output each row
        SELECT 
            v_TrainerID AS Trainer_ID, 
            v_Expertise AS Expertise, 
            v_Name AS Name, 
            v_Organisation AS Organisation,
            v_Email AS Email,
            v_PhoneNo AS Phone_No;

    END LOOP;

    -- Close the cursor
    CLOSE trainer_cursor;
END;

-- Stored Procedure: GetTrainingProgramsRowByRow
DROP PROCEDURE IF EXISTS GetTrainingProgramsRowByRow;
CREATE PROCEDURE GetTrainingProgramsRowByRow()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_TrainingID INT;
    DECLARE v_TrainingName VARCHAR(100);
    DECLARE v_TrainingDescription TEXT;
    DECLARE v_Duration INT;
    DECLARE v_StartDate DATE;
    DECLARE v_EndDate DATE;
    DECLARE v_Mode VARCHAR(50);
    DECLARE v_CertificationProvided BOOLEAN;
    DECLARE v_TrainingCost DECIMAL(10,2);
    DECLARE v_TrainerName VARCHAR(100);

    -- Cursor to fetch training programs along with trainer name
    DECLARE training_cursor CURSOR FOR
        SELECT 
            tp.Training_ID,
            tp.Training_Name,
            tp.Training_Description,
            tp.Duration,
            tp.Start_Date,
            tp.End_Date,
            tp.Mode,
            tp.Certification_Provided,
            tp.Training_Cost,
            t.Name
        FROM Training_Program tp
        JOIN Trainer t ON tp.Trainer_ID = t.Trainer_ID;

    -- Handler for end of rows
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- Open cursor
    OPEN training_cursor;

    read_loop: LOOP
        FETCH training_cursor INTO
            v_TrainingID,
            v_TrainingName,
            v_TrainingDescription,
            v_Duration,
            v_StartDate,
            v_EndDate,
            v_Mode,
            v_CertificationProvided,
            v_TrainingCost,
            v_TrainerName;

        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Output one row at a time
        SELECT 
            v_TrainingID AS Training_ID,
            v_TrainingName AS Training_Name,
            v_TrainingDescription AS Description,
            v_Duration AS Duration,
            v_StartDate AS Start_Date,
            v_EndDate AS End_Date,
            v_Mode AS Mode,
            v_CertificationProvided AS Certification_Provided,
            v_TrainingCost AS Training_Cost,
            v_TrainerName AS Trainer_Name;

    END LOOP;

    CLOSE training_cursor;
END;


-- Stored Procedure: Retrieve Hiring History, Department, Candidate, Job Role, and Hiring Period
DROP PROCEDURE IF EXISTS GetHiringHistoryDetails;
CREATE PROCEDURE GetHiringHistoryDetails(
    IN p_CompanyID INT
)
BEGIN
    SELECT 
        c.Name AS Company_Name,
        s.Name AS Candidate_Name,
        s.Department,
        ch.Hiring_Period,
        ch.Job_Roles
    FROM 
        Company_Hiring_History ch
    JOIN 
        Company c ON ch.Company_ID = c.Company_ID
    JOIN 
        Placement_Record pr ON pr.Company_ID = c.Company_ID
    JOIN 
        Student s ON pr.Student_ID = s.Student_ID
    WHERE 
        c.Company_ID = p_CompanyID
    ORDER BY 
        c.Name, ch.Hiring_Period, s.Name;
END;

-- Stored Procedure: GetTrainingEnrollmentsByStudent
DROP PROCEDURE IF EXISTS GetTrainingEnrollmentsByStudent;
CREATE PROCEDURE GetTrainingEnrollmentsByStudent(
    IN p_StudentID INT
)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_EnrollmentID INT;
    DECLARE v_TrainingID INT;
    DECLARE v_TrainingName VARCHAR(100);
    DECLARE v_PerformanceGrade VARCHAR(10);
    DECLARE v_CompletionStatus VARCHAR(20);

    -- Cursor: fetch enrollments for the given student, along with training name
    DECLARE enroll_cursor CURSOR FOR
        SELECT 
            te.Enrollment_ID,
            te.Training_ID,
            tp.Training_Name,
            te.Performance_Grade,
            te.Completion_Status
        FROM Training_Enrollment te
        JOIN Training_Program tp ON te.Training_ID = tp.Training_ID
        WHERE te.Student_ID = p_StudentID;

    -- Handler to detect end of rows
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- Open the cursor
    OPEN enroll_cursor;

    read_loop: LOOP
        FETCH enroll_cursor INTO
            v_EnrollmentID,
            v_TrainingID,
            v_TrainingName,
            v_PerformanceGrade,
            v_CompletionStatus;

        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Output one row at a time
        SELECT 
            v_EnrollmentID AS Enrollment_ID,
            v_TrainingID AS Training_ID,
            v_TrainingName AS Training_Name,
            v_PerformanceGrade AS Performance_Grade,
            v_CompletionStatus AS Completion_Status;

    END LOOP;

    CLOSE enroll_cursor;
END;

-- Stored Procedure: Enroll Student in Training
DROP PROCEDURE IF EXISTS EnrollStudentInTraining;
CREATE PROCEDURE EnrollStudentInTraining(
    IN p_training_id INT,
    IN p_student_id INT
)
BEGIN
    -- Check if the training program exists
    IF NOT EXISTS (SELECT 1 FROM Training_Program WHERE Training_ID = p_training_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Training program not found';
    END IF;

    -- Check if the student is already enrolled in the training program
    IF EXISTS (SELECT 1 FROM Training_Enrollment WHERE Training_ID = p_training_id AND Student_ID = p_student_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Student is already enrolled in this training program';
    END IF;

    -- Insert a new row into Training_Enrollment
    INSERT INTO Training_Enrollment (Training_ID, Student_ID, Performance_Grade, Completion_Status)
    VALUES (p_training_id, p_student_id, NULL, 'Enrolled');
END;

-- Stored Procedure: Apply to Job
DROP PROCEDURE IF EXISTS ApplyToJob;
CREATE PROCEDURE ApplyToJob(
    IN p_student_id INT,
    IN p_job_id INT,
    IN p_application_date DATE,
    IN p_status VARCHAR(50)
)
BEGIN
    -- Check if the student has already applied for the job
    IF EXISTS (SELECT 1 FROM Application WHERE Student_ID = p_student_id AND Job_ID = p_job_id) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'You have already applied for this job';
    END IF;

    -- Insert the application into the Application table
    INSERT INTO Application (Student_ID, Job_ID, Application_Date, Status)
    VALUES (p_student_id, p_job_id, p_application_date, p_status);
END;

-- Stored Procedure: Retrieve Placement Records for listing
DROP PROCEDURE IF EXISTS GetPlacementRecordsRowByRow;
CREATE PROCEDURE GetPlacementRecordsRowByRow()
BEGIN
    -- Declare variables to hold each column value
    DECLARE done INT DEFAULT 0;
    DECLARE v_Placement_ID INT;
    DECLARE v_Student_Name VARCHAR(100);
    DECLARE v_Company_Name VARCHAR(100);
    DECLARE v_Job_Title VARCHAR(100);
    DECLARE v_Package DECIMAL(10,2);
    DECLARE v_Placement_Date DATE;
    DECLARE v_Company_ID INT;
    DECLARE v_Placement_Location VARCHAR(100);
    
    -- Declare cursor for selecting the records
    DECLARE placement_cursor CURSOR FOR
        SELECT 
            pr.Placement_ID,
            s.Name AS Student_Name,
            c.Name AS Company_Name,
            j.Job_Title,
            pr.Package,
            pr.Placement_Date,
            pr.Placement_Location
        FROM 
            Placement_Record pr
        JOIN 
            Student s ON pr.Student_ID = s.Student_ID
        JOIN 
            Company c ON pr.Company_ID = c.Company_ID
        JOIN 
            Job j ON pr.Job_ID = j.Job_ID;
    
    -- Handler for when no more rows
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
    
    -- Open the cursor
    OPEN placement_cursor;
    
    read_loop: LOOP
        -- Fetch data into variables
        FETCH placement_cursor INTO v_Placement_ID, v_Student_Name, v_Company_Name, v_Job_Title, v_Package, v_Placement_Date, v_Placement_Location;
        
        -- Exit loop when done
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- You can process row here — for now, we'll just SELECT it
        SELECT 
            v_Placement_ID AS Placement_ID,
            v_Student_Name AS Student_Name,
            v_Company_Name AS Company_Name,
            v_Job_Title AS Job_Title,
            v_Package AS Package,
            v_Placement_Date AS Placement_Date,
            v_Placement_Location AS Placement_Location;
        
    END LOOP;
    
    -- Close cursor
    CLOSE placement_cursor;
END;

-- Stored Procedure: Get Top 5 Industries by Placement Count
DROP PROCEDURE IF EXISTS GetTop5IndustriesByPlacement;
CREATE PROCEDURE GetTop5IndustriesByPlacement()
BEGIN
    SELECT 
        c.Industry_Type,
        COUNT(pr.Placement_ID) AS No_of_Placements
    FROM 
        Placement_Record pr
    JOIN 
        Company c ON pr.Company_ID = c.Company_ID
    GROUP BY 
        c.Industry_Type
    ORDER BY 
        No_of_Placements DESC
    LIMIT 5;
END;

-- Stored Procedure: Get Placement Report
DROP PROCEDURE IF EXISTS GetPlacementReport;
CREATE PROCEDURE GetPlacementReport()
BEGIN
    -- Declare variables
    DECLARE current_year INT DEFAULT YEAR(CURDATE());
    DECLARE current_dt DATE DEFAULT CURDATE();
    DECLARE prev_year INT DEFAULT YEAR(CURDATE()) - 1;
    DECLARE same_date_prev_year DATE DEFAULT DATE_SUB(CURDATE(), INTERVAL 1 YEAR);
    
    -- Current year totals
    DECLARE total_current INT DEFAULT 0;
    DECLARE total_prev INT DEFAULT 0;
    DECLARE percent_change_total DECIMAL(10,2);
    
    -- Average package
    DECLARE avg_package_current DECIMAL(10,2) DEFAULT 0;
    DECLARE avg_package_prev DECIMAL(10,2) DEFAULT 0;
    DECLARE percent_change_package DECIMAL(10,2);
    
    -- Placement rate
    DECLARE total_students INT DEFAULT 0;
    DECLARE placed_students_current INT DEFAULT 0;
    DECLARE placed_students_prev INT DEFAULT 0;
    DECLARE placement_rate_current DECIMAL(10,2) DEFAULT 0;
    DECLARE placement_rate_prev DECIMAL(10,2) DEFAULT 0;
    DECLARE percent_change_rate DECIMAL(10,2);
    
    -- Get total placements for current year till today
    SELECT COUNT(*) INTO total_current
    FROM Placement_Record
    WHERE YEAR(Placement_Date) = current_year AND Placement_Date <= current_dt;
    
    -- Get total placements for previous year till same date
    SELECT COUNT(*) INTO total_prev
    FROM Placement_Record
    WHERE YEAR(Placement_Date) = prev_year AND Placement_Date <= same_date_prev_year;
    
    -- Calculate percentage change in placements
    IF total_prev = 0 THEN
        SET percent_change_total = 100;
    ELSE
        SET percent_change_total = ((total_current - total_prev) / total_prev) * 100;
    END IF;
    
    -- Get average package for current year
    SELECT IFNULL(AVG(Package), 0) INTO avg_package_current
    FROM Placement_Record
    WHERE YEAR(Placement_Date) = current_year AND Placement_Date <= current_dt;
    
    -- Get average package for previous year
    SELECT IFNULL(AVG(Package), 0) INTO avg_package_prev
    FROM Placement_Record
    WHERE YEAR(Placement_Date) = prev_year AND Placement_Date <= same_date_prev_year;
    
    -- Calculate percentage change in package
    IF avg_package_prev = 0 THEN
        SET percent_change_package = 100;
    ELSE
        SET percent_change_package = ((avg_package_current - avg_package_prev) / avg_package_prev) * 100;
    END IF;
    
    -- Get total students
    SELECT COUNT(*) INTO total_students FROM Student;
    
    -- Get placed students current year till today
    SELECT COUNT(DISTINCT Student_ID) INTO placed_students_current
    FROM Placement_Record
    WHERE YEAR(Placement_Date) = current_year AND Placement_Date <= current_dt;
    
    -- Get placed students previous year till same date
    SELECT COUNT(DISTINCT Student_ID) INTO placed_students_prev
    FROM Placement_Record
    WHERE YEAR(Placement_Date) = prev_year AND Placement_Date <= same_date_prev_year;
    
    -- Calculate placement rate current
    IF total_students = 0 THEN
        SET placement_rate_current = 0;
    ELSE
        SET placement_rate_current = (placed_students_current / total_students) * 100;
    END IF;
    
    -- Calculate placement rate previous
    IF total_students = 0 THEN
        SET placement_rate_prev = 0;
    ELSE
        SET placement_rate_prev = (placed_students_prev / total_students) * 100;
    END IF;
    
    -- Calculate percentage change in placement rate
    IF placement_rate_prev = 0 THEN
        SET percent_change_rate = 100;
    ELSE
        SET percent_change_rate = ((placement_rate_current - placement_rate_prev) / placement_rate_prev) * 100;
    END IF;
    
    -- Final output
    SELECT 
        total_current AS Total_Placement_Current_Year,
        percent_change_total AS Percentage_Change_in_Total_Placement,
        avg_package_current AS Average_Package_Current_Year,
        percent_change_package AS Percentage_Change_in_Package,
        placement_rate_current AS Placement_Rate_Current_Year,
        percent_change_rate AS Percentage_Change_in_Placement_Rate;
END;

-- Stored Procedure: Get Total Placements This Year
DROP PROCEDURE IF EXISTS GetTotalPlacementsThisYear;
CREATE PROCEDURE GetTotalPlacementsThisYear()
BEGIN
    SELECT COUNT(*) AS Total_Placements
    FROM Placement_Record
    WHERE YEAR(Placement_Date) = YEAR(CURDATE());
END;

-- Stored Procedure: Get Number of Active Training Programs
DROP PROCEDURE IF EXISTS GetActiveTrainingPrograms;
CREATE PROCEDURE GetActiveTrainingPrograms()
BEGIN
    SELECT COUNT(*) AS Active_Programs
    FROM Training_Program
    WHERE CURDATE() BETWEEN Start_Date AND End_Date;
END;

-- Stored Procedure: Retrieve Total Number of Companies Registered
DROP PROCEDURE IF EXISTS GetTotalCompanies;
CREATE PROCEDURE GetTotalCompanies()
BEGIN
    SELECT COUNT(*) AS Total_Companies FROM Company;
END;

-- Stored Procedure: Retrieve Total Number of Students
DROP PROCEDURE IF EXISTS GetTotalStudents;
CREATE PROCEDURE GetTotalStudents()
BEGIN
    SELECT COUNT(*) AS Total_Students FROM Student;
END;

-- Stored Procedure: AddTrainingProgram
DROP PROCEDURE IF EXISTS AddTrainingProgram;
CREATE PROCEDURE AddTrainingProgram(
    IN p_TrainingName VARCHAR(100),
    IN p_TrainingDescription TEXT,
    IN p_Duration INT,
    IN p_TrainerID INT,
    IN p_StartDate DATE,
    IN p_EndDate DATE,
    IN p_Mode VARCHAR(50),
    IN p_CertificationProvided BOOLEAN,
    IN p_TrainingCost DECIMAL(10,2)
)
BEGIN
    -- Insert into Training_Program table
    INSERT INTO Training_Program (
        Training_Name, Training_Description,
        Duration, Trainer_ID, Start_Date, End_Date,
        Mode, Certification_Provided, Training_Cost
    )
    VALUES (
        p_TrainingName, p_TrainingDescription,
        p_Duration, p_TrainerID, p_StartDate, p_EndDate,
        p_Mode, p_CertificationProvided, p_TrainingCost
    );
END;

-- Stored Procedure: Get Job Applications by Student
DROP PROCEDURE IF EXISTS GetJobApplicationsByStudent;
CREATE PROCEDURE GetJobApplicationsByStudent(
    IN p_StudentID INT
)
BEGIN
    SELECT 
        a.Application_ID,
        a.Job_ID,
        j.Job_Title,
        a.Application_Date,
        a.Status
    FROM 
        Application a
    JOIN 
        Job j ON a.Job_ID = j.Job_ID
    WHERE 
        a.Student_ID = p_StudentID
    ORDER BY 
        a.Application_Date DESC;
END;