function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { compareNumber, countSignificantDigits, getUnsafeNumberReason, isInteger, isNumber, UnsafeNumberReason } from './utils.js';

/**
 * A lossless number. Stores its numeric value as string
 */
export class LosslessNumber {
  constructor(value) {
    // numeric value as string
    _defineProperty(this, "value", void 0);
    // type information
    _defineProperty(this, "isLosslessNumber", true);
    if (!isNumber(value)) {
      throw new Error(`Invalid number (value: "${value}")`);
    }
    this.value = value;
  }

  /**
   * Get the value of the LosslessNumber as number or bigint.
   *
   * - a number is returned for safe numbers and decimal values that only lose some insignificant digits
   * - a bigint is returned for big integer numbers
   * - an Error is thrown for values that will overflow or underflow
   *
   * Note that you can implement your own strategy for conversion by just getting the value as string
   * via .toString(), and using util functions like isInteger, isSafeNumber, getUnsafeNumberReason,
   * and toSafeNumberOrThrow to convert it to a numeric value.
   */
  valueOf() {
    const unsafeReason = getUnsafeNumberReason(this.value);

    // safe or truncate_float
    if (unsafeReason === undefined || unsafeReason === UnsafeNumberReason.truncate_float) {
      return Number.parseFloat(this.value);
    }

    // truncate_integer
    if (isInteger(this.value)) {
      return BigInt(this.value);
    }

    // overflow or underflow
    throw new Error(`Cannot safely convert to number: the value '${this.value}' would ${unsafeReason} and become ${Number.parseFloat(this.value)}`);
  }

  /**
   * Get the value of the LosslessNumber as string.
   */
  toString() {
    return this.value;
  }

  // Note: we do NOT implement a .toJSON() method, and you should not implement
  // or use that, it cannot safely turn the numeric value in the string into
  // stringified JSON since it has to be parsed into a number first.
}

/**
 * Test whether a value is a LosslessNumber
 */
export function isLosslessNumber(value) {
  // @ts-expect-error
  return value && typeof value === 'object' && value.isLosslessNumber || false;
}

/**
 * Convert a number into a LosslessNumber if this is possible in a safe way
 * If the value has too many digits, or is NaN or Infinity, an error will be thrown
 */
export function toLosslessNumber(value) {
  const maxDigits = 15;
  if (countSignificantDigits(String(value)) > maxDigits) {
    throw new Error(`Invalid number: contains more than 15 digits and is most likely truncated and unsafe by itself (value: ${value})`);
  }
  if (Number.isNaN(value)) {
    throw new Error('Invalid number: NaN');
  }
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid number: ${value}`);
  }
  return new LosslessNumber(String(value));
}

/**
 * Compare two lossless numbers.
 * Returns 1 when a is larger than b, 0 when they are equal,
 * and -1 when a is smaller than b.
 */
export function compareLosslessNumber(a, b) {
  return compareNumber(a.value, b.value);
}
//# sourceMappingURL=LosslessNumber.js.map