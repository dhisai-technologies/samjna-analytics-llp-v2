"use client";
import { useNursingTest } from "@/components/providers/nursing-test-provider";
import { getNursingQuestionTypeIcon } from "@/lib/utils/nursing-question";
import type { NursingQuestion } from "@config/nursing";
import { Badge } from "@ui/components/ui/badge";
import { Separator } from "@ui/components/ui/separator";
import { cn } from "@ui/utils";
import { convertEnumToReadableFormat } from "@utils/helpers";
import { useEffect, useState } from "react";

export function NursingQuestionsPanel() {
  const { nursingTest, questions, currentQuestion, count } = useNursingTest();
  const [activeQuestions, setActiveQuestions] = useState<NursingQuestion[]>([]);
  useEffect(() => {
    setActiveQuestions(questions.filter((question) => (count > 27 ? question.recordVideo : !question.recordVideo)));
  }, [count, questions]);
  return (
    <section className="p-3">
      <div className="bg-background p-2 border border-border rounded-md flex justify-between items-start">
        <div className="max-w-52">
          <h2 className="font-semibold truncate">{nursingTest.title}</h2>
          <p className="text-xs truncate text-muted-foreground ">{nursingTest.description}</p>
        </div>
        <Badge className="text-[10px] border-muted" role="banner">
          {convertEnumToReadableFormat(nursingTest.level)}
        </Badge>
      </div>
      <Separator className="my-3" />
      <div className="grid gap-3">
        {activeQuestions.map((question) => {
          const Icon = getNursingQuestionTypeIcon(question.type);
          return (
            <div
              key={question.id}
              className={cn(
                "relative flex gap-3 h-16 items-center border bg-background border-border p-3 rounded-md",
                currentQuestion?.id === question.id && "bg-sidebar-accent",
              )}
            >
              <div
                className={cn(
                  "self-start flex size-8 items-center justify-center rounded-sm border",
                  currentQuestion?.id === question.id && "bg-primary/10 text-primary border-primary/50",
                )}
              >
                <Icon className="size-3 shrink-0" />
              </div>
              <div className="self-start flex flex-col max-w-52">
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
