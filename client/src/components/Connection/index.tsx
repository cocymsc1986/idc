import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { api } from "../../api";
import {
  Connection as ConnectionType,
  GetProofRecordsResponse,
} from "../../types";
import {
  InfoTable,
  LinkButton,
  LoadingWrapper,
  LoadingIcon,
  ErrorContainer,
  TableItem,
  SearchTable,
} from "../common";

import {
  ActionItem,
  Actions,
  ActionsButtonsWrapper,
  ConnectionInfoWrapper,
} from "./styles";

export const Connection = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connection, setConnection] = useState<ConnectionType>(null);
  const [proofs, setProofs] = useState<GetProofRecordsResponse[]>([]);

  const { connectionId: id } = useParams();

  const getConnection = async () => {
    try {
      const data = await api.getConnection(id);
      setConnection(data);
    } catch (err) {
      setError(`Failed to fetch connection: ${err}`);
      setLoading(false);
    }
  };

  const getConnectionProofs = async () => {
    try {
      const data = await api.getConnectionProofs(id);
      setProofs(data.results);
    } catch (err) {
      setError(`Failed to fetch connection's proof records: ${err}`);
    }

    setLoading(false);
  };

  useEffect(() => {
    getConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    connection && getConnectionProofs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection]);

  if (loading) {
    return (
      <LoadingWrapper>
        <LoadingIcon />
      </LoadingWrapper>
    );
  }

  if (!connection && error) {
    return (
      <>
        <h1>{id}</h1>
        <ErrorContainer>{error}</ErrorContainer>
      </>
    );
  }

  const timeSortedProofs = proofs.sort((a, b) => {
    const aDate = new Date(a?.updated_at).getTime();
    const bDate = new Date(b?.updated_at).getTime();

    return bDate - aDate;
  });

  return (
    <>
      <h1>{id}</h1>

      <Actions>
        Actions:
        <ActionsButtonsWrapper>
          <ActionItem>
            <LinkButton to={`/connections/${id}/sign-content`}>
              Sign Content
            </LinkButton>
          </ActionItem>
          <ActionItem>
            <LinkButton to={`/connections/${id}/verify-content`}>
              Verify Content
            </LinkButton>
          </ActionItem>
          <ActionItem>
            <LinkButton to={`/connections/${id}/request-proofs`}>
              Request Proofs
            </LinkButton>
          </ActionItem>
        </ActionsButtonsWrapper>
      </Actions>

      <ConnectionInfoWrapper>
        <InfoTable title="Connection data" data={connection} />
      </ConnectionInfoWrapper>

      <SearchTable
        title="Proof Requests"
        data={timeSortedProofs}
        results={(data) => (
          <TableItem
            key={`${data.connection_id}${data.created_at}${data.updated_at}`}
            data={data}
          />
        )}
        tableProps={{
          titles: ["Title", "Status", "Last Updated", ""],
          widths: [40, 20, 32, 8],
        }}
        labelPath={["presentation_request.name"]}
      />

      {error && <ErrorContainer>{error}</ErrorContainer>}
    </>
  );
};
