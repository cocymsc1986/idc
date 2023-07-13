export type Template = {
  id: string;
  name: string;
  value: string;
};

export type CredentialDefinition = {
  credentialDefinition: string;
  issuer: string;
  issuerDID: string;
};

export type Schema = {
  schemaID: string;
  schemaAlias: string;
  trustedCredentialDefinitions: CredentialDefinition[];
};

export type GetSchemasResponse = {
  schema: Schema[];
};

export type GetSchemasDbResponse = {
  id?: string;
  timestamp?: string;
  schemas: GetSchemasResponse;
};

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
