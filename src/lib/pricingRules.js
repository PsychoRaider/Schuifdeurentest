
// Centralized, data-driven pricing rules
export const RULES = {
  products: {
    "Type A": { basePrice: 2792, baseW: 800,  baseH: 2100, maxW: 2400, maxH: 4115, widthIncPer100: 112, heightIncPer100: 52 },
    "Type B": { basePrice: 4120, baseW: 1600, baseH: 2100, maxW: 4800, maxH: 4115, widthIncPer100: 112, heightIncPer100: 104 },
    "Type C": { basePrice: 5725, baseW: 1600, baseH: 2100, maxW: 3830, maxH: 2650, widthIncPer100: 112, heightIncPer100: 104 },
    "Type D": { basePrice: 9194, baseW: 3200, baseH: 2100, maxW: 6000, maxH: 2650, widthIncPer100: 112, heightIncPer100: 208 },
    "Type E": { basePrice: 7214, baseW: 1600, baseH: 2100, maxW: 3830, maxH: 3000, widthIncPer100: 162, heightIncPer100: 104 },
    "Type F": { basePrice: 10676, baseW: 3200, baseH: 2100, maxW: 6000, maxH: 3000, widthIncPer100: 162, heightIncPer100: 208 }
  },

  // Options priced per m²
  areaOptions: {
    "Isolatieglas": 186,
    "Buitenkwaliteit coating": 142,
    "Paneelvulling (Staalplaat)": 142
  },

  // Flat selectable options (checkbox): one-time price when selected
  selectableFlatOptions: {
    "Montagebalk": 1000
  },

  // Options with a numeric count
  fixedCountOptions: {
    "Komgreep": { type: "perItem", price: 45 },
    "Haakslot": { type: "perItem", price: 178 },
    "Espagnolet": { type: "perItem", price: 290 },
    "Horizontale Regel": { type: "perMeterWidth", pricePerM: 207, max: 4 }
  },

  regions: {
    "Noord-Holland": 152, "Zuid-Holland": 152, "Utrecht": 152, "Flevoland": 152,
    "Noord-Brabant": 240, "Friesland": 240, "Gelderland": 240, "Overijssel": 240,
    "Drenthe": 194, "Limburg": 383, "Zeeland": 383, "Groningen": 383
  },

  surcharges: { smallAreaThresholdM2: 10, smallAreaFee: 150 }
};

