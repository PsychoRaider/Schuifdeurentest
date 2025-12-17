
export function formatEUR(value) {
  try {
    return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(value);
  } catch {
    return `€${Number(value).toFixed(2)}`;
  }
}
