import { render, screen } from "@testing-library/react";
import { useRouteError } from "react-router-dom";
import { Error } from ".";

jest.mock("react-router-dom");

test("renders Error page", () => {
  (useRouteError as jest.Mock).mockReturnValue({
    status: 404,
    statusText: "not found!",
  });

  render(<Error />);

  expect(screen.getByText(/not found!/i)).toBeInTheDocument();
});
