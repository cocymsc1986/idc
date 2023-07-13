/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { query } from "./";
import { GetSchemasDbResponse, GetSchemasResponse, Schema } from "../../types";

const getSchemas = async (): Promise<GetSchemasDbResponse> => {
  const text = "SELECT * from schemas";
  try {
    console.info("DB: Getting schemas from db");

    const res = await query(text);

    if (res.rows.length === 0) {
      return { schemas: { schema: [] } };
    }

    return res.rows[0] as GetSchemasDbResponse;
  } catch (err: any) {
    console.error("DB: Error getting schemas from db: ", err.stack);
    throw new Error(err.stack);
  }
};

const deleteFromSchemaCache = async (id: string) => {
  try {
    const text = "DELETE from schemas WHERE id = $1";

    const values = [id];
    await query(text, values);

    console.info(`DB: Successfully deleted item ${id}`);
  } catch (err: any) {
    console.error("DB: Error deleting schema from db: ", err.stack);
    throw new Error(err.stack);
  }
};

const updateSchemaCache = async (payload: GetSchemasResponse) => {
  try {
    console.info("DB: Saving schemas to db");

    await query("INSERT INTO schemas(schemas, timestamp) VALUES($1, $2)", [
      payload,
      new Date().toUTCString(),
    ]);

    const { rows } = await query("SELECT * FROM schemas");

    return rows[0] as Schema[];
  } catch (err: any) {
    console.error("DB: Error saving schemas to db: ", err.stack);
    throw new Error(err.stack);
  }
};

export { deleteFromSchemaCache, getSchemas, updateSchemaCache };
