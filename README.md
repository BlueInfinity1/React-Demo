# React-Demo

A React-based search application that integrates with AWS API Gateway and Lambda functions to query an RDS MySQL database. Users can search for patients, doctors, and visits with various filters — and now, book appointments by selecting available time slots.

## Video

Watch a demo clip of the application in action:  
[React-Demo Video](https://drive.google.com/file/d/1-f66gDuHhonEIZo30lWSURFzfoib9ug9/view?usp=sharing)

## Features

- **Search for Patients** by insurance status.
- **Search for Doctors** by specialty.
- **Search for Visits** by date range, doctor specialty, and follow-up status.
- **Live API Integration** using AWS API Gateway and Lambda.
- **Modern UI** with CSS styling.
- **Book Appointments:**  
  Select a doctor, patient, choose a date, and view available time slots in real time. Upon confirmation, the appointment is booked and the UI immediately reflects the change.

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

### Time Slots Table
- **Primary Key:** Composite key (`doctor_id` + `start_time`).
- `doctor_id` (INT, Foreign Key) – References `doctors(id)`.
- `start_time` (DATETIME) – The start time of the slot.
- `end_time` (DATETIME) – The end time of the slot.
- `patient_id` (INT, Foreign Key, Nullable) – References `patients(id)` if the slot is booked.
- `created_at` (DATETIME) – Timestamp when the slot was created.

### Appointments Table
- **Primary Key:** Composite key (`doctor_id` + `start_time`).
- `doctor_id` (INT, Foreign Key) – References `doctors(id)`.
- `patient_id` (INT, Foreign Key) – References `patients(id)`.
- `start_time` (DATETIME) – The appointment start time.
- `created_at` (DATETIME) – Timestamp when the appointment was booked.
