"use client";
import * as React from "react";
import ReactD3Cloud from "react-d3-cloud";

interface WordCloudProps extends React.HTMLAttributes<HTMLDivElement> {
  words: { text: string; value: number }[];
  MAX_FONT_SIZE?: number;
  MIN_FONT_SIZE?: number;
  MAX_FONT_WEIGHT?: number;
  MIN_FONT_WEIGHT?: number;
  MAX_WORDS?: number;
}

const DEFAULT_MAX_FONT_SIZE = 200;
const DEFAULT_MIN_FONT_SIZE = 30;
const DEFAULT_MAX_FONT_WEIGHT = 700;
const DEFAULT_MIN_FONT_WEIGHT = 400;
const DEFAULT_MAX_WORDS = 150;

const WordCloud = React.forwardRef<HTMLDivElement, WordCloudProps>(({ words, ...props }, ref) => {
  const MAX_FONT_SIZE = props.MAX_FONT_SIZE || DEFAULT_MAX_FONT_SIZE;
  const MIN_FONT_SIZE = props.MIN_FONT_SIZE || DEFAULT_MIN_FONT_SIZE;
  const MAX_FONT_WEIGHT = props.MAX_FONT_WEIGHT || DEFAULT_MAX_FONT_WEIGHT;
  const MIN_FONT_WEIGHT = props.MIN_FONT_WEIGHT || DEFAULT_MIN_FONT_WEIGHT;
  const MAX_WORDS = props.MAX_WORDS || DEFAULT_MAX_WORDS;

  const sortedWords = React.useMemo(
    () => words.sort((a, b) => b.value - a.value).slice(0, MAX_WORDS),
    [words, MAX_WORDS],
  );

  const [minOccurrences, maxOccurrences] = React.useMemo(() => {
    const min = Math.min(...sortedWords.map((w) => w.value));
    const max = Math.max(...sortedWords.map((w) => w.value));
    return [min, max];
  }, [sortedWords]);

  const calculateFontSize = React.useCallback(
    (wordOccurrences: number) => {
      const normalizedValue = (wordOccurrences - minOccurrences) / (maxOccurrences - minOccurrences);
      const fontSize = MIN_FONT_SIZE + normalizedValue * (MAX_FONT_SIZE - MIN_FONT_SIZE);
      return Math.round(fontSize);
    },
    [maxOccurrences, minOccurrences, MAX_FONT_SIZE, MIN_FONT_SIZE],
  );

  const calculateFontWeight = React.useCallback(
    (wordOccurrences: number) => {
      const normalizedValue = (wordOccurrences - minOccurrences) / (maxOccurrences - minOccurrences);
      const fontWeight = MIN_FONT_WEIGHT + normalizedValue * (MAX_FONT_WEIGHT - MIN_FONT_WEIGHT);
      return Math.round(fontWeight);
    },
    [maxOccurrences, minOccurrences, MAX_FONT_WEIGHT, MIN_FONT_WEIGHT],
  );

  return (
    <div className="flex items-center justify-center w-full" ref={ref}>
      <ReactD3Cloud
        width={1800}
        height={1000}
        fontWeight={(word) => calculateFontWeight(word.value)}
        data={sortedWords}
        rotate={0}
        padding={1}
        fontSize={(word) => calculateFontSize(word.value)}
        random={() => 0.5}
      />
    </div>
  );
});

WordCloud.displayName = "WordCloud";

export { WordCloud };
