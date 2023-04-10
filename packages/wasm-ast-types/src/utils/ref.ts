import { JSONSchema } from "../types";

export const refLookup = ($ref: string, schema: JSONSchema) => {
  const refName = $ref.replace('#/definitions/', '')
  return schema.definitions?.[refName];
}