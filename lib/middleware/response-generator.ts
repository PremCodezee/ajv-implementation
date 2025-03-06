import { StatusCodes } from "http-status-codes";
import { DeepPartial } from "./comman-types";

export interface SuccessResponse<T> {
    status: number;
    message: string;
    data: T | null;
  }
  
  export interface ErrorResponse<T> {
    status: number;
    message: string;
    error: DeepPartial<T> | null;
  }

  export type Response<T> = SuccessResponse<T> | ErrorResponse<T>;

  export const generateResponseJSON = <T = unknown>(
    responseStatusCode: number = 200,
    responseStatusMessage: string = 'OK',
    data: T | DeepPartial<T> | null = null,
  ): Response<T> => {
    const isSuccess: boolean =
      responseStatusCode === StatusCodes.CREATED ||
      responseStatusCode === StatusCodes.OK;
  
    if (responseStatusCode === StatusCodes.INTERNAL_SERVER_ERROR) {
      // Handle 500 Internal Server Error specifically
      return {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: responseStatusMessage || 'An internal server error occurred',
        error: {
          message: (data as any)?.message || 'An internal server error occurred',
          stack: (data as any)?.stack || '',
          code: (data as any)?.code || 'INTERNAL_SERVER_ERROR',
        },
      } as ErrorResponse<any>;
    }
  
    return isSuccess
      ? ({
          status: responseStatusCode,
          message: responseStatusMessage,
          data: data as T | null,
        } as SuccessResponse<T>)
      : ({
          status: responseStatusCode,
          message: responseStatusMessage,
          error: data as DeepPartial<T> | null,
        } as ErrorResponse<T>);
  };
  