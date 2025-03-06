import { Params } from "@/lib/middleware/comman-types";
import validationMiddleware from "@/lib/middleware/validation";
import { NextRequest, NextResponse } from "next/server";
import { UpdateEmployee } from "../employee-types";
import { UpdateEmployeeParamsSchema, UpdateEmployeeSchema } from "../employee-validation";
import { Response } from "@/lib/middleware/response-generator";
import { updateEmployeeController } from "../employee-controller";


export const PATCH = async (
    request: NextRequest,
    { params }: { params: Params }
): Promise<NextResponse> => {

    const { reqBody, response } = await validationMiddleware<UpdateEmployee>(
        request,
        { 
            params: UpdateEmployeeParamsSchema,
            body: UpdateEmployeeSchema
        },
        params
    );

    if (response) return response;

    const {status, ...responseData}: Response<UpdateEmployee> = await updateEmployeeController(
        request, params, reqBody
    );

    return NextResponse.json(responseData, { status });
};