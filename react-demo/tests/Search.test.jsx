import React from "react";
import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import Search from "../src/components/Search";

test("renders Search component", () => {
  render(<Search />);
  const labelElement = screen.getByText(/Search For:/i);
  expect(labelElement).toBeInTheDocument();
});
