import { APIGatewayEvent, Context } from 'aws-lambda';

export interface IAPIContext {
    event: APIGatewayEvent;
    context: Context;
}

export interface HeaderObject { [key: string]: string | number | boolean }

export interface IResponseObject {
    statusCode: number;
    body: string;
}

export interface IErrorResponse {
    message: string;
    name?: string;
    body?: any;
}