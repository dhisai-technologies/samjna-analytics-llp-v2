"use client";

import { useNursingTest } from "@/components/providers/nursing-test-provider";
import NursingLandingImg from "@/lib/images/nursing-landing.png";
import { getNursingQuestionTypeIcon } from "@/lib/utils/nursing-question";
import type { NursingQuestion } from "@config/nursing";
import { apps } from "@config/ui";
import { CopyToClipboard } from "@ui/components/copy-to-clipboard";
import { MediaCard } from "@ui/components/media-card";
import { Badge } from "@ui/components/ui/badge";
import { Button, buttonVariants } from "@ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/components/ui/dialog";
import { Input } from "@ui/components/ui/input";
import { cn } from "@ui/utils";
import { convertToPascal } from "@utils/helpers";
import { Eye, LogIn, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function NursingQuestionsList() {
  const { questions, nursingTest } = useNursingTest();
  const [filteredQuestions, setFilteredQuestions] = useState<NursingQuestion[]>([]);
  useEffect(() => {
    setFilteredQuestions(questions);
  }, [questions]);
  return (
    <div className="grid gap-3">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search questions by id, title or description"
            className="w-full appearance-none bg-background pl-8 shadow-none text-sm"
            onChange={(e) => {
              const value = e.target.value.toLowerCase();
              if (!value) {
                setFilteredQuestions(questions);
              } else {
                setFilteredQuestions(
                  questions.filter(
                    (question) =>
                      question.id.toString().includes(value) ||
                      question.title.toLowerCase().includes(value) ||
                      question.description?.toLowerCase().includes(value),
                  ),
                );
              }
            }}
          />
        </div>
        <CopyToClipboard
          text={`${apps.nursing.url}/auth/assessment?nursingTestId=${nursingTest.id}`}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Copy link
        </CopyToClipboard>
        <Button asChild>
          <Link href={`/auth/assessment?nursingTestId=${nursingTest.id}`}>
            <LogIn className="size-4" />
            Start Test
          </Link>
        </Button>
      </div>
      {filteredQuestions.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3">
          <Image src={NursingLandingImg} alt="nursingTest" height={400} priority />
          <p className="text-muted-foreground">No questions found, create one to get started.</p>
        </div>
      )}
      {filteredQuestions.map((question) => (
        <QuestionCard question={question} key={question.id} />
      ))}
    </div>
  );
}

function QuestionCard({ question }: { question: NursingQuestion }) {
  const Icon = getNursingQuestionTypeIcon(question.type);
  return (
    <div key={question.id} className="flex gap-3 min-h-24 items-center border border-border p-3 rounded-md">
      <div className="self-start flex size-8 items-center justify-center rounded-sm border">
        <Icon className="size-3 shrink-0" />
      </div>
      <div className="self-start flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h3 className="truncate font-medium">{question.title}</h3>
          <Badge variant={question.active ? "default" : "destructive"} className="text-xs text-[10px]">
            {question.active ? "Active" : "Inactive"}
          </Badge>
        </div>
        {question.description && (
          <p className="truncate text-muted-foreground text-xs font-medium">
            Description: <span className="font-normal">{question.description}</span>
          </p>
        )}
        <div className="flex gap-3 items-center font-medium text-xs text-muted-foreground">
          {question.category && (
            <p>
              Category: <span className="font-normal">{convertToPascal(question.category)}</span>
            </p>
          )}
          {question.type === "TEXT" && question.timeLimit > 0 && (
            <p>
              Time limit: <span className="text-orange-500">{question.timeLimit}s</span>
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        {["IMAGE", "AUDIO", "VIDEO"].includes(question.type) && question.file && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="size-8 p-0 data-[state=open]:bg-muted">
                <Eye className="size-4" aria-hidden="true" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{question.title}</DialogTitle>
                <DialogDescription>{question.description}</DialogDescription>
              </DialogHeader>
              <div>
                <MediaCard
                  type={question.type as "IMAGE" | "AUDIO" | "VIDEO"}
                  src={question.file}
                  className="h-96 max-w-xl flex items-center justify-center rounded-lg overflow-hidden"
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
