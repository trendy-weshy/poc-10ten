import * as express from 'express';

export interface RouteContext<T> {
    req: express.Request;
    res: express.Response;
    service: T;
}

export interface RouteDecoratorArgs {
    path: string;
    method: string;
    service: string;
    versions: { version: number, current?: boolean }[];
}