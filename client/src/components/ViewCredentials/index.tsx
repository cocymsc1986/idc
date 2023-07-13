import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { api } from "../../api";
import {
  LoadingWrapper,
  LoadingIcon,
  ErrorContainer,
  InfoTable,
} from "../common";

import { CredentialInfoWrapper } from "./styles";

const keys = [
  "presentation_request",
  "presentation_request_dict",
  "presentation",
  "requested_attributes",
];

type ConvertObjectToInfoDataType = {
  [key: string]:
    | {
        raw: string;
      }
    | {
        name: string;
        restrictions: {
          [key: string]: string;
        }[];
      };
};

export const ViewCredentials = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proofs, setProofs] = useState(null);

  const { presentationId: id } = useParams();

  const getConnectionProofs = async () => {
    try {
      const data = await api.getProofRecords(id);
      setProofs(data);
    } catch (err) {
      setError(`Failed to fetch connection's proof records: ${err}`);
    }
    setLoading(false);
  };

  const convertObjectsToInfoData = (...args: ConvertObjectToInfoDataType[]) => {
    return args.map((arg) => {
      if (!arg) return null;

      return Object.fromEntries(
        Object.entries(arg).map((obj) => {
          const [key, values] = obj;

          const name = "name" in values ? values.name : key.slice(2);
          const value =
            "raw" in values
              ? values.raw
              : JSON.stringify(values.restrictions?.[0]);

          return [name, value];
        })
      );
    });
  };

  useEffect(() => {
    getConnectionProofs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <LoadingWrapper>
        <LoadingIcon />
      </LoadingWrapper>
    );
  }

  if (!proofs && error) {
    return (
      <>
        <h1>{id}</h1>
        <ErrorContainer>{error}</ErrorContainer>
      </>
    );
  }

  const {
    presentation_request: { version, requested_attributes },
    presentation_request_dict: { comment },
  } = proofs;

  const unrevealed_attrs =
    proofs?.presentation?.requested_proof?.unrevealed_attrs;
  const revealed_attrs = proofs?.presentation?.requested_proof?.revealed_attrs;

  const infoData = Object.fromEntries(
    Object.entries({ ...proofs, version, comment })
      .filter(([key]) => !keys.includes(key))
      .map(([key, value]) => [key, value.toString()])
  );

  const [unrevealed, revealed, requested] = convertObjectsToInfoData(
    unrevealed_attrs,
    revealed_attrs,
    requested_attributes
  );

  return (
    <>
      <h1>{proofs?.presentation_request?.name}</h1>
      <CredentialInfoWrapper>
        <InfoTable title="Presentation data" data={infoData} />
      </CredentialInfoWrapper>
      <CredentialInfoWrapper>
        <InfoTable title="Revealed Attributes" data={revealed} />
      </CredentialInfoWrapper>
      <CredentialInfoWrapper>
        <InfoTable title="Unrevealed Attributes" data={unrevealed} />
      </CredentialInfoWrapper>
      <CredentialInfoWrapper>
        <InfoTable title="Requested Attributes" data={requested} />
      </CredentialInfoWrapper>
    </>
  );
};
