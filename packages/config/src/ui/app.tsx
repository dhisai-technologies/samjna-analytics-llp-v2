import { Brain, Command, Computer, LayoutDashboard, type LucideProps } from "lucide-react";

export type AppName = "ADMIN" | "NURSING" | "INTERVIEW";

const isProduction = false;

export const appConfig = {
  title: "Samjna Analytics LLP",
  description: "Words and Beyond",
  copyright: "2024",
  links: {
    twitter: "",
    company: "",
  },
  url: isProduction ? "https://samjna.co.in" : "http://localhost:3000",
  api: {
    url: isProduction ? "https://core.samjna.co.in" : "http://localhost:8000",
    services: {
      core: "core-service",
      analytics: "analytics-service",
    },
  },
};

export const apps = {
  admin: {
    key: "ADMIN" as AppName,
    name: "Prabandh",
    englishName: "Admin",
    url: isProduction ? "https://prabandh.samjna.co.in" : "http://localhost:3001",
    description: "A platform to manage users and data",
    defaultColor: "red",
    Icon: (props: LucideProps) => <LayoutDashboard {...props} />,
    api: isProduction ? "https://core.samjna.co.in" : "http://localhost:8000",
  },
  stress: {
    key: "STRESS" as AppName,
    name: "Chinta",
    englishName: "Stress",
    url: isProduction ? "https://chinta.samjna.co.in" : "http://localhost:3002",
    description: "A platform to manage and analyze stress levels",
    defaultColor: "red",
    Icon: (props: LucideProps) => <Brain {...props} />,
    api: isProduction ? "https://analytics.samjna.co.in" : "http://localhost:8001",
  },
  nursing: {
    key: "NURSING" as AppName,
    name: "Posha",
    englishName: "Nursing",
    url: isProduction ? "https://posha.samjna.co.in" : "http://localhost:3003",
    description: "A platform to conduct and analyze nursing tests",
    defaultColor: "red",
    Icon: (props: LucideProps) => <Command {...props} />,
    api: isProduction ? "https://analytics.samjna.co.in" : "http://localhost:8001",
  },
  interview: {
    key: "INTERVIEW" as AppName,
    name: "Udvega",
    englishName: "Interview",
    url: isProduction ? "https://udvega.samjna.co.in" : "http://localhost:3004",
    description: "A platform to conduct and analyze interviews",
    defaultColor: "red",
    Icon: (props: LucideProps) => <Computer {...props} />,
    api: isProduction ? "https://analytics.samjna.co.in" : "http://localhost:8001",
  },
};

export type AppConfig = typeof appConfig;
