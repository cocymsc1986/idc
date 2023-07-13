export type Connection = {
  accept: string;
  alias: string;
  connection_id: string;
  connection_protocol: string;
  created_at: string;
  error_msg: string;
  inbound_connection_id: string;
  invitation_key: string;
  invitation_mode: string;
  invitation_msg_id: string;
  my_did: string;
  request_id: string;
  rfc23_state: string;
  routing_state: string;
  state: string;
  their_did: string;
  their_label: string;
  their_public_did: string;
  their_role: string;
  updated_at: string;
};

export type GetConnectionsResponse = {
  results: Connection[];
};

export type GetConnectionResponse = Connection;

export type SignContentRequest = {
  connectionId: string;
  document: Record<string, any>;
};

export type SignContentResponse = {
  pairwise_did_signature: string;
  public_did_signature: string;
};

export type VerifyContentRequest = {
  type: "public-did" | "connection-did";
  public_did?: string;
  connection_id?: string;
  document: Record<string, any>;
  signature: string;
};

export type VerifyContentResponse = {
  verified: boolean;
};

export type ConnectionInvitation = {
  "@id": string;
  label: string;
  recipientKeys: string[];
  serviceEndpoint: string;
};

export type CreateInvitationRequest = {
  alias: string;
};

export type CreateInvitationResponse = {
  connection_id: string;
  invitation: ConnectionInvitation;
  invitation_url: string;
  alias: string;
};

export type ReceiveInvitationRequest = {
  alias: string;
  payload: ConnectionInvitation;
};

export type ReceiveInvitationResponse = Connection;

export type CredDefinition = {
  name: string;
  id: string;
};

export type GetCredDefinitionsResponse = CredDefinition[];

export type SchemaOption = {
  name: string;
  value: string;
};

export type GetSchemasResponse = SchemaOption[];

export type Schema = {
  attrNames: string[];
  id: string;
  name: string;
  seqNo: number;
  ver: string;
  version: string;
};

export type GetSchemaFromIdResponse = {
  schema_id: string;
  schema: Schema;
};

export type RequestedAttributes = {
  [key: string]: {
    name: string;
    restrictions: [
      {
        cred_def_id: string;
      }
    ];
  };
};

export type SendProofRequestRequest = {
  connection_id: string;
  comment: string;
  proof_request: {
    name: string;
    version: string;
    requested_attributes: RequestedAttributes;
    requested_predicates: {};
  };
};

export type SendProofRequestResponse = {
  auto_present: boolean;
  connection_id: string;
  created_at: string;
  initiator: string;
  presentation_exchange_id: string;
  presentation_request: {
    name: string;
    nonce: string;
    requested_attributes: RequestedAttributes;
    version: string;
  };
  presentation_request_dict: {
    "@id": string;
    "@type": string;
    comment: string;
    "request_presentations~attach": [
      {
        "@id": string;
        data: {
          base64: string;
        };
        "mime-type": string;
      }
    ];
  };
  role: string;
  state: string;
  thread_id: string;
  trace: boolean;
  updated_at: string;
  error_msg?: string;
};

export type GetProofRecordsResponse = SendProofRequestResponse & {
  presentation?: {
    requested_proof: {
      revealed_attrs: {
        [key: string]: {
          raw: string;
        };
      };
      unrevealed_attrs: {
        [key: string]: {
          raw: string;
        };
      };
    };
  };
};

export type Template = {
  id: string;
  name: string;
  value: string;
};

export type GetTemplatesResponse = Template[];
export type GetTemplateByIdResponse = Template;
export type CreateTemplateResponse = Template;

export type Listing = {
  did: string;
  name: string;
  identifierString: string;
  registeredCountry: string;
  lei: string;
  sic: string;
  schemaUsed: string;
  credentialDefinitionUsed: string;
  dateRegistered: string;
};

export type GetDIDDirectoryResponse = {
  listing: Listing[];
};

export type CreateDIDRequestRequest = {
  alias: string;
  did: string;
};

export type CreateDIDRequestResponse = {
  connection_protocol: string;
  connection_id: string;
  their_did: string;
  alias: string;
  their_role: string;
  created_at: string;
  state: string;
  invitation_mode: string;
  rfc23_state: string;
  my_did: string;
  routing_state: string;
  request_id: string;
  their_public_did: string;
  accept: string;
  updated_at: string;
};
