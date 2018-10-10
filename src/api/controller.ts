import * as express from 'express';
import { Services, ServiceFactory } from '../services';
import { Route } from './decorator';

export class Controller {
    
    public endpoints;

    constructor() {
        this.endpoints = {
            getValuation: this.getValuation
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

/*
 * Expose Controler endpoints as Lambda Function Handlers
 * 
 * We are using `module.exports` because `export default` way of modularization to be in sync node.js Common.js `require()`
 */
module.exports = new Controller().endpoints;