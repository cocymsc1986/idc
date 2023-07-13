import { query } from "./";

const createTemplatesTableText = `
    CREATE TABLE IF NOT EXISTS "templates" (
	    "id" VARCHAR(100) NOT NULL,
	    "name" VARCHAR(100) NOT NULL,
	    "value" VARCHAR(65535) NOT NULL,
	    PRIMARY KEY ("id")
    );`;

const createTemplatesTable = async (): Promise<void> => {
  try {
    console.info("Creating templates table...");

    await query(createTemplatesTableText);

    console.info("Templates table created successfully");
  } catch (err: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.error("Error creating templates table: ", err.stack);
  }
};

const createSchemasTableText = `
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    CREATE TABLE IF NOT EXISTS "schemas" (
	    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      timestamp TIMESTAMP,
      schemas JSONB
    );`;

const createSchemasTable = async (): Promise<void> => {
  try {
    console.info("Creating schemas table...");

    await query(createSchemasTableText);

    console.info("Schemas table created successfully");
  } catch (err: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.error("Error creating schemas table: ", err.stack);
  }
};

export { createTemplatesTable, createSchemasTable };
