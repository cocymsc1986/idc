import { render, screen, fireEvent } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { MemoryRouter, Router } from "react-router-dom";
import { Sidebar } from ".";

describe("Sidebar", () => {
  it("renders icon", () => {
    render(<Sidebar />, { wrapper: MemoryRouter });
    expect(screen.getByAltText(/ID Crypt Global/i)).toBeInTheDocument();
  });

  it("navigates to page", async () => {
    const history = createMemoryHistory();
    render(
      <Router location={history.location} navigator={history}>
        <Sidebar />
      </Router>
    );

    fireEvent.click(screen.getByText("Connections"));

    expect(history.location.pathname).toBe("/connections");
  });
});
