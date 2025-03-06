import { NextRequest } from "next/server";
import { Employee, UpdateEmployee } from "./employee-types";
import { generateResponseJSON, Response } from "@/lib/middleware/response-generator";
import { addUser, findEmployeeByEmail, findEmployeeById, findEmployeeByName, updateEmployee } from "./employee-model";
import { StatusCodes } from "http-status-codes";
import getMessage from "@/utils/messages";
import { Params } from "@/lib/middleware/comman-types";

export const addEmployeeController  = async ( 
    _req: NextRequest,
    reqBody: Employee
): Promise<Response<Employee>> => {
    try {
        const {name, email, } = reqBody;

        const employeeName: Employee | undefined = await findEmployeeByName(name);
        if (employeeName) {
            return generateResponseJSON(
                StatusCodes.BAD_REQUEST,
                getMessage('EMPLOYEE_NAME_ALREADY_EXISTS'),
            );
        }

        const employeeEmail: Employee | undefined = await findEmployeeByEmail(email);        
        if (employeeEmail) {
            return generateResponseJSON(
                StatusCodes.BAD_REQUEST,
                getMessage('EMPLOYEE_EMAIL_ALREADY_EXISTS'),
            );
        }

        const addDate = new Date();
        const requestBodyKeys: string[] = Object.keys(reqBody);
        const requestBodyValues: any[] = Object.values(reqBody);

        const columns: string[] = [...requestBodyKeys, 'created_at'];
        const values: any[] = [...requestBodyValues, addDate];
        const placeholders: string = columns.map((_, i) => `$${i + 1}`).join(", ");

        await addUser(columns, values, placeholders);

        return generateResponseJSON(
            StatusCodes.CREATED,
            getMessage('EMPLOYEE_CREATED_SUCCESSFULLY'), 
        );

    } catch (error: any) {
        return generateResponseJSON(
            StatusCodes.INTERNAL_SERVER_ERROR,
            error.message,
            error,
        );
    }
}

export const updateEmployeeController  = async ( 
    req: NextRequest,
    params: Params,
    reqBody: UpdateEmployee
)   : Promise<Response<Employee>> => {
    try {
        const { id } = params;

        const updatedPayload = reqBody;
        
        const employee = await findEmployeeById(id);
        if (!employee) {
            return generateResponseJSON(
                StatusCodes.NOT_FOUND,
                getMessage('EMPLOYEE_NOT_FOUND'),
            );
        }

        const setClauses: string = Object.keys(updatedPayload)
            .map((key, index) => `"${key}" = $${index + 2}`)
            .join(', ');

        const updateValues: unknown[] = [id, ...Object.values(updatedPayload)];
        
        await updateEmployee(setClauses, updateValues);

        return generateResponseJSON(
            StatusCodes.OK,
            getMessage('EMPLOYEE_UPDATED_SUCCESSFULLY'), 
        );

    } catch (error: any) {
        return generateResponseJSON(
            StatusCodes.INTERNAL_SERVER_ERROR,
            error.message,
            error,
        );
    }
}