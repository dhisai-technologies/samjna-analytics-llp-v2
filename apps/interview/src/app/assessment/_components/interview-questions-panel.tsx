"use client";

import { useInterview } from "@/components/providers/interview-provider";
import { getInterviewQuestionTypeIcon } from "@/lib/utils/interview-question";
import { Badge } from "@ui/components/ui/badge";
import { Separator } from "@ui/components/ui/separator";
import { convertEnumToReadableFormat } from "@utils/helpers";

export function InterviewQuestionsPanel() {
  const { interview, questions } = useInterview();
  return (
    <section className="p-3">
      <div className="bg-background p-2 border border-border rounded-md flex justify-between items-start">
        <div className="max-w-52">
          <h2 className="font-semibold truncate">{interview.title}</h2>
          <p className="text-xs truncate text-muted-foreground">{interview.description}</p>
        </div>
        <Badge className="text-[10px] border-muted" role="banner">
          {convertEnumToReadableFormat(interview.level)}
        </Badge>
      </div>
      <Separator className="my-3" />
      <div className="grid gap-3">
        {questions.map((question) => {
          const Icon = getInterviewQuestionTypeIcon(question.type);
          return (
            <div
              key={question.id}
              className="relative flex gap-3 h-16 items-center border bg-background border-border p-3 rounded-md"
            >
              <div className="self-start flex size-8 items-center justify-center rounded-sm border">
                <Icon className="size-3 shrink-0" />
              </div>
              <div className="self-start flex flex-col">
                <h3 className="truncate text-sm font-medium">{question.title}</h3>
                {question.description && (
                  <p className="truncate text-muted-foreground text-xs">{question.description}</p>
                )}
              </div>
              {question.timeLimit > 0 && (
                <p className="absolute top-4 right-4 text-xs text-orange-500">{question.timeLimit}s</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
