import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateInvitation } from ".";
import { api } from "../../api";

jest.mock("../../api", () => ({
  api: {
    createInvitation: jest.fn(),
  },
}));

describe("CreateInvitation page", () => {
  it("renders CreateInvitation page", () => {
    render(<CreateInvitation />);

    expect(screen.getByText(/Create Invitation/i)).toBeInTheDocument();
  });

  it("should show error when there is no alias", () => {
    render(<CreateInvitation />);

    userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.getByText(/Missing required values/i)).toBeInTheDocument();
  });

  it("should show error when api returns no result", async () => {
    (api.createInvitation as jest.Mock).mockImplementation(() => null);

    render(<CreateInvitation />);

    userEvent.type(screen.getByLabelText("Alias"), "test");

    userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(
      await screen.findByText(/Error creating invitation. Please try again/i)
    ).toBeInTheDocument();
  });

  it("show payload and copy button on successful response", async () => {
    (api.createInvitation as jest.Mock).mockResolvedValue("test");

    render(<CreateInvitation />);

    userEvent.type(screen.getByLabelText("Alias"), "test");

    userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(api.createInvitation).toBeCalledWith({ alias: "test" });

    expect(
      await screen.findByText(/test/i, { selector: "code" })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: "Copy Payload" })
    ).toBeInTheDocument();
  });
});
