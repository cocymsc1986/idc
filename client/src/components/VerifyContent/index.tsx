import { useState } from "react";

import {
  TextArea,
  TextInput,
  InputWrapper,
  Button,
  SelectInput,
  ErrorContainer,
  Fieldset,
} from "../common";

import { api } from "../../api";

import {
  ButtonWrapper,
  FormContainer,
  ResultContainer,
  ResultHeader,
  ResultWrapper,
  Wrapper,
} from "./styles";

type FormValueTypes = {
  document: string;
  connection_id: string;
  public_did: string;
  type: "connection-did" | "public-did";
  signature: string;
};

const selectOptions = [
  {
    name: "Pairwise Connection DID",
    value: "connection-did",
  },
  {
    name: "Public DID",
    value: "public-did",
  },
];

export const VerifyContent = () => {
  const [formValues, setFormValues] = useState<FormValueTypes>({
    document: "",
    connection_id: "",
    public_did: "",
    type: "connection-did",
    signature: "",
  });
  const [error, setError] = useState<string>();
  const [result, setResult] = useState<{ verified: boolean }>(null);
  const [loading, setLoading] = useState(false);

  const onChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
  };

  const isValid = () => {
    const { connection_id, document, public_did, signature, type } = formValues;

    try {
      JSON.parse(document);
    } catch {
      setError("Error processing JSON. Please check and try again");
      return;
    }

    if (!signature || !document) {
      setError("Missing required values");
      return false;
    }

    if (type === "connection-did" && !connection_id) {
      setError("Missing required values");
      return false;
    }

    if (type !== "connection-did" && !public_did) {
      setError("Missing required values");
      return false;
    }

    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!isValid()) {
      return setLoading(false);
    }

    try {
      const response = await api.verifyContent({
        ...formValues,
        document: JSON.parse(formValues.document),
      });

      setResult(response);
      setError("");
    } catch {
      setError("Error verifying data. Please try again");
    }

    setLoading(false);
  };

  return (
    <>
      <h1>Verify Content</h1>
      <Wrapper>
        <FormContainer>
          <form onSubmit={onSubmit}>
            <Fieldset disabled={loading}>
              <InputWrapper>
                <TextArea
                  name="document"
                  label="Content to sign (Must be JSON)"
                  value={formValues.document}
                  onChange={onChange}
                />
              </InputWrapper>
              <InputWrapper>
                <SelectInput
                  name="type"
                  label="Verification Type"
                  value={formValues.type}
                  onChange={onChange}
                  options={selectOptions}
                />
              </InputWrapper>
              <InputWrapper>
                {formValues.type === "connection-did" ? (
                  <TextInput
                    name="connection_id"
                    label="Connection ID"
                    value={formValues.connection_id}
                    onChange={onChange}
                  />
                ) : (
                  <TextInput
                    name="public_did"
                    label="Public DID"
                    value={formValues.public_did}
                    onChange={onChange}
                  />
                )}
              </InputWrapper>
              <InputWrapper>
                <TextInput
                  name="signature"
                  label="Signature"
                  value={formValues.signature}
                  onChange={onChange}
                />
              </InputWrapper>
            </Fieldset>
            <ButtonWrapper>
              <Button htmlType="submit" loading={loading}>
                Verify
              </Button>
            </ButtonWrapper>
          </form>
        </FormContainer>
        <ResultContainer>
          <ResultHeader>Result</ResultHeader>
          {error && <ErrorContainer>{error}</ErrorContainer>}
          <ResultWrapper>
            {!result &&
              !error &&
              "Enter data in the form and verify to see confirmation here."}
            {result &&
              (result.verified
                ? "Successfully verified"
                : "Could not verify data")}
          </ResultWrapper>
        </ResultContainer>
      </Wrapper>
    </>
  );
};
