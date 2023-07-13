import { render, screen } from "@testing-library/react";
import { ESG } from ".";

test("renders ESG page", () => {
  render(<ESG />);
  expect(screen.getByText(/ESG/i)).toBeInTheDocument();
});
