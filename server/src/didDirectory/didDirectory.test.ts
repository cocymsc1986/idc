import nock from "nock";

import { getDidDirectory } from "./didDirectory";

const apiUrl = process.env.DID_DIRECTORY_API_URL || "";

describe("Did directory", () => {
  it("should throw when no data in the response", async () => {
    nock(`${apiUrl}`).get("/get-IDCDID-Directory").reply(200);

    const error = new Error(
      "Error getting DID Directory Error: No data returned for getting DID Directory"
    );

    await expect(async () => {
      await getDidDirectory();
    }).rejects.toThrow(error);
  });

  it("should throw when no listing in data response", async () => {
    nock(`${apiUrl}`).get("/get-IDCDID-Directory").reply(200, {});

    const error = new Error(
      "Error getting DID Directory Error: No data found for getting DID Directory"
    );

    await expect(async () => {
      await getDidDirectory();
    }).rejects.toThrow(error);
  });

  it("should return data", async () => {
    nock(`${apiUrl}`)
      .get("/get-IDCDID-Directory")
      .reply(200, {
        listing: [
          {
            name: "test-name",
            did: "test-did",
          },
        ],
      });

    const result = await getDidDirectory();

    expect(result).toEqual({
      listing: [
        {
          name: "test-name",
          did: "test-did",
        },
      ],
    });
  });
});
