import { ValuationService } from './../services/valuation/v1/service';
import * as express from 'express';
import { Services, ServiceFactory } from '../services';

export class Controller {
    
    private static supportedVersions = ['v1', 'v2', 'v3'];

    public readonly api = express.Router()
    
    constructor() {
        this.api.get('/:v/valuation/', this.getValuation);
        this.api.get('/valuation/', this.getValuation);
    }

    private static getValuationService(version: string = null) {
        const versionIsSupported = Controller.supportedVersions.filter(v => v === version).length > 0;
        if (versionIsSupported) {
            return ServiceFactory.get(Services.VALUATION, version);
        } else {
            return ServiceFactory.get(Services.VALUATION, 'v3');
        }
    }

    private async getValuation(req, res) {
        try {
            const service = Controller.getValuationService(req.params.v);
            const output = await service.getValuation();

            return res.json(output);
        } catch (error) {
            res.status(500).send(error);
        }
    }

}