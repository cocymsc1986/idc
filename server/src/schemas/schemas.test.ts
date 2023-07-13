/* eslint-disable @typescript-eslint/unbound-method */
import axios from "axios";

import {
  getSchemas as getSchemasFromDb,
  updateSchemaCache,
  deleteFromSchemaCache,
} from "../db/schemas";

import { getSchemas, getCredentialDefinitions } from "./schemas";

jest.mock("axios", () => ({
  get: jest.fn(),
}));

jest.mock("../db/schemas", () => ({
  getSchemas: jest.fn(),
  updateSchemaCache: jest.fn(),
  deleteFromSchemaCache: jest.fn(),
}));

Date.now = jest.fn(() => 1684627200000); // 21/05/2023 00:00

const schemaResponse = {
  schema: [
    {
      schemaID: "RDmfeHMBEy7w8AQ7KXyGNi:2:RTGSglobal_Participant:1.0",
      schemaAlias: "RTGS.global Participant 1.0",
      trustedCredentialDefinitions: [
        {
          credentialDefinition: "test",
          issuer: "test",
          issuerDID: "test",
        },
      ],
    },
  ],
};

const mockGetSchemasResponse = {
  id: "2276b276-3d09-45af-92af-79c632f0610c",
  timestamp: "2023-05-21T09:16:11.000Z",
  schemas: schemaResponse,
};

const mockStaleGetSchemasResponse = {
  id: "2276b276-3d09-45af-92af-79c632f0610c",
  timestamp: "2023-02-21T09:16:11.000Z",
  schemas: schemaResponse,
};

const mockEmptyGetSchemasResponse = {
  id: "2276b276-3d09-45af-92af-79c632f0610c",
  timestamp: "2023-05-21T09:16:11.000Z",
  schemas: {
    schema: [],
  },
};

describe("schemas", () => {
  describe("getSchemas", () => {
    it("should call getSchemasFromDb for cached data", async () => {
      (getSchemasFromDb as jest.Mock).mockImplementationOnce(
        () => mockGetSchemasResponse
      );
      await getSchemas();

      expect(getSchemasFromDb).toHaveBeenCalled();
    });

    it("should not call api if cached data returned", async () => {
      (getSchemasFromDb as jest.Mock).mockImplementationOnce(
        () => mockGetSchemasResponse
      );
      await getSchemas();

      expect(axios.get).not.toHaveBeenCalled();
    });

    it("should call api if no cached data returned", async () => {
      (axios.get as jest.Mock).mockImplementationOnce(() => ({
        data: schemaResponse,
      }));

      (getSchemasFromDb as jest.Mock).mockImplementationOnce(
        () => mockEmptyGetSchemasResponse
      );

      await getSchemas();

      expect(axios.get).toHaveBeenCalled();
    });

    it("should call delete cache if cached data available but older then 30 days", async () => {
      (axios.get as jest.Mock).mockImplementationOnce(() => ({
        data: schemaResponse,
      }));

      (getSchemasFromDb as jest.Mock).mockImplementationOnce(
        () => mockStaleGetSchemasResponse
      );

      await getSchemas();

      expect(deleteFromSchemaCache).toHaveBeenCalled();
    });

    it("should call updateSchemaCache when fresh data fetched from api", async () => {
      (axios.get as jest.Mock).mockImplementationOnce(() => ({
        data: schemaResponse,
      }));

      (getSchemasFromDb as jest.Mock).mockImplementationOnce(
        () => mockEmptyGetSchemasResponse
      );

      await getSchemas();

      expect(updateSchemaCache).toHaveBeenCalledWith({
        schema: [
          {
            schemaAlias: "RTGS.global Participant 1.0",
            schemaID: "RDmfeHMBEy7w8AQ7KXyGNi:2:RTGSglobal_Participant:1.0",
            trustedCredentialDefinitions: [
              {
                credentialDefinition: "test",
                issuer: "test",
                issuerDID: "test",
              },
            ],
          },
        ],
      });
    });

    it("should return schema data", async () => {
      (getSchemasFromDb as jest.Mock).mockImplementationOnce(
        () => mockGetSchemasResponse
      );
      const result = await getSchemas();

      expect(result).toEqual([
        {
          id: "RDmfeHMBEy7w8AQ7KXyGNi:2:RTGSglobal_Participant:1.0",
          name: "RTGS.global Participant 1.0",
        },
      ]);
    });

    describe("with refreshCache = true", () => {
      it("should call delete cache if cached data available", async () => {
        (axios.get as jest.Mock).mockImplementationOnce(() => ({
          data: schemaResponse,
        }));

        (getSchemasFromDb as jest.Mock).mockImplementationOnce(
          () => mockGetSchemasResponse
        );

        await getSchemas(true);

        expect(deleteFromSchemaCache).toHaveBeenCalled();
      });

      it("should call api ", async () => {
        (axios.get as jest.Mock).mockImplementationOnce(() => ({
          data: schemaResponse,
        }));

        (getSchemasFromDb as jest.Mock).mockImplementationOnce(
          () => mockGetSchemasResponse
        );

        await getSchemas(true);

        expect(axios.get).toHaveBeenCalled();
      });

      it("should call updateSchemaCache when fresh data fetched from api", async () => {
        (axios.get as jest.Mock).mockImplementationOnce(() => ({
          data: schemaResponse,
        }));

        (getSchemasFromDb as jest.Mock).mockImplementationOnce(
          () => mockGetSchemasResponse
        );

        await getSchemas(true);

        expect(updateSchemaCache).toHaveBeenCalled();
      });
    });
  });

  describe("getCredentialDefinitions", () => {
    it("should call getSchemasFromDb for cached data", async () => {
      (getSchemasFromDb as jest.Mock).mockImplementationOnce(
        () => mockGetSchemasResponse
      );
      await getCredentialDefinitions(
        "RDmfeHMBEy7w8AQ7KXyGNi:2:RTGSglobal_Participant:1.0"
      );

      expect(getSchemasFromDb).toHaveBeenCalled();
    });

    it("should not call api if cached data returned", async () => {
      (getSchemasFromDb as jest.Mock).mockImplementationOnce(
        () => mockGetSchemasResponse
      );
      await getCredentialDefinitions(
        "RDmfeHMBEy7w8AQ7KXyGNi:2:RTGSglobal_Participant:1.0"
      );

      expect(axios.get).not.toHaveBeenCalled();
    });

    it("should call api if no cached data returned", async () => {
      (axios.get as jest.Mock).mockImplementationOnce(() => ({
        data: schemaResponse,
      }));

      (getSchemasFromDb as jest.Mock).mockImplementationOnce(
        () => mockEmptyGetSchemasResponse
      );

      await getCredentialDefinitions(
        "RDmfeHMBEy7w8AQ7KXyGNi:2:RTGSglobal_Participant:1.0"
      );

      expect(axios.get).toHaveBeenCalled();
    });

    it("should call delete cache if cached data available but older then 30 days", async () => {
      (axios.get as jest.Mock).mockImplementationOnce(() => ({
        data: schemaResponse,
      }));

      (getSchemasFromDb as jest.Mock).mockImplementationOnce(
        () => mockStaleGetSchemasResponse
      );

      await getCredentialDefinitions(
        "RDmfeHMBEy7w8AQ7KXyGNi:2:RTGSglobal_Participant:1.0"
      );

      expect(deleteFromSchemaCache).toHaveBeenCalled();
    });

    it("should call updateSchemaCache when fresh data fetched from api", async () => {
      (axios.get as jest.Mock).mockImplementationOnce(() => ({
        data: schemaResponse,
      }));

      (getSchemasFromDb as jest.Mock).mockImplementationOnce(
        () => mockEmptyGetSchemasResponse
      );

      await getCredentialDefinitions(
        "RDmfeHMBEy7w8AQ7KXyGNi:2:RTGSglobal_Participant:1.0"
      );

      expect(updateSchemaCache).toHaveBeenCalledWith({
        schema: [
          {
            schemaAlias: "RTGS.global Participant 1.0",
            schemaID: "RDmfeHMBEy7w8AQ7KXyGNi:2:RTGSglobal_Participant:1.0",
            trustedCredentialDefinitions: [
              {
                credentialDefinition: "test",
                issuer: "test",
                issuerDID: "test",
              },
            ],
          },
        ],
      });
    });

    it("should return credentials data", async () => {
      (getSchemasFromDb as jest.Mock).mockImplementationOnce(
        () => mockGetSchemasResponse
      );

      const result = await getCredentialDefinitions(
        "RDmfeHMBEy7w8AQ7KXyGNi:2:RTGSglobal_Participant:1.0"
      );

      expect(result).toEqual([
        {
          id: "test",
          name: "test",
        },
      ]);
    });

    describe("with refreshCache = true", () => {
      it("should call delete cache if cached data available", async () => {
        (axios.get as jest.Mock).mockImplementationOnce(() => ({
          data: schemaResponse,
        }));

        (getSchemasFromDb as jest.Mock).mockImplementationOnce(
          () => mockGetSchemasResponse
        );

        await getCredentialDefinitions(
          "RDmfeHMBEy7w8AQ7KXyGNi:2:RTGSglobal_Participant:1.0",
          true
        );

        expect(deleteFromSchemaCache).toHaveBeenCalled();
      });

      it("should call api ", async () => {
        (axios.get as jest.Mock).mockImplementationOnce(() => ({
          data: schemaResponse,
        }));

        (getSchemasFromDb as jest.Mock).mockImplementationOnce(
          () => mockGetSchemasResponse
        );

        await getCredentialDefinitions(
          "RDmfeHMBEy7w8AQ7KXyGNi:2:RTGSglobal_Participant:1.0",
          true
        );

        expect(axios.get).toHaveBeenCalled();
      });

      it("should call updateSchemaCache when fresh data fetched from api", async () => {
        (axios.get as jest.Mock).mockImplementationOnce(() => ({
          data: schemaResponse,
        }));

        (getSchemasFromDb as jest.Mock).mockImplementationOnce(
          () => mockGetSchemasResponse
        );

        await getCredentialDefinitions(
          "RDmfeHMBEy7w8AQ7KXyGNi:2:RTGSglobal_Participant:1.0",
          true
        );

        expect(updateSchemaCache).toHaveBeenCalled();
      });
    });
  });
});
