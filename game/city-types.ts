export type CityEconomyState = {
  population: number;
  housingUnits: number;
  infrastructureLevel: number;
  lastPopulationUpdate: number;
};

export type CityEconomySnapshot = {
  population: number;
  employed: number;
  availableJobs: number;
  unemploymentRate: number;
  housingUnits: number;
  housingPressure: number;
  averageWageIndex: number;
  consumerDemand: number;
  costOfLiving: number;
  happiness: number;
  localGdpPerSecond: number;
  laborCostMultiplier: number;
  businessDemandMultiplier: number;
};
