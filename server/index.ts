import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { createTemplatesTable, createSchemasTable } from "./src/db/createTable";
import {
  getTemplateById,
  getTemplates,
  createTemplate,
  deleteTemplateById,
} from "./src/db/templates";
import { getCredentialDefinitions, getSchemas } from "./src/schemas/schemas";

import { getDidDirectory } from "./src/didDirectory/didDirectory";

import { Template } from "./types";
import { deleteFromSchemaCache } from "./src/db/schemas";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 5000;

createTemplatesTable()
  .then()
  .catch(() => console.error("Error creating templates table"));

createSchemasTable()
  .then()
  .catch(() => console.error("Error creating schemas table"));

app.get("/templates", (_req, res) => {
  getTemplates()
    .then((templates) => res.send(templates))
    .catch((e) => res.send(e));
});

app.post("/templates", (req, res) => {
  const { id, name, value } = req.body as Template;

  if (!id || !name || !value) {
    res.sendStatus(400);
  }

  createTemplate({ id, name, value })
    .then((template) => res.send(template))
    .catch((e) => res.send(e));
});

app.get("/templates/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.sendStatus(400);
  }

  getTemplateById(id)
    .then((template) => res.send(template))
    .catch((e) => res.send(e));
});

app.delete("/templates/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.sendStatus(400);
  }

  deleteTemplateById(id)
    .then((template) => res.send(template))
    .catch((e) => res.send(e));
});

app.get("/schemas", (req, res) => {
  const { refreshCache } = req.query;

  getSchemas(refreshCache === "true")
    .then((schemas) => res.send(schemas))
    .catch((e) => res.send(e));
});

app.delete("/schemas/:id", (req, res) => {
  const { id } = req.params as { id: string };
  console.info(`received delete request for cached schema ${id}`);

  deleteFromSchemaCache(id)
    .then(() => res.send())
    .catch((e) => res.send(e));
});

app.get("/schemas/credential-definitions/:id", (req, res) => {
  const { id } = req.params;
  const { refreshCache } = req.query;

  if (!id) {
    res.sendStatus(400);
  }

  getCredentialDefinitions(id, refreshCache === "true")
    .then((credentialDefinitions) => res.send(credentialDefinitions))
    .catch((e) => res.send(e));
});

app.get("/did-directory/get-did-directory", (_req, res) => {
  getDidDirectory()
    .then((dids) => res.send(dids))
    .catch((e) => res.send(e));
});

app.listen(port, () => {
  console.log(`Server app listening on port ${port}`);
});
