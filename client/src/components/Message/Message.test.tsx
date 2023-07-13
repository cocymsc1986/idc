import { render, screen } from "@testing-library/react";
import { Message } from ".";

test("renders Message page", () => {
  render(<Message />);
  expect(screen.getByText(/Message/i)).toBeInTheDocument();
});
