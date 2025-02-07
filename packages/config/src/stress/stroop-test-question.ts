export const stroopTestLevels = ["LEVEL-1", "LEVEL-2", "LEVEL-3"] as const;
export type StroopTestLevel = (typeof stroopTestLevels)[number];

export type StroopTestQuestion = {
  id: string;
  order: number;
  title: string;
  level: StroopTestLevel;
  source: {
    label: string;
    color: string;
  };
  destination: {
    id: string;
    label: string;
    color: string;
  }[];
  answer: string;
  timeLimit: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};
