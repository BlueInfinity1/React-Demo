import React from "react";
import { render, screen } from "@testing-library/react";
import Search from "./Search";

// Basic test: check if the Search component renders the heading or a known element.
test("renders Search component", () => {
  render(<Search />);
  // Assuming the component renders a "Search For:" label
  const labelElement = screen.getByText(/Search For:/i);
  expect(labelElement).toBeInTheDocument();
});
