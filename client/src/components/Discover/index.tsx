import { useState } from "react";

import { Button, ErrorContainer, TableData, SearchTable } from "../common";
import { Listing } from "../../types";
import { api } from "../../api";

import { ButtonWrapper, SuccessContainer } from "./styles";

export const Discover = () => {
  const [dids, setDids] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  const [requestedDid, setRequestedDid] = useState("");

  const getDIDDirectory = async () => {
    setLoading(true);

    try {
      const response = await api.getDIDDirectory();

      setDids(response.listing);
      setError("");
    } catch (err) {
      setError(`Failed to fetch potential partners: ${err}`);
    }

    setLoading(false);
  };

  const createDIDRequest = async (alias: string, did: string) => {
    setRequestedDid(did);
    setLoading(true);

    try {
      const response = await api.createDIDRequest({
        alias,
        did,
      });

      if (!response) {
        setLoading(false);
        return setError("Error creating request. Please try again");
      }

      setResult(`Request to ${alias} successful!`);
      setError("");
    } catch {
      setError("Error creating request. Please try again");
    }

    setLoading(false);
  };

  return (
    <>
      <h1>Discover</h1>
      {!dids.length && (
        <ButtonWrapper>
          <Button onClick={() => getDIDDirectory()} loading={loading}>
            Get Potential Partners
          </Button>
        </ButtonWrapper>
      )}
      {error && <ErrorContainer>{error}</ErrorContainer>}
      {result && <SuccessContainer>{result}</SuccessContainer>}

      {dids.length > 0 && (
        <SearchTable
          title="DID Directory"
          data={dids}
          results={({ name, did }) => (
            <tr>
              <TableData>{name}</TableData>
              <TableData>{did}</TableData>
              <TableData>
                <Button
                  onClick={() => createDIDRequest(name, did)}
                  loading={loading && requestedDid === did}
                  disabled={loading}
                  size="small"
                >
                  Request a Secure Connection
                </Button>
              </TableData>
            </tr>
          )}
          tableProps={{
            titles: ["Alias", "DID", ""],
            widths: [35, 35, 20],
          }}
          labelPath={["name", "did"]}
        />
      )}
    </>
  );
};
