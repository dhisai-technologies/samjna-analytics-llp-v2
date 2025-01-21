type EyeEmotionRecognition = {
  duration: number;
  blink_durations: number[];
  avg_blink_duration: number;
  total_blinks: number;
};

type FacialEmotionRecognition = {
  class_wise_frame_count: {
    sad: number;
    fear: number;
    angry: number;
    happy: number;
    disgust: number;
    neutral: number;
    surprised: number;
  };
  plot?: string;
};

type SpeechEmotionRecognition = {
  major_emotion: string;
  pause_length: number;
  articulation_rate: number;
  speaking_rate: number;
  word_weights: Record<string, number>;
  pitch: number;
};

export type StressAnalytics = {
  id: number;
  eye_emotion_recognition: EyeEmotionRecognition;
  facial_emotion_recognition: FacialEmotionRecognition;
  speech_emotion_recognition: SpeechEmotionRecognition;
};
