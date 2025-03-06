import { JSONSchemaType } from "ajv";
import { ProductConfig } from "./product-config.types";
import { dataTypes } from "@/utils/enum";

export const productConfigSchema: JSONSchemaType<ProductConfig> = {
    type: "object",
    properties: {
      name: { type: "string" },
      data_type: { type: "string", enum: [...dataTypes] },
      is_required: { type: "boolean" }
    },
    required: ["name", "data_type", "is_required"],
    additionalProperties: false
  };