export const roles = ["ADMIN", "ORGANIZATION", "EMPLOYEE"] as const;
export type Role = (typeof roles)[number];

export const modules = ["ADMIN", "STRESS", "INTERVIEW", "NURSING"] as const;
export type Module = (typeof modules)[number];

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  active: boolean;
  module: Module;
  maxParticipants: number;
};
