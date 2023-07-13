import { Routes, Route, MemoryRouter } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { ViewCredentials } from ".";
import { api } from "../../api";

jest.mock("../../api", () => ({
  api: {
    getProofRecords: jest.fn(),
  },
}));

const testResult = {
  presentation_request: {
    name: "test credentials",
    version: "1.0",
    requested_attributes: {
      test_key: {
        name: "test_attribute",
      },
    },
  },
  presentation_request_dict: {
    comment: "test",
  },
};

describe("ViewCredentials page", () => {
  it("renders page for presentation exchange id", async () => {
    (api.getProofRecords as jest.Mock).mockImplementationOnce(() => testResult);

    render(
      <MemoryRouter initialEntries={["/connections/testId/testId2"]}>
        <Routes>
          <Route
            path="/connections/:connectionId/:presentationId"
            element={<ViewCredentials />}
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/test credentials/i)).toBeInTheDocument();
    });
  });

  it("renders only requested attributes when there is no presentation", async () => {
    (api.getProofRecords as jest.Mock).mockImplementationOnce(() => testResult);

    render(
      <MemoryRouter initialEntries={["/connections/testId/testId2"]}>
        <Routes>
          <Route
            path="/connections/:connectionId/:presentationId"
            element={<ViewCredentials />}
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/test_attribute/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.queryByText(/Revealed Attributes/i)
      ).not.toBeInTheDocument();
    });
  });

  it("renders revealed attributes when there is a presentation", async () => {
    (api.getProofRecords as jest.Mock).mockImplementationOnce(() => ({
      ...testResult,
      presentation: {
        requested_proof: {
          revealed_attrs: {
            test_attr: {
              raw: "test_value",
            },
          },
        },
      },
    }));

    render(
      <MemoryRouter initialEntries={["/connections/testId/testId2"]}>
        <Routes>
          <Route
            path="/connections/:connectionId/:presentationId"
            element={<ViewCredentials />}
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/test_value/i)).toBeInTheDocument();
    });
  });

  it("renders loading when fetching data", async () => {
    (api.getProofRecords as jest.Mock).mockImplementationOnce(() => null);

    render(
      <MemoryRouter initialEntries={["/connections/testId/testId2"]}>
        <Routes>
          <Route
            path="/connections/:connectionId/:presentationId"
            element={<ViewCredentials />}
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId(/loader/i)).toBeInTheDocument();
    });
  });

  it("renders error when fails fetching data", async () => {
    (api.getProofRecords as jest.Mock).mockImplementationOnce(() =>
      Promise.reject()
    );

    render(
      <MemoryRouter initialEntries={["/connections/testId/testId2"]}>
        <Routes>
          <Route
            path="/connections/:connectionId/:presentationId"
            element={<ViewCredentials />}
          />
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
