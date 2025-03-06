import { JSONSchemaType } from "ajv";
import { roles } from "@/utils/enum";
// import ajvInstance from "@/lib/ajv";
import ajv from "@/lib/ajv";
import ajvInstance from "@/lib/ajv";
import { Employee, UpdateEmployee } from "./employee-types";
import { ProductConfig } from "../product-config/product-config.types";
import pool from "@/lib/db";

// type EmployeeInput = Omit<Employee, "id">; 

// const employeeSchema: JSONSchemaType<EmployeeInput> = {
//   type: "object",
//   properties: {
//     name: { type: "string", minLength: 1 },
//     email: { type: "string", format: "email" },
//     role: { type: "string", enum: [...roles] },
//     is_active: { type: "boolean" }
//   },
//   required: ["name", "email", "role"],
//   additionalProperties: false
// };

// export const validateEmployee = ajv.compile(employeeSchema);

ajvInstance.addKeyword({
  keyword: "nameLength",
  type: "string",
  validate: (_schema: any, data: string) => {
    return typeof data === "string" && data.length > 4;
  }
});

ajvInstance.addKeyword({
  keyword: "emailCheck",
  type: 'string',
  validate: (_schema: any, data: string) => {
    return typeof data === "string" && data.endsWith("@yahoo.com");
  }
})

ajvInstance.addKeyword({
  keyword: "isActiveCheck",
  type: 'boolean',
  validate: (_schema: any, data: boolean) => {
    return typeof data === "boolean" && data === true;
  },
})

ajvInstance.addFormat("strong-password", {
  validate: (password: string) => /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)
});

// export const employeeSchema: JSONSchemaType<Employee> = {
//   type: "object",
//   properties: {
//     name: { type: "string", minLength: 4 },
//     email: { type: "string" },
//     role: { type: "string", enum: [...roles] },
//     is_active: { type: "boolean", nullable: true },
//     password: { type: "string" }
//   },
//   required: ["name", "email", "role", "password"],
//   additionalProperties: false
// };

// export const generateEmployeeSchema = async (): Promise<JSONSchemaType<Employee>> => {
//   const result = await pool.query(`SELECT name, data_type, is_required FROM product_config`);
//   const dynamicProperties: any = {};

//   result.rows.forEach((field: ProductConfig) => {
//       let type: any;

//       switch (field.data_type) {
//           case "string":
//               type = "string";
//               break;
//           case "number":
//               type = "integer";
//               break;
//           case "boolean":
//               type = "boolean";
//               break;
//           default:
//               throw new Error(`Unsupported data type: ${field.data_type}`);
//       }

//       dynamicProperties[field.name] = { type };
//   });

//   return {
//       type: "object",
//       properties: {
//           name: { type: "string" },
//           email: { type: "string" },
//           role: { type: "string", enum: [...roles] },
//           is_active: { type: "boolean", nullable: true },
//           password: { type: "string" },
//           ...dynamicProperties,
//       },
//       required: ["name", "email", "role", "password", ...result.rows.filter(f => f.is_required).map(f => f.name)],
//       additionalProperties: false
//   };
// };

export const generateEmployeeSchema = async (): Promise<JSONSchemaType<Employee>> => {
  const result = await pool.query(`SELECT name, data_type, is_required FROM product_config`);
  const dynamicProperties: any = {};

  result.rows.forEach((field: ProductConfig) => {
      let type: "string" | "integer" | "boolean";

      switch (field.data_type) {
          case "string":
              type = "string";
              break;
          case "number":
              type = "integer";
              break;
          case "boolean":
              type = "boolean";
              break;
          default:
              throw new Error(`Unsupported data type: ${field.data_type}`);
      }

      dynamicProperties[field.name] = { type };
  });

  return {
      type: "object",
      properties: {
          name: { type: "string" },
          email: { type: "string" }, // Enforce email format
          role: { type: "string", enum: [...roles] },
          is_active: { type: "boolean", nullable: true },
          password: { type: "string", minLength: 6 }, // Enforce password length
          ...dynamicProperties,
      },
      required: ["name", "email", "role", "password", ...result.rows.filter(f => f.is_required).map(f => f.name)],
      additionalProperties: false
  };
};



export const UpdateEmployeeSchema: JSONSchemaType<UpdateEmployee> = {
  type: "object",
  properties: {
    name: { type: "string", minLength: 4, nullable: true },
    email: { type: "string", nullable: true },
    role: { type: "string", enum: [...roles], nullable: true },
    is_active: { type: "boolean", nullable: true }
  },
  required: [], 
  additionalProperties: false
};

export const UpdateEmployeeParamsSchema: JSONSchemaType<{ id: string }> = {
  type: "object",
  properties: {
    id: { type: "string" }
  },
  required: ["id"],
  additionalProperties: false
}


// export const employeeSchema = {
//   properties: {
//     name: { type: "string" },
//     email: { type: "string" },
//     role: { enum: roles },
//     password: { type: "string" } 
//   },
//   optionalProperties: {
//     is_active: { type: "boolean" },
//   },
//   additionalProperties: false
// } as const;

// export const validateEmployee = ajv.compile(employeeSchema);