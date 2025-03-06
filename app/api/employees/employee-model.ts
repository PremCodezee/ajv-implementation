import pool from "@/lib/db";
import { Employee } from "./employee-types";

export const addUser = async (
    columns: string[],
    values: string[],
    placeholders: string
  ): Promise<Employee> => {
    try {
      const queryText: string = `
        INSERT INTO "employees" (${columns.join(", ")})
        VALUES (${placeholders})
        RETURNING *
        `;
  
      const result = await pool.query(queryText, values);
  
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error adding user: ${error}`);
    }
};

export const findEmployeeByName =  async (
    name: string
): Promise<Employee | undefined> => {
    try {
      const queryText: string = `
        SELECT *
        FROM "employees"
        WHERE "name" = $1
        `;
  
      const result = await pool.query(queryText, [name]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error finding employee by name: ${error}`);
    }
};

export const findEmployeeByEmail =  async (
    email: string
): Promise<Employee | undefined> => {
    try {
      const queryText: string = `
        SELECT *
        FROM "employees"
        WHERE "email" = $1
        `;
  
      const result = await pool.query(queryText, [email]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error finding employee by email: ${error}`);
    }
};

export const findEmployeeById =  async (
    id: string
): Promise<Employee | undefined> => {
    try {
      const queryText: string = `
        SELECT *
        FROM "employees"
        WHERE "id" = $1
        `;
  
      const result = await pool.query(queryText, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error finding employee by id: ${error}`);
    }
};

export const updateEmployee =  async (
    setClauses: string,
    updateValues: unknown[]
): Promise<Employee> => {
    try {
      const queryText: string = `
        UPDATE "employees"
        SET ${setClauses},
          updated_at = NOW()
        WHERE "id" = $1
        RETURNING *
        `;
  
      const result = await pool.query(queryText, updateValues);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating employee: ${error}`);
    }
};

export const alterEmployeesTable = async (columnName: string, dataType: string, isRequired: boolean) => {
  try {
      let columnType: string;

      // Map data_type to PostgreSQL column types
      switch (dataType) {
          case "string":
              columnType = "TEXT";
              break;
          case "number":
              columnType = "INTEGER";
              break;
          case "boolean":
              columnType = "BOOLEAN";
              break;
          case "date":
              columnType = "TIMESTAMP";
              break;
          default:
              throw new Error(`Unsupported data type: ${dataType}`);
      }

      // Construct the ALTER TABLE query
      const alterQuery = `
          ALTER TABLE employees 
          ADD COLUMN "${columnName}" ${columnType} ${isRequired ? "NOT NULL" : "NULL"};
      `;

      await pool.query(alterQuery);
  } catch (error) {
      throw new Error(`Error altering employees table: ${error}`);
  }
};
