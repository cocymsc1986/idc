import { useState } from "react";

import { api } from "../../api";
import { Button, ErrorContainer, Fieldset, TextInput } from "../common";
import {
  ButtonWrapper,
  Form,
  PayloadHeader,
  PayloadWrapper,
  Pre,
} from "./styles";

export const CreateInvitation = () => {
  const [alias, setAlias] = useState("");
  const [result, setResult] = useState<string>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlias(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!alias) {
      setLoading(false);
      return setError("Missing required values");
    }

    try {
      const response = await api.createInvitation({
        alias,
      });

      if (!response) {
        setLoading(false);
        return setError("Error creating invitation. Please try again");
      }

      setResult(JSON.stringify(response, undefined, 2));
      setError("");
    } catch {
      setError("Error creating invitation. Please try again");
    }

    setLoading(false);
  };

  const onClick = () => {
    navigator.clipboard.writeText(result);
  };

  return (
    <>
      <h1>Create Invitation</h1>
      <Form onSubmit={handleSubmit}>
        <Fieldset disabled={loading}>
          <TextInput
            label="Alias"
            name="alias"
            value={alias}
            onChange={onChange}
            placeholder="Bob, providing quotes"
          />
        </Fieldset>
        <ButtonWrapper>
          <Button htmlType="submit" loading={loading}>
            Submit
          </Button>
        </ButtonWrapper>
      </Form>
      <div>
        <PayloadHeader>
          Private Invitation Connection Payload (JSON)
        </PayloadHeader>
        <PayloadWrapper>
          <Pre>
            <code>{result || "{}"}</code>
          </Pre>
        </PayloadWrapper>
        {result && <Button onClick={onClick}>Copy Payload</Button>}
      </div>
      {error && <ErrorContainer>{error}</ErrorContainer>}
    </>
  );
};
