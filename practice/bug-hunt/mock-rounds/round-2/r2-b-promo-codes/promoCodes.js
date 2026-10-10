// Four letters followed by two digits, e.g. SUMR26.
const PROMO_PATTERN = /^[A-Z]{4}\d{2}$/g;

export function isValidPromo(code) {
  return PROMO_PATTERN.test(code.trim().toUpperCase());
}

export function validPromos(codes) {
  return codes.filter(isValidPromo);
}
