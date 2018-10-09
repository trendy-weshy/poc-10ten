import { ValuationService } from './../services/valuation/v1/service';
import * as express from 'express';
import { Services, ServiceFactory } from '../services';

export class Controller {
    
    private static supportedVersions = ['v1', 'v2', 'v3'];

    public readonly api = express.Router()
    
    constructor() {
        this.api.get('/:v/valuation/', Controller.getValuation);
        this.api.get('/valuation/', Controller.getValuation);
    }

    private static async getValuation(req, res) {
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