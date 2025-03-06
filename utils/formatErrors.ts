import { ErrorObject } from "ajv";

// export function formatAjvErrors(errors: ErrorObject[] | null | undefined): string[] {
//   if (!errors) return [];
//   return errors.map((err) => `${err.instancePath} ${err.message}`).filter(Boolean);
// }
export function formatAjvErrors(errors: ErrorObject[] | null | undefined) {
  if (!errors) return [];
  return errors.map(err => ({
    path: err.instancePath || err.schemaPath,
    message: err.message || `Validation failed for ${err.keyword}`
  }));
}
