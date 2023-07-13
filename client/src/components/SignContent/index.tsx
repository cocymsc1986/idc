import { ChangeEvent, useState } from "react";
import { useParams } from "react-router-dom";

import { api } from "../../api";
import { Button, TextArea, ErrorContainer, Fieldset } from "../common";
import {
  ButtonWrapper,
  CopyButtonWrapper,
  FormContainer,
  ResultContainer,
  ResultHeader,
  ResultLabel,
  ResultValue,
  ResultWrapper,
  Wrapper,
} from "./styles";

const defaultSignatureState = {
  pairwise_did_signature: "",
  public_did_signature: "",
};

export const SignContent = () => {
  const { connectionId } = useParams();

  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [signatures, setSignatures] = useState(defaultSignatureState);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSignatures(defaultSignatureState);
    setLoading(true);

    let document;

    try {
      document = JSON.parse(value);
    } catch {
      setLoading(false);
      return setError("Error processing JSON. Please check and try again");
    }

    try {
      const response = await api.signContent({
        connectionId: connectionId,
        document,
      });

      if (!response) {
        setLoading(false);
        return setError("Error getting signatures. Please try again");
      }

      setSignatures(response);
      setError("");
    } catch {
      setError("Error getting signatures. Please try again");
    }

    setLoading(false);
  };

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const resetForm = () => {
    setSignatures(defaultSignatureState);
    setError("");
    setValue("");
  };

  const copyPairwise = () => {
    const payload = {
      pairwise_did_signature: signatures.pairwise_did_signature,
    };

    navigator.clipboard.writeText(JSON.stringify(payload));
  };

  const copyPublicDid = () => {
    const payload = {
      public_did_signature: signatures.public_did_signature,
    };

    navigator.clipboard.writeText(JSON.stringify(payload));
  };

  const showCopyButton =
    signatures.pairwise_did_signature &&
    signatures.public_did_signature &&
    value;

  return (
    <>
      <h1>Sign Content</h1>
      <Wrapper>
        <FormContainer>
          <form onSubmit={onSubmit}>
            <Fieldset disabled={loading}>
              <TextArea
                name="sign-content-input"
                label="Content to sign (Must be JSON)"
                value={value}
                onChange={onChange}
                minHeight="40rem"
              />
            </Fieldset>
            <ButtonWrapper>
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit
              </Button>
              <Button onClick={resetForm} type="secondary" disabled={loading}>
                Reset
              </Button>
            </ButtonWrapper>
          </form>
        </FormContainer>
        <ResultContainer>
          <ResultHeader>Results</ResultHeader>
          {error && <ErrorContainer>{error}</ErrorContainer>}
          <ResultWrapper>
            <ResultLabel>Pairwise Signature:</ResultLabel>
            <ResultValue>
              {signatures.pairwise_did_signature ||
                "<Signature will show here>"}
            </ResultValue>
            {showCopyButton && (
              <CopyButtonWrapper>
                <Button onClick={copyPairwise}>Copy Signature 1</Button>
              </CopyButtonWrapper>
            )}
          </ResultWrapper>
          <ResultWrapper>
            <ResultLabel>Public Signature:</ResultLabel>
            <ResultValue>
              {signatures.public_did_signature || "<Signature will show here>"}
            </ResultValue>
            {showCopyButton && (
              <CopyButtonWrapper>
                <Button onClick={copyPublicDid}>Copy Signature 2</Button>
              </CopyButtonWrapper>
            )}
          </ResultWrapper>
        </ResultContainer>
      </Wrapper>
    </>
  );
};
