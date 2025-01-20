export type Notification = {
  id: string;
  link?: string | undefined;
  userId: number;
  type: string;
  message: string;
  commonTime: string;
  humanReadableTime: string;
  createdAt: Date;
};
