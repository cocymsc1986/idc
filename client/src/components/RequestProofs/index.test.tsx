import { Routes, Route, MemoryRouter } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RequestProofs } from ".";
import { api } from "../../api";

jest.mock("../../api", () => ({
  api: {
    getSchemas: jest.fn(),
    getSchemaFromId: jest.fn(),
    sendProofRequest: jest.fn(),
    getProofRecords: jest.fn(),
  },
}));

jest.mock("./consts", () => ({
  PROOFS_TIMEOUT: 0,
}));

const submitBuiltTemplate = () => {
  const submitButton = screen.getByRole("button", {
    name: /Request Proofs/i,
  });

  userEvent.type(screen.getByLabelText("Template Name"), "template_name");

  userEvent.type(
    screen.getByLabelText("Add a Custom Attribute"),
    "test_attribute"
  );

  const addButton = screen.getByRole("button", {
    name: /Add custom attribute/i,
  });
  userEvent.click(addButton);

  userEvent.click(submitButton);
};

describe("Request Proofs page", () => {
  it("renders page for connection id", async () => {
    (api.getSchemas as jest.Mock).mockImplementationOnce(() => ({
      test: "test",
    }));

    render(
      <MemoryRouter initialEntries={["/connections/testId/request-proofs"]}>
        <Routes>
          <Route
            path="/connections/:connectionId/request-proofs"
            element={<RequestProofs />}
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Request Proofs/i, { selector: "h1" })
      ).toBeInTheDocument();
    });
  });

  it("populates dropdown with attributes when selecting schema", async () => {
    (api.getSchemas as jest.Mock).mockReturnValue({
      schema_ids: ["schema_id"],
    });
    (api.getSchemaFromId as jest.Mock).mockReturnValue({
      schema: {
        attrNames: ["company_number"],
      },
    });

    render(
      <MemoryRouter initialEntries={["/connections/testId/request-proofs"]}>
        <Routes>
          <Route
            path="/connections/:connectionId/request-proofs"
            element={<RequestProofs />}
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("schema_id")).toBeInTheDocument();
    });

    userEvent.selectOptions(
      await screen.findByLabelText("Select a Schema"),
      "schema_id"
    );

    await waitFor(() => {
      expect(screen.getByText("company_number")).toBeInTheDocument();
    });
  });

  it("renders loading when fetching data", async () => {
    (api.getSchemas as jest.Mock).mockReturnValue({
      schema_ids: ["schema_id"],
    });
    (api.getSchemaFromId as jest.Mock).mockReturnValue({
      schema: {
        attrNames: ["company_number"],
      },
    });

    render(
      <MemoryRouter initialEntries={["/connections/testId/request-proofs"]}>
        <Routes>
          <Route
            path="/connections/:connectionId/request-proofs"
            element={<RequestProofs />}
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId(/loader/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("schema_id")).toBeInTheDocument();
    });

    userEvent.selectOptions(
      await screen.findByLabelText("Select a Schema"),
      "schema_id"
    );

    await waitFor(() => {
      expect(screen.getByTestId(/loader/i)).toBeInTheDocument();
    });
  });

  it("renders error when fails fetching schemas", async () => {
    (api.getSchemas as jest.Mock).mockImplementationOnce(() =>
      Promise.reject()
    );

    render(
      <MemoryRouter initialEntries={["/connections/testId/request-proofs"]}>
        <Routes>
          <Route
            path="/connections/:connectionId/request-proofs"
            element={<RequestProofs />}
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error fetching schemas./i)).toBeInTheDocument();
    });
  });

  it("renders error when fails fetching schema attributes", async () => {
    (api.getSchemas as jest.Mock).mockReturnValue({
      schema_ids: ["schema_id"],
    });
    (api.getSchemaFromId as jest.Mock).mockImplementationOnce(() =>
      Promise.reject()
    );

    render(
      <MemoryRouter initialEntries={["/connections/testId/request-proofs"]}>
        <Routes>
          <Route
            path="/connections/:connectionId/request-proofs"
            element={<RequestProofs />}
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("schema_id")).toBeInTheDocument();
    });

    userEvent.selectOptions(
      await screen.findByLabelText("Select a Schema"),
      "schema_id"
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Error fetching schema attributes./i)
      ).toBeInTheDocument();
    });
  });

  it("adds selected attributes to template", async () => {
    (api.getSchemas as jest.Mock).mockReturnValue({
      schema_ids: ["schema_id"],
    });
    (api.getSchemaFromId as jest.Mock).mockReturnValue({
      schema: {
        attrNames: ["company_number"],
      },
    });

    render(
      <MemoryRouter initialEntries={["/connections/testId/request-proofs"]}>
        <Routes>
          <Route
            path="/connections/:connectionId/request-proofs"
            element={<RequestProofs />}
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("schema_id")).toBeInTheDocument();
    });

    userEvent.selectOptions(
      await screen.findByLabelText("Select a Schema"),
      "schema_id"
    );

    await waitFor(() => {
      expect(screen.getByText("company_number")).toBeInTheDocument();
    });

    userEvent.selectOptions(
      await screen.findByLabelText("Select an Attribute"),
      "company_number"
    );

    const addButton = screen.getByRole("button", {
      name: /Add attribute/i,
    });
    userEvent.click(addButton);

    expect(
      screen.getByText("company_number", { selector: "span" })
    ).toBeInTheDocument();
  });

  it("should display error on missing fields", async () => {
    render(
      <MemoryRouter initialEntries={["/connections/testId/request-proofs"]}>
        <Routes>
          <Route
            path="/connections/:connectionId/request-proofs"
            element={<RequestProofs />}
          />
        </Routes>
      </MemoryRouter>
    );

    const submitButton = screen.getByRole("button", {
      name: /Request Proofs/i,
    });
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Missing required fields./i)).toBeInTheDocument();
    });

    userEvent.type(screen.getByLabelText("Template Name"), "template_name");

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Missing required fields./i)).toBeInTheDocument();
    });

    userEvent.type(
      screen.getByLabelText("Add a Custom Attribute"),
      "test_attribute"
    );

    const addButton = screen.getByRole("button", {
      name: /Add custom attribute/i,
    });
    userEvent.click(addButton);

    userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.queryByText(/Missing required fields./i)
      ).not.toBeInTheDocument();
    });
  });

  it("should display error on failed request", async () => {
    (api.getSchemas as jest.Mock).mockReturnValue({
      schema_ids: ["schema_id"],
    });
    (api.sendProofRequest as jest.Mock).mockImplementationOnce(() =>
      Promise.reject()
    );

    render(
      <MemoryRouter initialEntries={["/connections/testId/request-proofs"]}>
        <Routes>
          <Route
            path="/connections/:connectionId/request-proofs"
            element={<RequestProofs />}
          />
        </Routes>
      </MemoryRouter>
    );

    submitBuiltTemplate();

    await waitFor(() => {
      expect(
        screen.getByText(/Error sending proof request./i)
      ).toBeInTheDocument();
    });
  });

  it("should display error on failed records response", async () => {
    (api.getSchemas as jest.Mock).mockReturnValue({
      schema_ids: ["schema_id"],
    });
    (api.sendProofRequest as jest.Mock).mockReturnValue({
      presentation_exchange_id: "test_id",
    });
    (api.getProofRecords as jest.Mock).mockImplementationOnce(() =>
      Promise.reject()
    );

    render(
      <MemoryRouter initialEntries={["/connections/testId/request-proofs"]}>
        <Routes>
          <Route
            path="/connections/:connectionId/request-proofs"
            element={<RequestProofs />}
          />
        </Routes>
      </MemoryRouter>
    );

    submitBuiltTemplate();

    await waitFor(() => {
      expect(
        screen.getByText(/Error getting proof records./i)
      ).toBeInTheDocument();
    });
  });

  it("should display error on no presentation in response", async () => {
    (api.getSchemas as jest.Mock).mockReturnValue({
      schema_ids: ["schema_id"],
    });
    (api.sendProofRequest as jest.Mock).mockReturnValue({
      presentation_exchange_id: "test_id",
    });
    (api.getProofRecords as jest.Mock).mockReturnValue({});

    render(
      <MemoryRouter initialEntries={["/connections/testId/request-proofs"]}>
        <Routes>
          <Route
            path="/connections/:connectionId/request-proofs"
            element={<RequestProofs />}
          />
        </Routes>
      </MemoryRouter>
    );

    submitBuiltTemplate();

    await waitFor(() => {
      expect(
        screen.getByText(/Error finding presentation records./i)
      ).toBeInTheDocument();
    });
  });

  it("should display error on duplicated field", async () => {
    render(
      <MemoryRouter initialEntries={["/connections/testId/request-proofs"]}>
        <Routes>
          <Route
            path="/connections/:connectionId/request-proofs"
            element={<RequestProofs />}
          />
        </Routes>
      </MemoryRouter>
    );

    userEvent.type(
      screen.getByLabelText("Add a Custom Attribute"),
      "test_attribute"
    );

    const addButton = screen.getByRole("button", {
      name: /Add custom attribute/i,
    });
    userEvent.click(addButton);

    userEvent.click(addButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Attribute name already exists on the template./i)
      ).toBeInTheDocument();
    });
  });

  it("should display error on adding empty attributes", async () => {
    (api.getSchemas as jest.Mock).mockReturnValue({
      schema_ids: ["schema_id"],
    });
    (api.getSchemaFromId as jest.Mock).mockReturnValue({
      schema: {
        attrNames: ["company_number"],
      },
    });

    render(
      <MemoryRouter initialEntries={["/connections/testId/request-proofs"]}>
        <Routes>
          <Route
            path="/connections/:connectionId/request-proofs"
            element={<RequestProofs />}
          />
        </Routes>
      </MemoryRouter>
    );

    const addButton = screen.getByRole("button", {
      name: /Add attribute/i,
    });
    userEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText(/No attribute provided./i)).toBeInTheDocument();
    });

    const addCustomAttrButton = screen.getByRole("button", {
      name: /Add custom attribute/i,
    });
    userEvent.click(addCustomAttrButton);

    await waitFor(() => {
      expect(screen.getByText(/No attribute provided./i)).toBeInTheDocument();
    });
  });

  it("should display results on successful responses", async () => {
    (api.getSchemas as jest.Mock).mockReturnValue({
      schema_ids: ["schema_id"],
    });
    (api.sendProofRequest as jest.Mock).mockReturnValue({
      presentation_exchange_id: "test_id",
    });
    (api.getProofRecords as jest.Mock).mockReturnValue({
      presentation: {
        requested_proof: {
          revealed_attrs: {
            "0_company_number_uuid": {
              raw: "test_value",
            },
          },
        },
      },
    });

    render(
      <MemoryRouter initialEntries={["/connections/testId/request-proofs"]}>
        <Routes>
          <Route
            path="/connections/:connectionId/request-proofs"
            element={<RequestProofs />}
          />
        </Routes>
      </MemoryRouter>
    );

    submitBuiltTemplate();

    await waitFor(() => {
      expect(screen.getByText(/test_value/i)).toBeInTheDocument();
    });
  });
});
