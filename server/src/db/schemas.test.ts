import { query } from "./";
import {
  getSchemas,
  updateSchemaCache,
  deleteFromSchemaCache,
} from "./schemas";

const schema = {
  schemaID: "test-1",
  schemaAlias: "alias-1",
  trustedCredentialDefinitions: [
    {
      credentialDefinition: "def-1",
      issuer: "issuer-1",
      issuerDID: "issuer-id-1",
    },
  ],
};

jest.mock("./", () => ({
  query: jest.fn(() => ({
    rows: [
      {
        schema: [schema],
      },
    ],
  })),
}));

describe("schemas", () => {
  describe("getSchemas", () => {
    it("should return all schemas", async () => {
      const result = await getSchemas();

      expect(query).toHaveBeenCalledWith("SELECT * from schemas");
      expect(result).toEqual({
        schema: [
          {
            schemaAlias: "alias-1",
            schemaID: "test-1",
            trustedCredentialDefinitions: [
              {
                credentialDefinition: "def-1",
                issuer: "issuer-1",
                issuerDID: "issuer-id-1",
              },
            ],
          },
        ],
      });
    });
  });

  describe("deleteFromSchemaCache", () => {
    it("should call query with expected statement and not throw", async () => {
      await deleteFromSchemaCache("test-id");

      expect(query).toHaveBeenCalledWith("DELETE from schemas WHERE id = $1", [
        "test-id",
      ]);
    });
  });

  describe("updateSchemaCache", () => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const RealDateToUTC = global.Date.prototype.toUTCString;

    beforeEach(() => {
      global.Date.prototype.toUTCString = () => "Mon, 10 Jul 2023 14:09:26 GMT";
    });

    afterEach(() => {
      global.Date.prototype.toUTCString = RealDateToUTC;
    });

    it("should call query with correct statement and return items from db", async () => {
      const body = {
        schema: [schema],
      };

      const result = await updateSchemaCache(body);

      expect(query).toHaveBeenCalledWith(
        "INSERT INTO schemas(schemas, timestamp) VALUES($1, $2)",
        [body, "Mon, 10 Jul 2023 14:09:26 GMT"]
      );
      expect(result).toEqual(body);
    });
  });
});
