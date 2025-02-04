import React, { useState, useContext } from "react";
import { DoctorsPatientsContext } from "../context/DoctorsPatientsContext";
import { fetchTimeSlots } from "../services/api";
import "./BookAppointment.css"; // Add a CSS file for styles

function BookAppointment() {
    const { doctors, patients, loading } = useContext(DoctorsPatientsContext);
    const [selectedPatient, setSelectedPatient] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [timeSlots, setTimeSlots] = useState([]);
    const [loadingSlots, setLoadingSlots] = useState(false); // New state for loading time slots

    // Fetch available time slots when a date is selected
    const handleDateChange = async (date) => {
        setSelectedDate(date);
        if (selectedDoctor) {
            setLoadingSlots(true); // Show loading state
            const slots = await fetchTimeSlots(selectedDoctor, date);
            setTimeSlots(slots);
            setLoadingSlots(false);
        }
    };

    return (
        <div className="book-appointment-container">
            <h2>Book an Appointment</h2>

            {/* Show Loading Indicator */}
            {loading && <div className="loader"></div>}

            {/* Hide form while loading */}
            {!loading && (
                <>
                    {/* Patient Selection */}
                    <div className="form-group">
                        <label>Select Patient:</label>
                        <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)}>
                            <option value="">Select a patient</option>
                            {patients.map((patient) => (
                                <option key={patient.id} value={patient.id}>{patient.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Doctor Selection */}
                    <div className="form-group">
                        <label>Select Doctor:</label>
                        <select value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
                            <option value="">Select a doctor</option>
                            {doctors.map((doctor) => (
                                <option key={doctor.id} value={doctor.id}>
                                    {doctor.name} ({doctor.specialty})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date Selection */}
                    <div className="form-group">
                        <label>Select Date:</label>
                        <input type="date" value={selectedDate} onChange={(e) => handleDateChange(e.target.value)} />
                    </div>

                    {/* Available Time Slots */}
                    {selectedDoctor && selectedDate && (
                        <div className="form-group">
                            <h3>Available Time Slots</h3>

                            {loadingSlots ? (
                                <div className="loader"></div> // Show loading while fetching slots
                            ) : timeSlots.length > 0 ? (
                                timeSlots.map((slot, index) => (
                                    <button
                                        key={index}
                                        className={slot.occupied ? "occupied" : "available"}
                                        disabled={slot.occupied}
                                    >
                                        {slot.start_time.split("T")[1].slice(0, 5)} - {slot.end_time.split("T")[1].slice(0, 5)}
                                    </button>
                                ))
                            ) : (
                                <p>No available slots for this date.</p>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default BookAppointment;
