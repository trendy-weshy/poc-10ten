import { ValuationFactory } from './valuation/index';


export enum Services {
    VALUATION
}

export class ServiceFactory {

    private static services = [
        'valuation'
    ];

    static get(service: number, version: string) {
        switch (ServiceFactory.services[service]) {
            case 'valuation':
                return ValuationFactory.get(version);
            default:
                const err = new Error();
                err.name = 'ServiceError';
                err.message = 'Service could not be found';
        }
    }
}