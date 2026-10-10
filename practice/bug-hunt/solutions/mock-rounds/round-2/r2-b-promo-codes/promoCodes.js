// Four letters followed by two digits, e.g. SUMR26.
// Fixed: no `g` flag. A global regex remembers `lastIndex` between test() calls,
// so the second check of a valid code started from the end of the string and failed.
const PROMO_PATTERN = /^[A-Z]{4}\d{2}$/;

export function isValidPromo(code) {
  return PROMO_PATTERN.test(code.trim().toUpperCase());
}

export function validPromos(codes) {
  return codes.filter(isValidPromo);
}
