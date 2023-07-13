import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { Connections } from ".";
import { api } from "../../api";

jest.mock("../../api", () => ({
  api: {
    getConnections: jest.fn(),
  },
}));

describe("Connections page", () => {
  it("should render data", async () => {
    (api.getConnections as jest.Mock).mockResolvedValue({
      results: [{ alias: "Mock Connection" }],
    });

    render(<Connections />, { wrapper: MemoryRouter });
    expect(await screen.findByText(/Mock Connection/i)).toBeInTheDocument();
  });

  it("should notify when api returns no results", async () => {
    (api.getConnections as jest.Mock).mockResolvedValue({ results: [] });

    render(<Connections />, { wrapper: MemoryRouter });
    expect(
      await screen.findByText(/no connections found/i)
    ).toBeInTheDocument();
  });

  it("should display any errors while fetching", async () => {
    (api.getConnections as jest.Mock).mockImplementation(() => {
      throw new Error("");
    });

    render(<Connections />, { wrapper: MemoryRouter });
    expect(
      await screen.findByText(/failed to fetch connections/i)
    ).toBeInTheDocument();
  });

  it("should display latest connection", async () => {
    (api.getConnections as jest.Mock).mockResolvedValue({
      results: [
        {
          alias: "test 1",
          updated_at: new Date("01-01-2023"),
        },
        {
          alias: "test 2",
          updated_at: new Date("03-01-2023"),
        },
        {
          alias: "test 3",
          updated_at: new Date("02-01-2023"),
        },
      ],
    });

    render(<Connections />, { wrapper: MemoryRouter });

    const dateTime = new Date("03-01-2023")
      .toLocaleString([], {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        minute: "2-digit",
        hour: "2-digit",
      })
      .replace(/\//g, "-")
      .replace(/, /g, " ");

    expect(await screen.findByText(dateTime)).toBeInTheDocument();
  });

  it("renders loading when fetching data", async () => {
    (api.getConnections as jest.Mock).mockImplementationOnce(() => ({
      test: "test",
    }));

    render(<Connections />, { wrapper: MemoryRouter });

    expect(await screen.findByTestId(/loader/i)).toBeInTheDocument();
  });
});
