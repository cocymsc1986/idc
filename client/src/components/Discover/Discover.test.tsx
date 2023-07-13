import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Discover } from ".";

import { api } from "../../api";

jest.mock("../../api", () => ({
  api: {
    getDIDDirectory: jest.fn(),
    createDIDRequest: jest.fn(),
  },
}));

describe("Discover", () => {
  it("renders Discover page", () => {
    render(<Discover />);
    expect(screen.getByText(/Discover/i)).toBeInTheDocument();
  });

  it("displays DIDs on successful response", async () => {
    (api.getDIDDirectory as jest.Mock).mockReturnValue({
      listing: [{ name: "test" }],
    });

    render(<Discover />);

    userEvent.click(
      screen.getByRole("button", { name: "Get Potential Partners" })
    );

    expect(await screen.findByText(/test/i)).toBeInTheDocument();
  });

  it("displays error on failed response", async () => {
    (api.getDIDDirectory as jest.Mock).mockImplementation(() =>
      Promise.reject()
    );

    render(<Discover />);

    userEvent.click(
      screen.getByRole("button", { name: "Get Potential Partners" })
    );

    expect(
      await screen.findByText(/Failed to fetch potential partners/i)
    ).toBeInTheDocument();
  });

  it("displays confirmation on successful response", async () => {
    (api.getDIDDirectory as jest.Mock).mockReturnValue({
      listing: [{ name: "test", did: "123" }],
    });
    (api.createDIDRequest as jest.Mock).mockReturnValue({
      test: "test",
    });

    render(<Discover />);

    userEvent.click(
      screen.getByRole("button", { name: "Get Potential Partners" })
    );

    expect(await screen.findByText(/test/i)).toBeInTheDocument();

    userEvent.click(
      screen.getByRole("button", { name: "Request a Secure Connection" })
    );

    expect(
      await screen.findByText(/Request to test successful/i)
    ).toBeInTheDocument();
  });
});
