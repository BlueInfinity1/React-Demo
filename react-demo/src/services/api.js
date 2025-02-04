import axios from "axios";
const BASE_URL = "https://pppqz9gut3.execute-api.us-east-1.amazonaws.com/dev";

// Fetch all doctors and patients
export const fetchDoctorsAndPatients = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/get-doctors-patients`);
        return response.data;
    } catch (error) {
        console.error("Error fetching doctors and patients:", error);
        return { doctors: [], patients: [] };
    }
};

// Fetch available time slots for a doctor on a specific date
export const fetchTimeSlots = async (doctorId, date) => {
    try {
        const response = await axios.get(`${BASE_URL}/get-appointments`, {
            params: { doctor_id: doctorId, date }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching time slots:", error);
        return [];
    }
};

// Fetch search results (for patients, doctors, and visits)
export const fetchSearchResults = async (entityType, criteria) => {
    const params = {
        table: entityType, // Lambda expects "table"
        
        // Patients Search Filters
        ...(entityType === "patients" && criteria.hasInsurance !== undefined && { has_insurance: criteria.hasInsurance }),
        
        // Doctors Search Filters
        ...(entityType === "doctors" && criteria.specialty && { specialty: criteria.specialty }),
        ...(entityType === "doctors" && criteria.name && { name: criteria.name }),
        ...(entityType === "doctors" && criteria.location && { location: criteria.location }),
        
        // Visits Search Filters
        ...(entityType === "visits" && criteria.startDate && { start_date: criteria.startDate }),
        ...(entityType === "visits" && criteria.endDate && { end_date: criteria.endDate }),
        ...(entityType === "visits" && criteria.specialty && { specialty: criteria.specialty }),
        ...(entityType === "visits" && criteria.followUp !== undefined && { follow_up: criteria.followUp }),
    };

    try {
        console.log("Sending Query Params:", params);
        const response = await axios.get(`${BASE_URL}/search`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching search results:", error);
        return [];
    }
};

// Book an appointment by sending booking details to the server.
// This function now extracts doctorId, patientId, and startTime from appointmentDetails
// and sends them as doctor_id, patient_id, and start_time respectively.
export const bookAppointment = async ({ doctorId, patientId, startTime }) => {
    const payload = {
        doctor_id: doctorId,
        patient_id: patientId,
        start_time: startTime,
    };

    try {
        const response = await axios.post(`${BASE_URL}/book-appointment`, payload);
        return response.data;
    } catch (error) {
        console.error("Error booking appointment:", error);
        throw error;
    }
};

