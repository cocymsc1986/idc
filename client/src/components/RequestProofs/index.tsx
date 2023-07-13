import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { api } from "../../api";
import { RequestedAttributes } from "../../types";

import {
  Button,
  ErrorContainer,
  TextInput,
  SelectInput,
  LoadingIcon,
} from "../common";
import {
  InputWrapper,
  Header,
  TableWrapper,
  TableContent,
  TableItem,
  Value,
  Actions,
  Wrapper,
  FormContainer,
  ResultContainer,
  ResultHeader,
  ResultWrapper,
  ResultLabel,
  ResultValue,
  LoadingContainer,
  CreatedResultWrapper,
  ButtonWrapper,
  RemoveButton,
  AddedField,
  AddedFieldDetails,
} from "./styles";
import { PROOFS_TIMEOUT } from "./consts";

const initialOptions = [
  {
    name: "Please select...",
    value: null,
  },
];

export const RequestProofs = () => {
  const [template, setTemplate] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");

  const [schemas, setSchemas] = useState(initialOptions);
  const [schemaAttributes, setSchemaAttributes] = useState(initialOptions);
  const [schemaCredDefIds, setSchemaCredDefIds] = useState(initialOptions);
  const [templates, setTemplates] = useState([]);

  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [customAttribute, setCustomAttribute] = useState("");
  const [selectedSchema, setSelectedSchema] = useState("");
  const [selectedAttribute, setSelectedAttribute] = useState("");
  const [selectedCredDefId, setSelectedCredDefId] = useState("");

  const [loadingSchemas, setLoadingSchemas] = useState(false);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [loadingAttributes, setLoadingAttributes] = useState(false);
  const [loadingCredDefIds, setLoadingCredDefIds] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);

  const [result, setResult] = useState([]);

  const { connectionId } = useParams();

  useEffect(() => {
    getSchemas();
    getTemplates();
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      getTemplateById();
    }
  }, [selectedTemplate]);

  const convertToOptions = (
    options: Record<string, string>[] | string[]
  ): { name: string; value: string }[] => {
    const arrToOptions = options.map((item) => {
      if (item.name && item.id) {
        return {
          name: item.name,
          value: item.id,
        };
      }

      return {
        name: item,
        value: item,
      };
    });

    return [...initialOptions, ...arrToOptions];
  };

  const getTemplateById = async () => {
    const result = await api.getTemplateById(selectedTemplate);

    setTitle(result.name);
    setTemplate(JSON.parse(result.value));
  };

  const getSchemas = async (refreshCache = false) => {
    setLoadingSchemas(true);

    try {
      const response = await api.getSchemas(refreshCache);
      const options = convertToOptions(response);

      setSchemas(options);
    } catch (e) {
      setError("Error fetching schemas.");
    }

    setLoadingSchemas(false);
  };

  const getTemplates = async () => {
    setLoadingTemplates(true);

    try {
      const response = await api.getTemplates();

      const options = convertToOptions(response);

      setTemplates(options);
    } catch (e) {
      setError("Error fetching templates.");
    }

    setLoadingTemplates(false);
  };

  const displayCredDefIds = async () => {
    setSchemaCredDefIds(initialOptions);

    if (!selectedSchema) return;

    setLoadingCredDefIds(true);

    try {
      const response = await api.getCredDefinitions(selectedSchema);

      const options = convertToOptions(response);

      setSchemaCredDefIds(options);
    } catch (e) {
      setError("Error fetching schema attributes.");
    }

    setLoadingCredDefIds(false);
  };

  const displayAttributes = async () => {
    setSchemaAttributes(initialOptions);

    if (!selectedSchema) return;

    setLoadingAttributes(true);

    try {
      const response = await api.getSchemaFromId(selectedSchema);

      const { attrNames } = response.schema;

      const options = convertToOptions(attrNames);

      setSchemaAttributes(options);
    } catch (e) {
      setError("Error fetching schema attributes.");
    }

    setLoadingAttributes(false);
  };

  useEffect(() => {
    if (selectedSchema) {
      displayCredDefIds();
      displayAttributes();
    }
  }, [selectedSchema]);

  const addAttributeToTemplate = (attributeName: string) => {
    if (attributeName === initialOptions[0].name || attributeName === "")
      return setError("No attribute provided.");

    setSelectedAttribute(attributeName);

    if (!selectedCredDefId)
      return setError("No credential definition Id provided.");

    const attributeExists = template.find(
      (attr) => attr.attribute === attributeName
    );

    if (attributeExists) {
      return setError("Attribute name already exists on the template.");
    }

    setTemplate([
      ...template,
      {
        attribute: attributeName,
        credDefId: selectedCredDefId,
        schemaName: schemas.find((schema) => schema.value === selectedSchema)
          .name,
      },
    ]);
    setError("");
  };

  const deleteAttribute = (e) => {
    const { name } = e.target;

    const filteredTemplate = template.filter((item) => item.attribute !== name);

    setTemplate(filteredTemplate);
  };

  const submitTemplate = async () => {
    setError("");
    setSubmitting(true);

    if (!template.length || !title) {
      setError("Missing required fields.");
      return setSubmitting(false);
    }

    const apiTemplate = template.reduce((acc, curr) => {
      return {
        ...acc,
        [`0_${curr.attribute}`]: {
          name: curr.attribute,
          restrictions: [
            {
              cred_def_id: curr.credDefId,
            },
          ],
        },
      };
    }, {});

    const body = {
      connection_id: connectionId,
      comment: comment,
      proof_request: {
        name: title,
        version: "1.0",
        requested_attributes: apiTemplate as RequestedAttributes,
        requested_predicates: {},
      },
    };

    let presentationId = "";

    try {
      const response = await api.sendProofRequest(body);
      presentationId = response.presentation_exchange_id;
    } catch (e) {
      setError("Error sending proof request.");
      return setSubmitting(false);
    }

    setTimeout(async () => {
      try {
        const response = await api.getProofRecords(presentationId);

        if (!response?.presentation) {
          setError("Error finding presentation records.");
          return setSubmitting(false);
        }

        const attributeValues = Object.entries(
          response.presentation.requested_proof.revealed_attrs
        );

        setResult(attributeValues);
      } catch (e) {
        setError("Error getting proof records.");
      }

      setSubmitting(false);
    }, PROOFS_TIMEOUT);
  };

  const saveTemplate = async () => {
    const res = await api.createTemplate({
      id: uuidv4(),
      name: title,
      value: JSON.stringify(template),
    });

    if (res) {
      setCreateSuccess(true);
    }
  };

  const resetTemplate = () => {
    setTemplate([]);
    setTitle("");
    setComment("");
  };

  return (
    <>
      <h1>Request Proofs</h1>
      <Wrapper>
        <FormContainer>
          <InputWrapper>
            <TextInput
              name="proof-name"
              label="Proof Name"
              placeholder="Please enter a title"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              disabled={submitting}
            />
          </InputWrapper>
          <InputWrapper>
            <SelectInput
              name="templates"
              label="Select an existing Template"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              options={templates}
            />
          </InputWrapper>
          {loadingTemplates && (
            <LoadingContainer>
              <LoadingIcon size="small" />
            </LoadingContainer>
          )}
          <div>
            <InputWrapper>
              <SelectInput
                name="schema"
                label="Select a Schema"
                value={selectedSchema}
                onChange={(e) => setSelectedSchema(e.target.value)}
                options={schemas}
                disabled={loadingSchemas || submitting}
              />
              <ButtonWrapper>
                <Button
                  name="refresh-schemas"
                  size="small"
                  ariaLabel="Refresh Schemas"
                  disabled={loadingSchemas || submitting}
                  onClick={() => getSchemas(true)}
                >
                  Refresh Schemas
                </Button>
              </ButtonWrapper>
              {loadingSchemas && (
                <LoadingContainer>
                  <LoadingIcon size="small" />
                </LoadingContainer>
              )}
            </InputWrapper>
            <InputWrapper>
              <SelectInput
                name="definitionId"
                label="Select a credential definition Id"
                value={selectedCredDefId}
                onChange={(e) => setSelectedCredDefId(e.target.value)}
                options={schemaCredDefIds}
                disabled={loadingCredDefIds || submitting}
              />
              {loadingAttributes && (
                <LoadingContainer>
                  <LoadingIcon size="small" />
                </LoadingContainer>
              )}
            </InputWrapper>
            <InputWrapper>
              <SelectInput
                name="attribute"
                label="Select an Attribute"
                value={selectedAttribute}
                onChange={(e) => setSelectedAttribute(e.target.value)}
                options={schemaAttributes}
                disabled={loadingAttributes || submitting}
              />
              <ButtonWrapper>
                <Button
                  name="add-attribute"
                  onClick={() => addAttributeToTemplate(selectedAttribute)}
                  size="small"
                  ariaLabel="Add attribute"
                  disabled={loadingAttributes || submitting}
                >
                  Add field
                </Button>
              </ButtonWrapper>
              {loadingAttributes && (
                <LoadingContainer>
                  <LoadingIcon size="small" />
                </LoadingContainer>
              )}
            </InputWrapper>
            <InputWrapper>
              <TextInput
                name="custom-attribute"
                label="Add a Custom Attribute"
                placeholder="Enter an attribute name"
                onChange={(e) => setCustomAttribute(e.target.value)}
                value={customAttribute}
              />
              <ButtonWrapper>
                <Button
                  name="add-custom-attribute"
                  onClick={() => addAttributeToTemplate(customAttribute)}
                  size="small"
                  ariaLabel="Add custom attribute"
                >
                  Add custom field
                </Button>
              </ButtonWrapper>
            </InputWrapper>
            <InputWrapper>
              <TextInput
                name="template-comment"
                label="Add a Comment"
                onChange={(e) => setComment(e.target.value)}
                value={comment}
              />
            </InputWrapper>
          </div>
          {error && <ErrorContainer>{error}</ErrorContainer>}
        </FormContainer>
        <ResultContainer>
          <ResultHeader>Result</ResultHeader>
          <ResultWrapper>
            {!result.length &&
              "Submit a proof request to see information here."}
            {result &&
              result.map((attribute) => (
                <ResultWrapper key={attribute[0]}>
                  <ResultLabel>{attribute[0].slice(2, -5)}</ResultLabel>
                  <ResultValue>{attribute[1].raw}</ResultValue>
                </ResultWrapper>
              ))}
          </ResultWrapper>
        </ResultContainer>
      </Wrapper>
      <h1>Template Request</h1>
      <TableWrapper>
        <Header>Name:</Header>
        <TableContent>
          <TableItem>
            <Value>{title}</Value>
          </TableItem>
        </TableContent>
        <Header>Attributes:</Header>
        <TableContent>
          {!template.length && <TableItem />}
          {template.map((field) => (
            <TableItem key={`attribute_${field.attribute}`}>
              <AddedField>
                <Value>{field.attribute}</Value>
                <RemoveButton
                  name={field.attribute}
                  onClick={(e) => deleteAttribute(e)}
                  size="small"
                  aria-label="Remove attribute"
                >
                  X
                </RemoveButton>
              </AddedField>
              <AddedFieldDetails>
                Schema: {field.schemaName}
                <br />
                Cred. definition Id: {field.credDefId}
              </AddedFieldDetails>
            </TableItem>
          ))}
        </TableContent>
        <Header>Comment:</Header>
        <TableContent>
          <TableItem>
            <Value>{comment}</Value>
          </TableItem>
        </TableContent>
      </TableWrapper>
      <Actions>
        <Button onClick={() => submitTemplate()} loading={submitting}>
          Request Proof
        </Button>
        <Button onClick={() => saveTemplate()} type="secondary">
          Save Proof Template
        </Button>
        <Button
          onClick={() => resetTemplate()}
          type="secondary"
          disabled={submitting || (!template.length && !title && !comment)}
        >
          Reset
        </Button>
      </Actions>
      {createSuccess && (
        <CreatedResultWrapper>Created Successfully</CreatedResultWrapper>
      )}
    </>
  );
};
