import React from "react";
import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import BookAppointment from "../src/components/BookAppointment";
import { DoctorsPatientsContext } from "../src/context/DoctorsPatientsContext";

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
  const headingElement = screen.getByText(/Book an Appointment/i);
  expect(headingElement).toBeInTheDocument();
});
