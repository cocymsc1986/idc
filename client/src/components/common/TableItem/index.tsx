import { Connection, SendProofRequestResponse } from "../../../types";
import { TableData } from "../TableData";

import { StyledLink } from "./styles";

type TableItemProps = {
  data: Connection | SendProofRequestResponse;
  displayDate?: boolean;
};

const states = ["active", "presentation_acked", "verified"];

export const TableItem = ({ data, displayDate = true }: TableItemProps) => {
  const isActive = states.find((value) => value === data.state);
  const isCredential = "presentation_exchange_id" in data;

  const dateTime = new Date(data.updated_at)
    .toLocaleString([], {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      minute: "2-digit",
      hour: "2-digit",
    })
    .replace(/\//g, "-")
    .replace(/, /g, " ");

  let name: string,
    uri: string,
    fallback: string | React.ReactNode,
    status: string;

  if (isActive) {
    status = data.state === "verified" ? "Completed" : "Active";
  } else {
    status = data?.error_msg ? "Abandoned" : "Pending";
  }

  if (isCredential) {
    name = data.presentation_request.name;
    uri = data.presentation_exchange_id;
  } else {
    const { alias, their_did, their_public_did, connection_id, their_label } =
      data;

    name = alias || their_label;
    uri = connection_id;
    fallback = their_public_did || their_did;
  }

  return (
    <tr>
      <TableData>{name}</TableData>
      <TableData>{status}</TableData>
      <TableData>{displayDate ? dateTime : fallback}</TableData>
      <TableData>
        {(isActive || isCredential) && <StyledLink to={uri}>View</StyledLink>}
      </TableData>
    </tr>
  );
};
