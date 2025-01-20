export const logLevels = ["INFO", "DEBUG", "ERROR"] as const;
export type LogLevel = (typeof logLevels)[number];

export type Log = {
  id: string;
  createdAt: Date;
  userId: string | null;
  message: string;
  level: LogLevel;
  event: string | null;
  details: string | null;
  access: boolean;
};
