import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AcceptInvitation } from ".";
import { api } from "../../api";

jest.mock("../../api", () => ({
  api: {
    receiveInvitation: jest.fn(),
  },
}));

const fillForm = () => {
  userEvent.type(screen.getByLabelText("Alias"), "test");
  userEvent.type(screen.getByLabelText("ID"), "test");
  userEvent.type(screen.getByLabelText("Service Endpoint"), "test");
  userEvent.type(screen.getByLabelText("Recipient Key"), "test");
  userEvent.type(screen.getByLabelText("Label"), "test");
};

describe("AcceptInvitation page", () => {
  it("renders AcceptInvitation page", () => {
    render(<AcceptInvitation />);

    expect(screen.getByText(/Accept Invitation/i)).toBeInTheDocument();
  });

  it("should show error when all fields aren't filled out", () => {
    render(<AcceptInvitation />);

    userEvent.type(screen.getByLabelText("Alias"), "test");
    userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.getByText(/Missing required values/i)).toBeInTheDocument();
  });

  it("should show error when receive-invitation call is rejected", async () => {
    (api.receiveInvitation as jest.Mock).mockImplementation(() =>
      Promise.reject()
    );

    render(<AcceptInvitation />);

    fillForm();

    userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(
      await screen.findByText(/Error accepting invitation. Please try again/i)
    ).toBeInTheDocument();
  });

  it("should tell user that accepting was successful", async () => {
    (api.receiveInvitation as jest.Mock).mockImplementation(() => ({
      test: "test",
    }));

    render(<AcceptInvitation />);

    fillForm();

    userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(api.receiveInvitation as jest.Mock).toHaveBeenCalled();

    expect(
      await screen.findByText(/Invitation accepted!/i)
    ).toBeInTheDocument();
  });
});
