import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { VerifyContent } from ".";

import { api } from "../../api";

jest.mock("../../api", () => ({
  api: {
    verifyContent: jest.fn(),
  },
}));

const completeForm = () => {
  userEvent.type(
    screen.getByLabelText("Content to sign (Must be JSON)"),
    '{"test":"test"}'.replace(/[{[]/g, "$&$&")
  );

  userEvent.type(screen.getByLabelText("Connection ID"), "test");
  userEvent.type(screen.getByLabelText("Signature"), "test");

  userEvent.click(screen.getByRole("button", { name: "Verify" }));
};

describe("VerifyContent page", () => {
  it("renders VerifyContent page", () => {
    render(<VerifyContent />);
    expect(screen.getByText(/Verify Content/i)).toBeInTheDocument();
  });

  it("should show error when payload is invalid json", () => {
    render(<VerifyContent />);

    userEvent.type(
      screen.getByLabelText("Content to sign (Must be JSON)"),
      "Invalid JSON"
    );

    userEvent.click(screen.getByRole("button", { name: "Verify" }));

    expect(
      screen.getByText(/Error processing JSON. Please check and try again/i)
    ).toBeInTheDocument();
  });

  it("should show error when api returns no result", async () => {
    (api.verifyContent as jest.Mock).mockImplementation(() => Promise.reject());

    render(<VerifyContent />);

    completeForm();

    expect(
      await screen.findByText(/Error verifying data. Please try again/i)
    ).toBeInTheDocument();
  });

  it("should show success result on successful response", async () => {
    (api.verifyContent as jest.Mock).mockImplementation(() => ({
      verified: true,
    }));

    render(<VerifyContent />);

    completeForm();

    expect(
      await screen.findByText(/Successfully verified/i)
    ).toBeInTheDocument();
  });

  it("should show failed result on successful response but failed verification", async () => {
    (api.verifyContent as jest.Mock).mockImplementation(() => ({
      verified: false,
    }));

    render(<VerifyContent />);

    completeForm();

    expect(
      await screen.findByText(/Could not verify data/i)
    ).toBeInTheDocument();
  });

  it("should error when no payload is provided", () => {
    render(<VerifyContent />);

    userEvent.type(screen.getByLabelText("Connection ID"), "test");
    userEvent.type(screen.getByLabelText("Signature"), "test");

    userEvent.click(screen.getByRole("button", { name: "Verify" }));

    expect(
      screen.getByText(/Error processing JSON. Please check and try again/i)
    ).toBeInTheDocument();
  });

  it("should error when no signature is provided", () => {
    render(<VerifyContent />);

    userEvent.type(
      screen.getByLabelText("Content to sign (Must be JSON)"),
      '{"test":"test"}'.replace(/[{[]/g, "$&$&")
    );
    userEvent.type(screen.getByLabelText("Signature"), "test");

    userEvent.click(screen.getByRole("button", { name: "Verify" }));

    expect(screen.getByText(/Missing required values/i)).toBeInTheDocument();
  });

  it("should error when type is connection did and no connection id is provided", () => {
    render(<VerifyContent />);

    userEvent.type(
      screen.getByLabelText("Content to sign (Must be JSON)"),
      '{"test":"test"}'.replace(/[{[]/g, "$&$&")
    );
    userEvent.type(screen.getByLabelText("Connection ID"), "test");

    userEvent.click(screen.getByRole("button", { name: "Verify" }));

    expect(screen.getByText(/Missing required values/i)).toBeInTheDocument();
  });

  it("should error when type is public did and no public did is provided", () => {
    render(<VerifyContent />);

    userEvent.type(
      screen.getByLabelText("Content to sign (Must be JSON)"),
      '{"test":"test"}'.replace(/[{[]/g, "$&$&")
    );

    userEvent.selectOptions(
      screen.getByLabelText("Verification Type"),
      "public-did"
    );

    userEvent.click(screen.getByRole("button", { name: "Verify" }));

    expect(screen.getByText(/Missing required values/i)).toBeInTheDocument();
  });

  it("should display Public DID field when Public DID is selected as type", () => {
    render(<VerifyContent />);

    userEvent.selectOptions(
      screen.getByLabelText("Verification Type"),
      "public-did"
    );

    expect(screen.getByLabelText("Public DID")).toBeInTheDocument();
    expect(screen.queryByLabelText("Connection ID")).not.toBeInTheDocument();
  });
});
