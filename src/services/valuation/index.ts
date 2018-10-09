import {ValuationService} from './v1/service';

export class ValuationFactory {

    static get(version: string) {
        console.log(version);
        switch (version) {
            case 'v1':
                return new ValuationService();
            default:
                const err = new Error();
                err.name = 'ServiceError';
                err.message = 'Unknown version provided.';
                throw err;
        }
    }
}