import { render, screen } from "@testing-library/react";
import { Messaging } from ".";

test("renders Messaging page", () => {
  render(<Messaging />);
  expect(screen.getByText(/Messaging/i)).toBeInTheDocument();
});
