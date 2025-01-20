import { appConfig, apps } from "@config/ui";

export const config = {
  CORE_API_URL: `${appConfig.api.url}/${appConfig.api.services.core}`,
  NURSING_API_URL: `${apps.nursing.api}/${appConfig.api.services.analytics}`,
  INTERVIEW_API_URL: `${apps.interview.api}/${appConfig.api.services.analytics}`,
};
