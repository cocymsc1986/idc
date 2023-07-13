import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { SearchTable } from ".";
import { Connection } from "../../../types";
import { TableItem } from "..";

const mockData = [
  {
    alias: "business_1",
    connection_id: "business_1_id",
  },
  {
    alias: "business_2",
    connection_id: "business_2_id",
  },
];

const paginationData = Array.from({ length: 10 }, (_, i) => {
  return {
    alias: `business_${i + 1}`,
    connection_id: `business_${i + 1}_id`,
  };
});

const Component = ({ data }) => (
  <SearchTable
    title=""
    data={data}
    results={(data) => (
      <TableItem
        key={`${data.connection_id}${data.created_at}${data.updated_at}`}
        data={data}
        displayDate={false}
      />
    )}
    tableProps={{
      titles: ["Title", "Status", "Last Updated", ""],
      widths: [40, 20, 32, 8],
    }}
    labelPath={["alias"]}
  />
);

describe("Search Connections", () => {
  it("should display all connections", () => {
    render(<Component data={mockData as Connection[]} />, {
      wrapper: MemoryRouter,
    });

    expect(screen.getByText(/business_1/i)).toBeInTheDocument();
    expect(screen.getByText(/business_2/i)).toBeInTheDocument();
  });

  it("should filter based on input", () => {
    render(<Component data={mockData as Connection[]} />, {
      wrapper: MemoryRouter,
    });

    expect(screen.getByText(/business_1/i)).toBeInTheDocument();

    userEvent.type(
      screen.getByPlaceholderText("Enter keyword here"),
      "business_2"
    );

    expect(
      screen.getByText(/business_2/i, { selector: "td" })
    ).toBeInTheDocument();
    expect(screen.queryByText(/business_1/i)).not.toBeInTheDocument();
  });

  it("should display no results when there's no match", () => {
    render(<Component data={mockData as Connection[]} />, {
      wrapper: MemoryRouter,
    });

    userEvent.type(
      screen.getByPlaceholderText("Enter keyword here"),
      "non-existent connection"
    );

    expect(screen.queryByText(/business/i)).not.toBeInTheDocument();
    expect(screen.getByText(/no results/i)).toBeInTheDocument();
  });

  it("should notify when there's no data", () => {
    render(<Component data={[]} />, { wrapper: MemoryRouter });

    expect(screen.getByText(/no data to be shown/i)).toBeInTheDocument();
  });

  it("should paginate when there's lots of data", () => {
    render(<Component data={paginationData as Connection[]} />, {
      wrapper: MemoryRouter,
    });

    expect(screen.getByText("business_1")).toBeInTheDocument();
    expect(screen.queryByText("business_6")).not.toBeInTheDocument();

    userEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.queryByText("business_1")).not.toBeInTheDocument();
    expect(screen.getByText("business_6")).toBeInTheDocument();
  });

  it("should not allow navigation to non-existent pages", () => {
    render(<Component data={paginationData as Connection[]} />, {
      wrapper: MemoryRouter,
    });

    expect(screen.getByText("Previous")).toBeDisabled();
    expect(screen.getByText("Next")).not.toBeDisabled();

    userEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Previous")).not.toBeDisabled();
    expect(screen.getByText("Next")).toBeDisabled();
  });
});
