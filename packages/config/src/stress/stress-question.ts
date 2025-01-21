export interface Word {
  text: string;
  className?: string;
}

export const loadingStates = [
  {
    text: "Preparing your videos for analysis...",
  },
  {
    text: "Uploading and processing videos...",
  },
  {
    text: "Analyzing content, this might take a moment...",
  },
  {
    text: "Generating insights for your videos...",
  },
  {
    text: "Finalizing the analysis...",
  },
  {
    text: "Please wait, we’re almost done...",
  },
];

const defaultQuestionClass = "text-base font-normal text-muted-foreground";
const highlightQuestionClass = "text-base font-normal text-primary";

export const stressQuestions: Word[][] = [
  [
    ..."Please tell me your".split(" ").map((text) => ({ text, className: defaultQuestionClass })),
    { text: "name", className: highlightQuestionClass },
  ],
  [
    ..."Can you tell me a little bit about yourself?"
      .split(" ")
      .map((text) => ({ text, className: defaultQuestionClass })),
  ],
  [
    ..."Can you tell us about a recent event which made you really"
      .split(" ")
      .map((text) => ({ text, className: defaultQuestionClass })),
    { text: "happy?", className: highlightQuestionClass },
  ],
  [
    ..."What was the last time you were really".split(" ").map((text) => ({ text, className: defaultQuestionClass })),
    { text: "impatient", className: highlightQuestionClass },
    ..."about something?".split(" ").map((text) => ({ text, className: defaultQuestionClass })),
  ],
  [
    ..."What makes you a very".split(" ").map((text) => ({ text, className: defaultQuestionClass })),
    ..."special and unique".split(" ").map((text) => ({ text, className: highlightQuestionClass })),
    { text: "person?", className: defaultQuestionClass },
  ],
  [
    ..."Can you tell us about a time where you were"
      .split(" ")
      .map((text) => ({ text, className: defaultQuestionClass })),
    { text: "scolded/criticized", className: highlightQuestionClass },
    ..."for your".split(" ").map((text) => ({ text, className: defaultQuestionClass })),
    { text: "work?", className: highlightQuestionClass },
  ],
  [
    ..."What kind of behavior makes you really".split(" ").map((text) => ({ text, className: defaultQuestionClass })),
    { text: "happy?", className: highlightQuestionClass },
  ],
  [
    ..."What kind of behavior makes you really".split(" ").map((text) => ({ text, className: defaultQuestionClass })),
    { text: "angry/sad?", className: highlightQuestionClass },
  ],
  [
    ..."What do you when you get".split(" ").map((text) => ({ text, className: defaultQuestionClass })),
    { text: "angry/sad?", className: highlightQuestionClass },
  ],
];
