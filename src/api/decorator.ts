import * as express from 'express';
import { ServiceFactory, Services } from '../services';

export interface IRouteParams {
    versionSupported: string[];
    currentVersion: string;
    service: Services;
}

export function Route(params: IRouteParams[]) {

    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {

        function getService(param, version: string = null) {
            if (!version) {
                return ServiceFactory.get(param.service, param.currentVersion);
            }

            const versionIsSupported = param.versionSupported.filter(v => v === version).length > 0;
            if (versionIsSupported) {
                return ServiceFactory.get(param.service, version);
            } else {
                const err = new Error();
                err.name = 'InvalidVersion';
                err.message = 'Version is not supported';
                throw err;
            }
        }

        async function extendedMethod(req: express.Request, res: express.Response, next: express.NextFunction) {
            const context = this;
            
            try {
                const serviceList = params.map(v => getService(v, req.params.v));
                const output = await originalFunc.apply(context, [ req, res, next, ...serviceList ]);
                return res.json({ ...output });
            } catch (error) {
                return res.status(500).send(error);
            }
        }
        
        if (descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
        }
        const originalFunc = descriptor.value;
        descriptor.value = extendedMethod;
        return descriptor;
    }

}