export function convertEnumToReadableFormat(value: string) {
  return value
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

export function convertToPascal(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function convertSnakeToReadable(snakeStr: string): string {
  const words = snakeStr.split("_");
  const readableStr = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  return readableStr;
}
