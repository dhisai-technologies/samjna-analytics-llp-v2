import type { NursingAnalytics, NursingSession } from "@config/nursing";

function getIndividualScores(analytics: NursingAnalytics[], count: number) {
  for (const analytic of analytics) {
    if (analytic.count === count) {
      return {
        count: analytic.count,
        score: analytic.answer ? Number.parseInt(analytic.answer) || 0 : 0,
      };
    }
  }
  return null;
}

export function getGoldStandardTestScores(analytics: NursingSession["individualAnalytics"]) {
  if (!analytics) {
    return null;
  }
  const coreDisgustQuestions = [1, 3, 6, 8, 11, 13, 15, 17, 20, 22, 25, 27];
  const animalRemainderDisgustQuestions = [2, 5, 7, 10, 14, 19, 21, 24];
  const contaminationDisgustQuestions = [4, 9, 12, 16, 18, 23];
  const disgustSensitivityQuestions = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27,
  ];

  const negativeQuestions = [1, 6, 10];

  function calculateScore(questionNumber: number, score: number) {
    if (negativeQuestions.includes(questionNumber)) {
      return 4 - score;
    }
    return score;
  }

  const scores = {
    coreDisgust: 0,
    animalRemainder: 0,
    contaminationDisgust: 0,
    disgustSensitivity: 0,
  };

  for (let count = 1; count <= 27; count++) {
    const analytic = getIndividualScores(analytics, count);
    if (analytic?.score) {
      if (coreDisgustQuestions.includes(analytic.count)) {
        scores.coreDisgust += calculateScore(analytic.count, analytic.score);
      }
      if (animalRemainderDisgustQuestions.includes(analytic.count)) {
        scores.animalRemainder += calculateScore(analytic.count, analytic.score);
      }
      if (contaminationDisgustQuestions.includes(analytic.count)) {
        scores.contaminationDisgust += calculateScore(analytic.count, analytic.score);
      }
      if (disgustSensitivityQuestions.includes(analytic.count)) {
        scores.disgustSensitivity += calculateScore(analytic.count, analytic.score);
      }
    }
  }

  return {
    coreDisgust: (scores.coreDisgust / coreDisgustQuestions.length).toFixed(2),
    animalRemainderDisgust: (scores.animalRemainder / animalRemainderDisgustQuestions.length).toFixed(2),
    contaminationDisgust: (scores.contaminationDisgust / contaminationDisgustQuestions.length).toFixed(2),
    disgustSensitivity: (scores.disgustSensitivity / disgustSensitivityQuestions.length).toFixed(2),
  };
}
