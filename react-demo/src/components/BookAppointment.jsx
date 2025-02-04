import React, { useState, useContext, useEffect } from "react";
import ReactDOM from "react-dom";
import { DoctorsPatientsContext } from "../context/DoctorsPatientsContext";
import { fetchTimeSlots, bookAppointment } from "../services/api";
import "./BookAppointment.css";

// ConfirmationModal component renders its children into a portal.
function ConfirmationModal({ isOpen, children }) {
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">{children}</div>
    </div>,
    document.getElementById("modal-root")
  );
}

function BookAppointment() {
  const { doctors, patients, loading } = useContext(DoctorsPatientsContext);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch time slots when the selected doctor or date changes.
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const loadSlots = async () => {
        setLoadingSlots(true);
        try {
          const slots = await fetchTimeSlots(selectedDoctor, selectedDate);
          setTimeSlots(slots);
        } catch (error) {
          console.error("Error fetching time slots:", error);
          setTimeSlots([]);
        }
        setLoadingSlots(false);
      };
      loadSlots();
    } else {
      setTimeSlots([]);
    }
  }, [selectedDoctor, selectedDate]);

  const handleDoctorChange = (e) => {
    setSelectedDoctor(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Open the confirmation portal modal when a time slot is clicked.
  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const confirmBooking = async () => {
    if (!selectedPatient || !selectedDoctor || !selectedDate || !selectedSlot) {
        return;
    }
    setBookingLoading(true);
    try {
        const bookingResponse = await bookAppointment({
            doctorId: selectedDoctor,
            patientId: selectedPatient,
            startTime: selectedSlot.start_time,
        });
        console.log("Booking confirmed:", bookingResponse);
        
        // Immediately update the timeSlots array by marking the booked slot as occupied.
        setTimeSlots((prevSlots) =>
            prevSlots.map((slot) =>
                slot.start_time === selectedSlot.start_time ? { ...slot, occupied: true } : slot
            )
        );
        
        setIsModalOpen(false);
        setSelectedSlot(null);
    } catch (error) {
        console.error("Error booking appointment:", error);
    }
    setBookingLoading(false);
};


  return (
    <div className="book-appointment-container">
      <h2>Book an Appointment</h2>

      {loading && <div className="loader"></div>}

      {!loading && (
        <>
          {/* Patient Selection */}
          <div className="form-group">
            <label>Select Patient:</label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
            >
              <option value="">Select a patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>

          {/* Doctor Selection */}
          <div className="form-group">
            <label>Select Doctor:</label>
            <select value={selectedDoctor} onChange={handleDoctorChange}>
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
            <input type="date" value={selectedDate} onChange={handleDateChange} />
          </div>

          {/* Available Time Slots */}
          {selectedDoctor && selectedDate && (
            <div className="form-group">
              <h3>Available Time Slots</h3>
              {loadingSlots ? (
                <div className="loader"></div>
              ) : timeSlots.length > 0 ? (
                timeSlots.map((slot, index) => (
                  <button
                    key={index}
                    className={slot.occupied ? "occupied" : "available"}
                    disabled={slot.occupied}
                    onClick={() => handleSlotClick(slot)}
                  >
                    {slot.start_time.split("T")[1].slice(0, 5)} -{" "}
                    {slot.end_time.split("T")[1].slice(0, 5)}
                  </button>
                ))
              ) : (
                <p>
                    No available slots for this date.<br />
                    Appointments can only be booked up to 10 days in advance.
                </p>
              )}
            </div>
          )}
        </>
      )}

      {/* Portal-based Confirmation Modal */}
      <ConfirmationModal isOpen={isModalOpen}>
        <h3>Confirm Appointment Booking</h3>
        <p>
          Do you want to book an appointment on {selectedDate} at{" "}
          {selectedSlot && selectedSlot.start_time.split("T")[1].slice(0, 5)} -{" "}
          {selectedSlot && selectedSlot.end_time.split("T")[1].slice(0, 5)}?
        </p>
        <div className="modal-buttons">
          <button onClick={confirmBooking} disabled={bookingLoading}>
            {bookingLoading ? "Booking..." : "Confirm"}
          </button>
          <button
            onClick={() => {
              setIsModalOpen(false);
              setSelectedSlot(null);
            }}
            disabled={bookingLoading}
          >
            Cancel
          </button>
        </div>
      </ConfirmationModal>
    </div>
  );
}

export default BookAppointment;
