let counter = 0;

export function generateId(prefix = 'id'): string {
  counter++;
  return `${prefix}_${Date.now()}_${counter}`;
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
