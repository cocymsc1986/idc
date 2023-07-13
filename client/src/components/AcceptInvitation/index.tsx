import { useState } from "react";

import { api } from "../../api";
import {
  Button,
  ErrorContainer,
  Fieldset,
  InputWrapper,
  TextInput,
} from "../common";
import { Form, SuccessContainer } from "./styles";

const defaultFormValues = {
  alias: "",
  id: "",
  serviceEndpoint: "",
  recipientKey: "",
  label: "",
};

export const AcceptInvitation = () => {
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [error, setError] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [loading, setLoading] = useState(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setLoading(true);

    const { alias, id, serviceEndpoint, recipientKey, label } = formValues;

    if (Object.values(formValues).includes("")) {
      setLoading(false);
      return setError("Missing required values");
    }

    try {
      await api.receiveInvitation({
        alias,
        payload: {
          "@id": id,
          label,
          serviceEndpoint,
          recipientKeys: [recipientKey],
        },
      });

      setStatus("Invitation accepted!");
      resetForm();
    } catch {
      setError("Error accepting invitation. Please try again");
    }

    setLoading(false);
  };

  const resetForm = () => {
    setFormValues(defaultFormValues);
    setError("");
  };

  return (
    <>
      <h1>Accept Invitation</h1>
      <Form onSubmit={handleSubmit}>
        <Fieldset disabled={loading}>
          <InputWrapper>
            <TextInput
              label="Alias"
              name="alias"
              value={formValues.alias}
              onChange={onChange}
              placeholder="Please enter an alias"
            />
          </InputWrapper>
          <InputWrapper>
            <TextInput
              label="Label"
              name="label"
              value={formValues.label}
              onChange={onChange}
              placeholder="Please enter a label"
            />
          </InputWrapper>
          <InputWrapper>
            <TextInput
              label="Recipient Key"
              name="recipientKey"
              value={formValues.recipientKey}
              onChange={onChange}
              placeholder="Please enter a recipient key"
            />
          </InputWrapper>
          <InputWrapper>
            <TextInput
              label="ID"
              name="id"
              value={formValues.id}
              onChange={onChange}
              placeholder="Please enter an ID"
            />
          </InputWrapper>
          <InputWrapper>
            <TextInput
              label="Service Endpoint"
              name="serviceEndpoint"
              value={formValues.serviceEndpoint}
              onChange={onChange}
              placeholder="Please enter a service endpoint"
            />
          </InputWrapper>
        </Fieldset>
        <div>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
          <Button onClick={resetForm} type="secondary" disabled={loading}>
            Reset
          </Button>
        </div>
      </Form>
      {error && <ErrorContainer>{error}</ErrorContainer>}
      {status && <SuccessContainer>{status}</SuccessContainer>}
    </>
  );
};
