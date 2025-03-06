import pool from "@/lib/db";
import { ProductConfig } from "./product-config.types";

export const addProductConfig = async (
    columns: string[],
    values: any[],
    placeholders: string
  ):Promise<ProductConfig> => {
    try {
      const queryText: string = `
        INSERT INTO "product_config" (${columns.join(", ")})
        VALUES (${placeholders})
        RETURNING *
      `;
    
        const result = await pool.query(queryText, values);
    
        return result.rows[0];
    } catch (error) {
        throw new Error(`Error adding user: ${error}`);
    }
} 