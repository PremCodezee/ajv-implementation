import { StatusCodes } from 'http-status-codes';
import { type NextRequest, NextResponse } from 'next/server';
import Ajv, { ErrorObject, JSONSchemaType, ValidateFunction } from 'ajv';
import { generateResponseJSON, Response } from '@/lib/middleware/response-generator';
import getMessage from '@/utils/messages';
import { Params } from './comman-types';


const ajv = new Ajv({ allErrors: true, coerceTypes: true });

/**
 * Formats AJV errors into a readable format
 */
const formatAjvErrors = (errors: ErrorObject[] | null | undefined) => {
  if (!errors) return {};
  return errors.reduce<Record<string, string>>((acc, err) => {
    const path = err.instancePath.replace(/^\//, ''); // Remove leading slash
    acc[path || err.keyword] = err.message || 'Invalid value';
    return acc;
  }, {});
};

/**
 * Validates data against the provided JSON schema
 */
const validate = <T>(schema: JSONSchemaType<T>, data: any): T => {
  const validateFn: ValidateFunction<T> = ajv.compile(schema);
  if (!validateFn(data)) {
    console
    throw new Error(JSON.stringify(formatAjvErrors(validateFn.errors)));
  }
  return data;
};

/**
 * Middleware to validate request data based on HTTP method
 */
const validationMiddleware = async <T>(
  request: NextRequest,
  validationSchema: {
    body?: JSONSchemaType<T>;
    query?: JSONSchemaType<any>;
    params?: JSONSchemaType<Params>;
  },
  params?: object
): Promise<{ reqBody: T; response?: NextResponse }> => {
  try {
    const { searchParams } = request.nextUrl;
    const method: string = request.method.toUpperCase();

    let reqBody: T | undefined;
    const data: Record<string, any> = {
      body: {},
      query: Object.fromEntries(searchParams.entries()),
      params: params || {},
    };

    // Determine request data based on method
    if (['POST', 'PATCH'].includes(method)) {
      reqBody = (await request.json()) as T;
      data.body = reqBody;
    }

    // Validate request data
    if (validationSchema.body) validate(validationSchema.body, data.body);
    if (validationSchema.query) validate(validationSchema.query, data.query);
    if (validationSchema.params) validate(validationSchema.params, data.params);

    return { reqBody: data.body };
  } catch (error: any) {
    const errorData: Record<string, string> =
      error.message?.startsWith('{') ? JSON.parse(error.message) : { error_message: error.message };

    // Generate error response
    const { status, ...errorResponse }: Response<Record<string, string>> = generateResponseJSON(
      StatusCodes.BAD_REQUEST,
      getMessage('VALIDATION_ERROR'),
      errorData
    );

    return {
      reqBody: null as any,
      response: NextResponse.json(errorResponse, { status }),
    };
  }
};

export default validationMiddleware;
