import { render, screen } from "@testing-library/react";
import { ReviewESGProof } from ".";

test("renders ReviewESGProof page", () => {
  render(<ReviewESGProof />);
  expect(screen.getByText(/Review ESG Proof/i)).toBeInTheDocument();
});
