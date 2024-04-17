import { JSONSchema } from "@cosmology/ts-codegen-types";

export const refLookup = ($ref: string, schema: JSONSchema): JSONSchema => {
  const refName = $ref.replace('#/definitions/', '')
  return schema.definitions?.[refName];
}