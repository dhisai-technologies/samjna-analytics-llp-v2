export const nursingQuestionTypes = ["TEXT", "SELECT", "IMAGE", "AUDIO", "VIDEO"] as const;
export type NursingQuestionType = (typeof nursingQuestionTypes)[number];

export type NursingQuestion = {
  id: string;
  nursingTestId: string;
  order: number;
  title: string;
  description: string | null;
  category: string | null;
  type: NursingQuestionType;
  file: string | null;
  options: { label: string; value: string }[] | null;
  active: boolean;
  recordVideo: boolean;
  timeLimit: number;
  createdAt: Date;
  updatedAt: Date;
};
