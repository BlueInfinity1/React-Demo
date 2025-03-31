-- Create the Patients Table
CREATE TABLE patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT,
    gender CHAR(1),
    has_insurance BOOLEAN
);

-- Create the Doctors Table
CREATE TABLE doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(255),
    location VARCHAR(255)
);

-- Create the Visits Table
CREATE TABLE visits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT,
    doctor_id INT,
    visit_date DATE,
    reason TEXT,
    follow_up BOOLEAN,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

-- Create the Time Slots Table with a composite primary key (doctor_id + start_time)
CREATE TABLE time_slots (
    doctor_id INT,
    start_time DATETIME,
    end_time DATETIME,
    patient_id INT, -- Nullable: slot is unbooked if NULL
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (doctor_id, start_time),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- Create the Appointments Table with a composite primary key (doctor_id + start_time)
CREATE TABLE appointments (
    doctor_id INT,
    patient_id INT,
    start_time DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (doctor_id, start_time),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);
