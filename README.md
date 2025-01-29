## React-Demo

A React-based search application that integrates with AWS API Gateway and Lambda functions to query an RDS MySQL database. Users can search for patients, doctors, and visits with various filters.

## Features

- **Search for Patients** by insurance status.
- **Search for Doctors** by specialty.
- **Search for Visits** by date range, doctor specialty, and follow-up status.
- **Live API Integration** using AWS API Gateway and Lambda.
- **Modern UI** with CSS styling.


## Database Schema

### Patients Table
- `id` (INT, Primary Key) – Unique identifier for each patient.
- `name` (VARCHAR(255)) – Patient's full name.
- `age` (INT) – Patient's age.
- `gender` (CHAR(1)) – 'M', 'F' or 'O'.
- `has_insurance` (BOOLEAN) – Indicates if the patient has insurance.

### Doctors Table
- `id` (INT, Primary Key) – Unique identifier for each doctor.
- `name` (VARCHAR(255)) – Doctor's full name.
- `specialty` (VARCHAR(255)) – Medical specialty.
- `location` (VARCHAR(255)) – Doctor's work location.

### Visits Table
- `id` (INT, Primary Key) – Unique identifier for each visit.
- `patient_id` (INT, Foreign Key) – References `patients(id)`.
- `doctor_id` (INT, Foreign Key) – References `doctors(id)`.
- `visit_date` (DATE) – Date of the visit.
- `reason` (TEXT) – Reason for the visit.
- `follow_up` (BOOLEAN) – Indicates if a follow-up is required.
