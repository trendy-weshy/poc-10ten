import { IErrorResponse, IResponseObject } from "./response.types";
import { Callback } from "aws-lambda";

export class ResponseFactory {

    private static coreHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Content-Type': 'application/json'
    };

    static failure(cb: Callback, error: IErrorResponse, statusCode = 500) {
        return cb(null, {
            body: JSON.stringify({
                errorType: error.name || 'InternalServerError',
                httpStatus: statusCode,
                message: error.message,
                trace: error.body
            }),
            headers: ResponseFactory.coreHeaders,
            statusCode: statusCode
        });
    }

    static success(cb: Callback, body: any, statusCode = 200, customHeaders?) {
        return cb(null, {
            body: JSON.stringify(body),
            headers: Object.assign({}, ResponseFactory.coreHeaders, customHeaders || null),
            statusCode
        })
    }
}