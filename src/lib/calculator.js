
import { RULES } from "../lib/pricingRules";

const areaM2 = (wMm, hMm) => (wMm / 1000) * (hMm / 1000);

/**
 * Core calculator.
 * @param {{
 *  productKey: string,
 *  widthMm: number,
 *  heightMm: number,
 *  selectedOptions: string[],
 *  fixedCounts: Record<string, number>,
 *  region: string
 * }} params
 */
export function calculate({ productKey, widthMm, heightMm, selectedOptions, fixedCounts, region }) {
  const lines = [];
  const p = RULES.products[productKey];
  let total = p.basePrice;
  lines.push({ label: `Basis (${productKey})`, amount: p.basePrice });

  // Dimensional surcharges (per started 100 mm)
  const overW = Math.max(0, Math.ceil((widthMm - p.baseW) / 100));
  const overH = Math.max(0, Math.ceil((heightMm - p.baseH) / 100));

  if (overW) {
    const add = overW * p.widthIncPer100;
    total += add;
    lines.push({ label: `Breedte toeslag (${overW} × ${p.widthIncPer100})`, amount: add });
  }
  if (overH) {
    const add = overH * p.heightIncPer100;
    total += add;
    lines.push({ label: `Hoogte toeslag (${overH} × ${p.heightIncPer100})`, amount: add });
  }

  // Area-based options
  const area = areaM2(widthMm, heightMm);
  Object.entries(RULES.areaOptions).forEach(([opt, pricePerM2]) => {
    if (selectedOptions.includes(opt)) {
      const add = area * pricePerM2;
      total += add;
      lines.push({ label: `${opt} (${area.toFixed(2)} m² × €${pricePerM2})`, amount: add });
    }
  });

  // Flat selectable options
  Object.entries(RULES.selectableFlatOptions).forEach(([opt, price]) => {
    if (selectedOptions.includes(opt)) {
      total += price;
      lines.push({ label: `${opt} (vast)`, amount: price });
    }
  });

  // Counted options
  Object.entries(fixedCounts).forEach(([key, count]) => {
    if (!count) return;
    const def = RULES.fixedCountOptions[key];
    if (!def) return;

    if (def.type === "perItem") {
      const add = count * def.price;
      total += add;
      lines.push({ label: `${key} (${count} × €${def.price})`, amount: add });
    } else if (def.type === "perMeterWidth") {
      const instances = Math.min(count, def.max || count);
      const widthM = widthMm / 1000;
      const add = instances * widthM * def.pricePerM;
      total += add;
      lines.push({ label: `${key} (${instances} × ${widthM.toFixed(2)} m × €${def.pricePerM})`, amount: add });
    }
  });

  // Region
  if (region && RULES.regions[region]) {
    const add = RULES.regions[region];
    total += add;
    lines.push({ label: `Regionaal tarief (${region})`, amount: add });
  }

  // Small area surcharge
  if (area < RULES.surcharges.smallAreaThresholdM2) {
    const add = RULES.surcharges.smallAreaFee;
    total += add;
    lines.push({ label: `Kleine oppervlakte toeslag (< ${RULES.surcharges.smallAreaThresholdM2} m²)`, amount: add });
  }

  return { total: Number(total.toFixed(2)), breakdown: lines, area };
}

