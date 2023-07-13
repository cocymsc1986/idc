import { render, screen } from "@testing-library/react";
import { Credentials } from ".";

test("renders Credentials page", () => {
  render(<Credentials />);
  expect(screen.getByText(/Credentials/i)).toBeInTheDocument();
});
