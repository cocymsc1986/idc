import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { SignContent } from ".";

import { api } from "../../api";

jest.mock("../../api", () => ({
  api: {
    signContent: jest.fn(),
  },
}));

const Component = () => (
  <MemoryRouter initialEntries={["/connections/testId"]}>
    <Routes>
      <Route path="/connections/:connectionId" element={<SignContent />} />
    </Routes>
  </MemoryRouter>
);

describe("SignContent page", () => {
  it("renders SignContent page", () => {
    render(<Component />);

    expect(screen.getByText(/Sign Content/i)).toBeInTheDocument();
  });

  it("should show error when payload is invalid json", () => {
    render(<Component />);

    userEvent.type(
      screen.getByLabelText("Content to sign (Must be JSON)"),
      "Invalid JSON"
    );

    userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(
      screen.getByText(/Error processing JSON. Please check and try again/i)
    ).toBeInTheDocument();
  });

  it("should show error when api returns no result", async () => {
    (api.signContent as jest.Mock).mockImplementation(() => null);

    render(<Component />);

    await userEvent.type(
      screen.getByLabelText("Content to sign (Must be JSON)"),
      '{"test":"test"}'.replace(/[{[]/g, "$&$&")
    );

    userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(
      await screen.findByText(/Error getting signatures. Please try again/i)
    ).toBeInTheDocument();
  });

  it("should show signatures and copy buttons on successful response", async () => {
    (api.signContent as jest.Mock).mockImplementation(() => ({
      pairwise_did_signature: "test-pairwise",
      public_did_signature: "test-public",
    }));

    render(<Component />);

    await userEvent.type(
      screen.getByLabelText("Content to sign (Must be JSON)"),
      '{"test":"test"}'.replace(/[{[]/g, "$&$&")
    );

    userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(
      await screen.findByRole("button", { name: "Copy Signature 1" })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: "Copy Signature 2" })
    ).toBeInTheDocument();
  });
});
