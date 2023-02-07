import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";

// Test suite
describe('CalculatorService', () => {
  let loggerSpy: any;
  let calculator: CalculatorService;

  beforeEach(() => {
    // Mock implementation of LoggerService
    loggerSpy = jasmine.createSpyObj('LoggerService', ['log']);
    // No need to call spyOn(loggerService, 'log'); as the spy object is already being spied on.
    calculator = new CalculatorService(loggerSpy);
  })

  // Contains a series of specifications
  it('should add two numbers', () => {
    const result = calculator.add(2, 2);
    expect(result).toBe(4);
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });

  it('should subtract two numbers', () => {
    const result= calculator.subtract(2, 2);
    expect(result).toBe(0);
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });
});
