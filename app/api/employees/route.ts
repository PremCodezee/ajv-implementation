import { NextRequest, NextResponse } from "next/server";
import {  generateEmployeeSchema } from "./employee-validation";
import { Employee } from "./employee-types";
import validationMiddleware from "@/lib/middleware/validation";
import { Response } from "@/lib/middleware/response-generator";
import { addEmployeeController } from "./employee-controller";

export const POST = async (
    request: NextRequest
): Promise<NextResponse> => {

    const employeeSchema = await generateEmployeeSchema(); // Fetch updated schema


    const { reqBody, response } = await validationMiddleware<Employee>(request, { body: await generateEmployeeSchema()  });

    if (response) return response;

    const {status, ...responseData}: Response<Employee> = await addEmployeeController(request, reqBody);

    return NextResponse.json(responseData, { status });
};
