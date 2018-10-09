import { ValuationService } from './../services/valuation/v1/service';
import * as express from 'express';
import { Services, ServiceFactory } from '../services';

export class Controller {
    
    private static supportedVersions = ['v1', 'v2', 'v3'];
    
    constructor(public readonly api: express.Application | express.Router) {
        api.get('/:v/valuation/', Controller.getValuation);
        api.get('/valuation/', Controller.getValuation);
    }

    private static async getValuation(req: express.Request, res: express.Response) {
        const versionIsSupported = Controller.supportedVersions.filter(v => v === req.params.v).length > 0;
        try {
            if (req.params.v && versionIsSupported) {
                const service: ValuationService = ServiceFactory.get(Services.VALUATION, req.params.v);
                return res.send(service.getValuation());
            } else {
                return res.send('me!');
            }
        } catch (error) {
            res.status(500).send(error);
        }
    }

}