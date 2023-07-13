import { Routes, Route, MemoryRouter } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { Connection } from ".";
import { api } from "../../api";

jest.mock("../../api", () => ({
  api: {
    getConnection: jest.fn(),
    getConnectionProofs: jest.fn(),
  },
}));

describe("Connection page", () => {
  it("renders page for connection id", async () => {
    (api.getConnection as jest.Mock).mockImplementationOnce(() => ({
      test: "test",
    }));

    render(
      <MemoryRouter initialEntries={["/connections/testId"]}>
        <Routes>
          <Route path="/connections/:connectionId" element={<Connection />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/testId/i)).toBeInTheDocument();
    });
  });

  it("renders loading when fetching data", async () => {
    (api.getConnection as jest.Mock).mockImplementationOnce(() => ({
      test: "test",
    }));

    render(
      <MemoryRouter initialEntries={["/connections/testId"]}>
        <Routes>
          <Route path="/connections/:connectionId" element={<Connection />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId(/loader/i)).toBeInTheDocument();
    });
  });

  it("renders error when fails fetching data", async () => {
    (api.getConnection as jest.Mock).mockImplementationOnce(() =>
      Promise.reject()
    );

    render(
      <MemoryRouter initialEntries={["/connections/testId"]}>
        <Routes>
          <Route path="/connections/:connectionId" element={<Connection />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Failed to fetch connection:/i)
      ).toBeInTheDocument();
    });
  });

  it("renders error when fails fetching proofs", async () => {
    (api.getConnection as jest.Mock).mockImplementationOnce(() => ({
      test: "test",
    }));
    (api.getConnectionProofs as jest.Mock).mockImplementationOnce(() =>
      Promise.reject()
    );

    render(
      <MemoryRouter initialEntries={["/connections/testId"]}>
        <Routes>
          <Route path="/connections/:connectionId" element={<Connection />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Failed to fetch connection's proof records:/i)
      ).toBeInTheDocument();
    });
  });
});
