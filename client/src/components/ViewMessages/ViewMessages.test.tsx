import { render, screen } from "@testing-library/react";
import { ViewMessages } from ".";

test("renders ViewMessages page", () => {
  render(<ViewMessages />);
  expect(screen.getByText(/View Messages/i)).toBeInTheDocument();
});
