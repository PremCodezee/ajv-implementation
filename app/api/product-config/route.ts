import { Response } from "@/lib/middleware/response-generator";
import validationMiddleware from "@/lib/middleware/validation";
import { NextRequest, NextResponse } from "next/server";
import { ProductConfig } from "./product-config.types";
import { addProductConfigController } from "./product-config.controller";
import { productConfigSchema } from "./product-config.validation";

export const POST = async (
    request: NextRequest
): Promise<NextResponse> => {
    const { reqBody, response } = await validationMiddleware<ProductConfig>(request, { body: productConfigSchema });

    if (response) return response;

    const {status, ...responseData}: Response<ProductConfig> = await addProductConfigController(request, reqBody);

    return NextResponse.json(responseData, { status });
};
