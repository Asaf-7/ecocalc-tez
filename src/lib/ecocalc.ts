export type EcoCalcInputs = {
  electricityKwhMonthly: number;
  electricityUnitPriceTl: number; // TL / kWh
  gasM3Monthly: number;
  gasUnitPriceTl: number; // TL / m3
  fuelLitersMonthly: number;
  fuelUnitPriceTl: number; // TL / L
  gesCapacityKwp: number; // kWp
  gesSetupCostTl: number; // TL
};

export type EcoCalcBreakdown = {
  annualCarbonTon: number;
  treesCount: number;
  annualEnergyCostTl: number;
  annualElectricSavingsTl: number;
  roiYears: number | null;
  emissions: {
    electricityTon: number;
    gasTon: number;
    fuelTon: number;
  };
};

// Basit bir varsayım: 1 kWp ~ 1200 kWh / yıl üretir.
// İstersen bunu UI'dan da ayarlanabilir hale getirebiliriz.
const KWH_PER_KWP_PER_YEAR = 1200;

export function calculateEcoCalc(inputs: EcoCalcInputs): EcoCalcBreakdown {
  const electricityTonPerYear =
    ((inputs.electricityKwhMonthly * 0.45) * 12) / 1000;
  const gasTonPerYear = ((inputs.gasM3Monthly * 2.0) * 12) / 1000;
  const fuelTonPerYear = ((inputs.fuelLitersMonthly * 2.6) * 12) / 1000;

  const annualCarbonTon =
    electricityTonPerYear + gasTonPerYear + fuelTonPerYear;

  const treesCount = annualCarbonTon * 45; // yaklaşık

  const monthlyElectricCostTl =
    inputs.electricityKwhMonthly * inputs.electricityUnitPriceTl;
  const monthlyGasCostTl = inputs.gasM3Monthly * inputs.gasUnitPriceTl;
  const monthlyFuelCostTl = inputs.fuelLitersMonthly * inputs.fuelUnitPriceTl;

  const annualEnergyCostTl =
    12 * (monthlyElectricCostTl + monthlyGasCostTl + monthlyFuelCostTl);

  const annualElectricProductionKwh =
    inputs.gesCapacityKwp * KWH_PER_KWP_PER_YEAR;
  const annualElectricSavingsTl =
    annualElectricProductionKwh * inputs.electricityUnitPriceTl;

  const roiYears =
    annualElectricSavingsTl > 0 ? inputs.gesSetupCostTl / annualElectricSavingsTl : null;

  return {
    annualCarbonTon,
    treesCount,
    annualEnergyCostTl,
    annualElectricSavingsTl,
    roiYears,
    emissions: {
      electricityTon: electricityTonPerYear,
      gasTon: gasTonPerYear,
      fuelTon: fuelTonPerYear,
    },
  };
}

