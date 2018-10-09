import { ValuationService } from './../services/valuation/v1/service';
import * as express from 'express';
import { Services, ServiceFactory } from '../services';
import { Route } from './decorator';

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

    @Route([
        {
            service: Services.VALUATION,
            versionSupported: ['v1', 'v2'],
            currentVersion: 'v1'
        }
    ])
    private async getValuation(req, res, next, valuationService) {
        return await valuationService.getValuation();
    }

}