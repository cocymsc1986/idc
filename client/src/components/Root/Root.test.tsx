import { render, screen } from "@testing-library/react";
import { Root } from ".";

test("renders Root page", () => {
  render(<Root />);
  expect(screen.getByText(/Homepage/i)).toBeInTheDocument();
});
