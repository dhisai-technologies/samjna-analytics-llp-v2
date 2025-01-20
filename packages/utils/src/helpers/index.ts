export function delay(seconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export * from "./error";
export * from "./conversion";
export * from "./format";
export * from "./debounce";
export * from "./file";
export * from "./text";
