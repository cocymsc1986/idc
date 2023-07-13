import axios from "axios";

import {
  CreateInvitationRequest,
  CreateInvitationResponse,
  GetConnectionResponse,
  GetConnectionsResponse,
  ReceiveInvitationRequest,
  ReceiveInvitationResponse,
  SignContentRequest,
  SignContentResponse,
  VerifyContentRequest,
  VerifyContentResponse,
  GetSchemasResponse,
  GetSchemaFromIdResponse,
  GetCredDefinitionsResponse,
  SendProofRequestRequest,
  SendProofRequestResponse,
  GetProofRecordsResponse,
  GetTemplatesResponse,
  GetTemplateByIdResponse,
  CreateTemplateResponse,
  Template,
  GetDIDDirectoryResponse,
  CreateDIDRequestRequest,
  CreateDIDRequestResponse,
} from "../types";

// axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.common["X-API-KEY"] = process.env.REACT_APP_API_KEY;

const agentApi = process.env.REACT_APP_API_URL;
const serverApi = process.env.REACT_APP_SERVER_API_URL;

export const api = {
  getConnections: async (): Promise<GetConnectionsResponse> => {
    try {
      const response = await axios.get(`${agentApi}/connections`);

      return response.data;
    } catch (e) {
      console.error("Error getting connections", { e });
      throw e;
    }
  },
  getConnection: async (id: string): Promise<GetConnectionResponse> => {
    try {
      const response = await axios.get(`${agentApi}/connections/${id}`);

      return response.data;
    } catch (e) {
      console.error(`Error getting connection ${id}`, { e });
      throw e;
    }
  },
  signContent: async ({
    connectionId,
    document,
  }: SignContentRequest): Promise<SignContentResponse> => {
    try {
      const response = await axios.post(`${agentApi}/json-signatures/sign`, {
        connection_id: connectionId,
        document,
      });

      return response.data;
    } catch (e) {
      console.error("Error signing content", { e });
      throw e;
    }
  },
  verifyContent: async ({
    type,
    connection_id,
    public_did,
    document,
    signature,
  }: VerifyContentRequest): Promise<VerifyContentResponse> => {
    try {
      const getDid = () =>
        type === "public-did"
          ? {
              public_did,
            }
          : {
              connection_id,
            };

      const response = await axios.post(
        `${agentApi}/json-signatures/verify/${type}`,
        {
          ...getDid(),
          document,
          signature,
        }
      );

      return response.data;
    } catch (e) {
      console.error("Error verifying content", { e });
      throw e;
    }
  },
  createInvitation: async ({
    alias,
  }: CreateInvitationRequest): Promise<CreateInvitationResponse> => {
    try {
      const response = await axios.post(
        `${agentApi}/connections/create-invitation?alias=${alias}&auto_accept=true&multi_use=false&public=false`
      );

      return response.data;
    } catch (e) {
      console.error(`Error getting payload for ${alias}`, { e });
      throw e;
    }
  },
  receiveInvitation: async ({
    alias,
    payload,
  }: ReceiveInvitationRequest): Promise<ReceiveInvitationResponse> => {
    try {
      const response = await axios.post(
        `${agentApi}/connections/receive-invitation?alias=${alias}&auto_accept=true`,
        payload
      );

      return response.data;
    } catch (e) {
      console.error(`Error receiving invitation for ${alias}`, { e });
      throw e;
    }
  },
  getSchemas: async (refreshCache = false): Promise<GetSchemasResponse> => {
    try {
      const response = await axios.get(`${serverApi}/schemas`, {
        params: { refreshCache },
      });

      return response.data;
    } catch (e) {
      console.error(`Error getting schemas`, { e });
      throw e;
    }
  },
  getSchemaFromId: async (id: string): Promise<GetSchemaFromIdResponse> => {
    try {
      const response = await axios.get(`${agentApi}/schemas/${id}`);
      return response.data;
    } catch (e) {
      console.error(`Error getting schema`, { e });
      throw e;
    }
  },
  getCredDefinitions: async (
    id: string,
    refreshCache = false
  ): Promise<GetCredDefinitionsResponse> => {
    try {
      const response = await axios.get(
        encodeURI(`${serverApi}/schemas/credential-definitions/${id}`),
        {
          params: { refreshCache },
        }
      );

      return response.data;
    } catch (e) {
      console.error(`Error getting credential definitions`, { e });
      throw e;
    }
  },
  sendProofRequest: async (
    payload: SendProofRequestRequest
  ): Promise<SendProofRequestResponse> => {
    try {
      const response = await axios.post(
        `${agentApi}/present-proof/send-request`,
        payload
      );
      return response.data;
    } catch (e) {
      console.error(`Error sending proof request`, { e });
      throw e;
    }
  },
  getConnectionProofs: async (id: string) => {
    try {
      const response = await axios.get(
        `${agentApi}/present-proof/records?connection_id=${id}`
      );
      return response.data;
    } catch (e) {
      console.error(`Error getting connection's proof record`, { e });
      throw e;
    }
  },
  getProofRecords: async (id: string): Promise<GetProofRecordsResponse> => {
    try {
      const response = await axios.get(
        `${agentApi}/present-proof/records/${id}`
      );
      return response.data;
    } catch (e) {
      console.error(`Error getting proof records`, { e });
      throw e;
    }
  },
  getTemplates: async (): Promise<GetTemplatesResponse> => {
    try {
      const response = await axios.get(`${serverApi}/templates`);
      return response.data;
    } catch (e) {
      console.error(`Error getting templates`, { e });
      throw e;
    }
  },
  getTemplateById: async (id: string): Promise<GetTemplateByIdResponse> => {
    try {
      const response = await axios.get(`${serverApi}/templates/${id}`);
      return response.data;
    } catch (e) {
      console.error(`Error getting template with id: ${id}`, { e });
      throw e;
    }
  },
  createTemplate: async (
    template: Template
  ): Promise<CreateTemplateResponse> => {
    try {
      const response = await axios.post(`${serverApi}/templates`, template);
      return response.data;
    } catch (e) {
      console.error(`Error creating template`, { e });
      throw e;
    }
  },
  getDIDDirectory: async (): Promise<GetDIDDirectoryResponse> => {
    try {
      const response = await axios.get(
        `${serverApi}/did-directory/get-did-directory`
      );
      return response.data;
    } catch (e) {
      console.error(`Error getting DID Directory`, { e });
      throw e;
    }
  },
  createDIDRequest: async ({
    alias,
    did,
  }: CreateDIDRequestRequest): Promise<CreateDIDRequestResponse> => {
    try {
      const response = await axios.post(
        `${agentApi}/didexchange/create-request?their_public_did=${did}&alias=${alias}&auto_accept=true`
      );

      return response.data;
    } catch (e) {
      console.error(`Error getting payload for ${alias}`, { e });
      throw e;
    }
  },
};
