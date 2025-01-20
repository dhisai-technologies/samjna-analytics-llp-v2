export const interviewQuestionTypes = ["TEXT", "SELECT", "IMAGE", "AUDIO", "VIDEO"] as const;
export type InterviewQuestionType = (typeof interviewQuestionTypes)[number];

export type InterviewQuestion = {
  id: string;
  interviewId: string;
  order: number;
  title: string;
  description: string | null;
  category: string | null;
  type: InterviewQuestionType;
  file: string | null;
  options: { label: string; value: string }[] | null;
  active: boolean;
  recordVideo: boolean;
  timeLimit: number;
  createdAt: Date;
  updatedAt: Date;
};
