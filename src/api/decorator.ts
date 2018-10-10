import { ServiceFactory, Services } from '../services';
import { Context, Callback, APIGatewayEvent } from 'aws-lambda';
import { IResponseObject } from '../lib/response.types';
import { ResponseFactory } from '../lib/response.factory';

export interface IRouteParams {
    versionSupported: string[];
    currentVersion: string;
    service: Services;
}

/**
 * @author John Waweru
 * @func Route - A decorator whose purpose is to get the respective services required by a controller method
 * @param {Array<IRouteParams>} params - An array of service requirements expected to be met by the method
 */
export function Route<T = any>(params: IRouteParams[]) {

    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        
        /**
         * uses Service Factory to get the correct Service object
         * @param {IRouteParams} param - parameters of a single Array<IRouterParam>
         * @param version - version of the service to get
         */
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
    
        /**
         * @func extendedMethod - extends the original Controller class method so as to get and provide the required services to the method
         * @return {Function} - Lambda callback function
         * @param {APIGatewayEvent} event 
         * @param {Context} ctx 
         * @param {Callback} callback
         */
        function extendedMethod(event: APIGatewayEvent, ctx: Context, done: Callback<IResponseObject>) {
            const self = this;
            let serviceList;
            
            /**
             * Get the services required but the original function 
             */
            try {
                serviceList = params.map(
                    v => getService(v, 
                        event.pathParameters && event.pathParameters.version ? event.pathParameters.version : null
                    )
                );
            } catch (error) {
                console.log(error);
                return ResponseFactory.failure(done, error, 503);
            }

            const output = originalFunc.apply(self, [ {event, context: ctx}, ...serviceList ]);
            output.then( (data: T) => ResponseFactory.success(done, data, 200) )
            .catch( (err) => ResponseFactory.failure(done, err, 400) );
        }
        
        if (descriptor === undefined) {
            descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
        }
        const originalFunc = descriptor.value;
        descriptor.value = extendedMethod;
        return descriptor;
    }

}