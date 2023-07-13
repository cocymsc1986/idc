import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Layout } from ".";

test("renders children", () => {
  render(<Layout>hello</Layout>, { wrapper: MemoryRouter });
  expect(screen.getByText(/hello/i)).toBeInTheDocument();
});
