export type File = {
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  key: string;
  mimetype: string;
  size: number;
  readableBy: unknown;
  readableUpto: Date;
  isPublic: boolean;
  isAnalytics: boolean;
  link?: string;
};
