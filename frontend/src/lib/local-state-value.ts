/** Ignore unreadable or incompatible old browser data instead of crashing a page. */
export function decodeLocalValue<T>(serialized: string | null, initial: T, validate?: (value: unknown) => value is T): T {
  if (!serialized) return initial;
  try {
    const value: unknown = JSON.parse(serialized);
    if (validate) return validate(value) ? value : initial;
    if (Array.isArray(initial)) {
      if (!Array.isArray(value)) return initial;
      if (initial.length && value.some(item => item === null || typeof item !== typeof initial[0])) return initial;
    } else if (initial !== null && typeof initial === "object") {
      if (value === null || typeof value !== "object" || Array.isArray(value)) return initial;
    } else if (typeof value !== typeof initial) return initial;
    return value as T;
  } catch {
    return initial;
  }
}
