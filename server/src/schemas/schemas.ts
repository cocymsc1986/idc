/* eslint-disable @typescript-eslint/restrict-template-expressions */
import axios from "axios";

import {
  getSchemas as getSchemasFromDb,
  deleteFromSchemaCache,
  updateSchemaCache,
} from "../db/schemas";

import { GetSchemasResponse, Schema } from "../../types";
import { MAX_CACHE_AGE_IN_MS } from "../../consts";

const apiUrl = process.env.DID_DIRECTORY_API_URL;

const mapSchemasResponse = (data: Schema[]): { name: string; id: string }[] => {
  const mappedResponse = data.map((schema) => ({
    name: schema.schemaAlias,
    id: schema.schemaID,
  }));

  return mappedResponse;
};

const mapDefIds = (schema: Schema) =>
  schema.trustedCredentialDefinitions.map((definition) => ({
    name: definition.credentialDefinition,
    id: definition.credentialDefinition,
  }));

const getCachedSchemasFromDb = async (
  refreshCache: boolean
): Promise<GetSchemasResponse | null> => {
  try {
    // get from db
    const response = await getSchemasFromDb();

    const { id, timestamp, schemas } = response;

    if (schemas.schema.length && timestamp) {
      const cacheTimestamp = new Date(timestamp).getTime();

      if (!refreshCache) {
        // check timestamp is less than 30 days old
        if (Date.now() - cacheTimestamp < MAX_CACHE_AGE_IN_MS) {
          console.info("Cache is less than 30 days old, returning cached data");

          return schemas;
        }
      }
      if (id) {
        console.info("Fetching from api, deleting cache");
        try {
          await deleteFromSchemaCache(id);
          console.info("Cache deleted successfully");
        } catch (e) {
          console.error("Error deleting old cache", { e });
        }
      }
    }

    console.info(
      "No cached schemas or cache is older than 30 days, not getting data from cache"
    );

    return null;
  } catch (e) {
    console.error("api: Error getting schemas from db", { e });
    throw new Error("api: Error getting schemas from db");
  }
};

const getSchemas = async (
  refreshCache = false
): Promise<{ name: string; id: string }[]> => {
  console.info("Getting schemas from db (cached)");

  const cachedData = await getCachedSchemasFromDb(refreshCache);

  if (cachedData) {
    const mappedData = mapSchemasResponse(cachedData.schema);
    return mappedData;
  }

  try {
    console.info("Getting schemas from api");
    const response = await axios.get(`${apiUrl}/get-Trusted-CredDefinitions`, {
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.OCP_APIM_SUBSCRIPTION_KEY,
      },
    });

    if (!response.data) {
      console.error("No schema data returned");
      throw new Error("No schema data returned");
    }

    const data = response.data as GetSchemasResponse;
    // update db cache
    await updateSchemaCache(data);

    const mappedData = mapSchemasResponse(data.schema);

    console.info("Successfully retrieved schemas");
    return mappedData;
  } catch (e) {
    console.error("Error getting schemas", { e });
    throw new Error(`Error getting schemas ${e}`);
  }
};

const getCredentialDefinitions = async (
  schemaId: string,
  refreshCache = false
): Promise<{ name: string; id: string }[]> => {
  console.info("Getting credential definitions from db (cached)");

  const cachedData = await getCachedSchemasFromDb(refreshCache);

  if (cachedData?.schema) {
    const schema = cachedData.schema.find(
      (schema) => schema.schemaID === schemaId
    );

    if (schema) {
      const defIds = mapDefIds(schema);
      return defIds;
    }

    console.error(
      "No schema data found for getting credential definitions in cache, attempting to get from api"
    );
  }

  try {
    console.info("Getting credential definitions from api");
    const response = await axios.get(`${apiUrl}/get-Trusted-CredDefinitions`, {
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.OCP_APIM_SUBSCRIPTION_KEY,
      },
    });

    if (!response.data) {
      console.error(
        "No schema data returned for getting credential definitions"
      );
      throw new Error(
        "No schema data returned for getting credential definitions"
      );
    }

    const data = response.data as GetSchemasResponse;

    await updateSchemaCache(data);

    const schema = data.schema.find((schema) => schema.schemaID === schemaId);

    if (!schema) {
      console.error("No schema data found for getting credential definitions");
      throw new Error(
        "No schema data found for getting credential definitions"
      );
    }

    const defIds = mapDefIds(schema);

    console.info("Successfully retrieved credential definitions");
    return defIds;
  } catch (e) {
    console.error("Error getting schemas", { e });
    throw new Error(`Error getting schemas ${e}`);
  }
};

export { getCredentialDefinitions, getSchemas };
