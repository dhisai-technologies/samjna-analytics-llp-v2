export function debounce<T extends Array<unknown>, U>(func: (..._args: T) => Promise<U>, delay: number) {
  let timer: NodeJS.Timeout;
  return async (...args: T): Promise<U> => {
    clearTimeout(timer);
    return new Promise((resolve, reject) => {
      timer = setTimeout(async () => {
        try {
          const result = await func(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
}
