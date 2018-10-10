import { Services } from '../services';
import { Route } from './decorator';
import { IAPIContext } from '../lib/response.types';
import { ValuationService } from '../services/valuation/v1/service';

export class Controller {

    @Route<{ [key: string]: string | any }>([
        {
            service: Services.VALUATION,
            versionSupported: ['v1', 'v2'],
            currentVersion: 'v1'
        }
    ])
    async getValuation(ctx: IAPIContext, valuationService: ValuationService) {
        return await valuationService.getValuation();
    }

}

/*
 * Expose Controler endpoints as Lambda Function Handlers
 * 
 * We are using `module.exports` because `export default` way of modularization to be in sync node.js Common.js `require()`
 */
const ctrl = new Controller();
exports.getValuation = ctrl.getValuation;