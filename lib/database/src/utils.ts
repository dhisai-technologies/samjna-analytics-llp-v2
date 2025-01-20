import { customAlphabet } from "nanoid";
import { adjectives, animals, colors, uniqueNamesGenerator } from "unique-names-generator";

interface GenerateIdOptions {
  length?: number;
  separator?: string;
}

export function generateId(prefix?: string, { length = 12, separator = "_" }: GenerateIdOptions = {}) {
  const id = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", length)();
  return prefix ? `${prefix}${separator}${id}` : id;
}

export function generateName() {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
    separator: "-",
    seed: `${Date.now()}`,
  });
}

export function generateNumericId(prefix?: string, { length = 8, separator = "-" }: GenerateIdOptions = {}) {
  const id = customAlphabet("0123456789", length)();
  return prefix ? `${prefix}${separator}${id}` : id;
}
