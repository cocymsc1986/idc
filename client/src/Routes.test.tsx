import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Routes } from "./Routes";
import { api } from "./api";

jest.mock("./api");

test("full app rendering/navigating", async () => {
  render(<Routes />);

  expect(screen.getByText(/Homepage/i)).toBeInTheDocument();

  (api.getConnections as jest.Mock).mockResolvedValue({
    results: [{ their_label: "Mock Connection" }],
  });

  userEvent.click(screen.getByText(/Connections/i));

  expect(
    await screen.findByText(/Connections/i, { selector: "h1" })
  ).toBeInTheDocument();
});
