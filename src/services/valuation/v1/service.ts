import { ValuationModel } from './model';
import { ValuationStrategy } from './strategy';

export class ValuationService {
    public readonly model: ValuationModel = new ValuationModel();
    public readonly strategy: ValuationStrategy = new ValuationStrategy();
    
    getValuation() {
        return { ...this.model.getValuationData(), serviceRes: 'some service data', ...this.strategy.calculate() };
    }

}