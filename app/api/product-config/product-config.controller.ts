import { NextRequest } from "next/server";
import { ProductConfig } from "./product-config.types";
import { generateResponseJSON, Response } from "@/lib/middleware/response-generator";
import { StatusCodes } from "http-status-codes";
import getMessage from "@/utils/messages";
import { addProductConfig } from "./product-config.model";
import { alterEmployeesTable } from "../employees/employee-model";

export const addProductConfigController = async (
    _request: NextRequest,
    reqBody: ProductConfig
): Promise<Response<ProductConfig>> => {
    try {

        const { name, data_type, is_required} = reqBody;

        const requestBodyKeys: string[] = Object.keys(reqBody);
        const requestBodyValues: any[] = Object.values(reqBody);
    
        const columns: string[] = [...requestBodyKeys];
        const values: any[] = [...requestBodyValues];
        const placeholders: string = columns.map((_, i) => `$${i + 1}`).join(", ");
    
        await addProductConfig(columns, values, placeholders);

        await alterEmployeesTable(name, data_type, is_required);
    
        return generateResponseJSON(
            StatusCodes.CREATED,
            getMessage('PRODUCT_CONFIG_CREATED_SUCCESSFULLY'), 
        );
    } catch (error: any) {
        return generateResponseJSON(
            StatusCodes.INTERNAL_SERVER_ERROR,
            error.message,
            error,
        );
    }
} 