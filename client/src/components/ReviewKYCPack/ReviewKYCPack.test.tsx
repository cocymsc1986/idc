import { render, screen } from "@testing-library/react";
import { ReviewKYCPack } from ".";

test("renders ReviewKYCPack page", () => {
  render(<ReviewKYCPack />);
  expect(screen.getByText(/Review KYC Pack/i)).toBeInTheDocument();
});
