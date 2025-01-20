export type ServerActionResponse = {
  errors?: Record<string, string[] | undefined>;
  error?: string;
  success?: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  data?: any;
} | null;
