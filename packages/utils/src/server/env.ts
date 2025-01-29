import { appConfig, apps } from "@config/ui";

export const config = {
  CORE_API_URL: `${appConfig.api.url}/${appConfig.api.services.core}`,
  STRESS_API_URL: `${apps.stress.api.url}/${appConfig.api.services.analytics}`,
  NURSING_API_URL: `${apps.nursing.api.url}/${appConfig.api.services.analytics}`,
  INTERVIEW_API_URL: `${apps.interview.api.url}/${appConfig.api.services.analytics}`,
};
