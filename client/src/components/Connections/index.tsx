import { useState, useEffect } from "react";

import { api } from "../../api";
import { Connection } from "../../types";
import {
  Table,
  TableItem,
  LinkButton,
  LoadingWrapper,
  LoadingIcon,
  ErrorContainer,
  SearchTable,
} from "../common";

import {
  Wrapper,
  ButtonWrapper,
  Statistic,
  StatInfo,
  StatNumber,
  H3,
} from "./styles";

export const Connections = () => {
  const [results, setResults] = useState<Connection[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const getConnections = async () => {
    try {
      const data = await api.getConnections();
      setResults(data.results);
    } catch (err) {
      setError(`Failed to fetch connections: ${err}`);
    }

    setLoading(false);
  };

  useEffect(() => {
    getConnections();
  }, []);

  if (loading) {
    return (
      <LoadingWrapper>
        <LoadingIcon />
      </LoadingWrapper>
    );
  }

  if (!results.length && error) {
    return (
      <>
        <h1>Connections</h1>
        <ErrorContainer>{error}</ErrorContainer>
      </>
    );
  }

  const timeSortedConnections = results.sort((a, b) => {
    const aDate = new Date(a.updated_at).getTime();
    const bDate = new Date(b.updated_at).getTime();

    return bDate - aDate;
  });

  const lastConnection = timeSortedConnections[0];
  const sortedDataWithoutLatest = results.filter(
    ({ connection_id }) => connection_id !== lastConnection.connection_id
  );
  const activeAmount = results.filter(({ state }) => state === "active").length;
  const pendingAmount = results.filter(
    ({ state }) => state === "request" || state === "invitation"
  ).length;

  const hasConnection = lastConnection !== undefined;

  return (
    <>
      <h1>Connections</h1>
      {hasConnection ? (
        <div>
          <Statistic>
            <StatInfo>
              <StatNumber>{activeAmount}</StatNumber>
              Active
              <br /> Connection{activeAmount !== 1 && "s"}
            </StatInfo>
          </Statistic>
          <Statistic>
            <StatInfo>
              <StatNumber>{pendingAmount}</StatNumber>
              Pending
              <br /> Connection{pendingAmount !== 1 && "s"}
            </StatInfo>
          </Statistic>
        </div>
      ) : (
        <p>No connections found.</p>
      )}
      <ButtonWrapper>
        <LinkButton to="create-invitation">Create Invitation</LinkButton>
        <LinkButton to="accept-invitation">Accept Invitation</LinkButton>
      </ButtonWrapper>
      {hasConnection && (
        <Wrapper>
          <H3>Latest connection</H3>
          <Table
            titles={["Alias", "Status", "Last Updated", ""]}
            widths={[40, 20, 32, 8]}
          >
            <TableItem data={lastConnection} />
          </Table>
          <SearchTable
            title="Connections"
            data={sortedDataWithoutLatest}
            results={(data) => (
              <TableItem
                key={`${data.connection_id}${data.created_at}${data.updated_at}`}
                data={data}
                displayDate={false}
              />
            )}
            tableProps={{
              titles: ["Alias", "Status", "DID", ""],
              widths: [40, 20, 32, 8],
            }}
            labelPath={["alias", "their_label"]}
          />
        </Wrapper>
      )}
    </>
  );
};
