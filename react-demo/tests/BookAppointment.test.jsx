import React from "react";
import { render, screen } from "@testing-library/react";
import BookAppointment from "./BookAppointment";
import { DoctorsPatientsContext } from "../context/DoctorsPatientsContext";

// Provide a dummy context for testing.
const dummyContext = {
  doctors: [{ id: "doc1", name: "Dr. Smith", specialty: "Cardiology" }],
  patients: [{ id: "pat1", name: "John Doe" }],
  loading: false,
};

test("renders BookAppointment component", () => {
  render(
    <DoctorsPatientsContext.Provider value={dummyContext}>
      <BookAppointment />
    </DoctorsPatientsContext.Provider>
  );
  // Assuming the component renders "Book an Appointment" heading.
  const headingElement = screen.getByText(/Book an Appointment/i);
  expect(headingElement).toBeInTheDocument();
});
