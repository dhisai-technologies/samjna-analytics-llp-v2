export type InterviewAnalytics = {
  id: string;
  count: number;
  duration?: number;
  avg_sentiment?: number;
  ratio_plot?: string;
  word_cloud?: string;
  valence_plot?: string;
  audio?: {
    top3: string;
    sentiment: {
      label: string;
      score: number;
    }[];
    noun_count: number;
    pause_rate: number;
    transcript: string;
    verb_count: number;
    adjective_count: number;
    sound_intensity: number;
    spectral_energy: number;
    spectral_centroid: number;
    unique_word_count: number;
    zero_crossing_rate: number;
    avg_words_per_minute: number;
    fundamental_frequency: number;
    filler_words_per_minute: number;
    avg_unique_words_per_minute: number;
  };
  facial_emotion_recognition?: {
    class_wise_frame_count: {
      sad: number;
      fear: number;
      angry: number;
      happy: number;
      disgust: number;
      neutral: number;
      surprised: number;
    };
  };
};
