import * as express from 'express';
import { ServiceFactory, Services } from '../services';

export interface IRouteParams {
    versionSupported: string[];
    currentVersion: string;
    service: Services;
}

export function Route(params: IRouteParams) {

    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
    
        function getService(version: string = null) {
            if (!version) {
                return ServiceFactory.get(params.service, params.currentVersion);
            }

            const versionIsSupported = params.versionSupported.filter(v => v === version).length > 0;
            if (versionIsSupported) {
                return ServiceFactory.get(params.service, version);
            } else {
                const err = new Error();
                err.name = 'InvalidVersion';
                err.message = 'Version is not supported';
                throw err;
            }
        }

        async function extendedMethod(req, res, next) {
            const context = this;
            
            try {
                const service = getService();
                const output = await originalFunc.apply(context, [service]);
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