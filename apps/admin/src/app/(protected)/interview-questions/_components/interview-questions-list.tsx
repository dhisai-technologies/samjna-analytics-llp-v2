"use client";

import InterviewLanding from "@/lib/images/interview-landing.png";
import { getInterviewQuestionTypeIcon } from "@/lib/utils/interview-question";
import type { InterviewQuestion } from "@config/interview";
import { MediaCard } from "@ui/components/media-card";
import { Badge } from "@ui/components/ui/badge";
import { Button } from "@ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { Input } from "@ui/components/ui/input";
import { convertToPascal, getErrorMessage } from "@utils/helpers";
import { Ellipsis, Eye, PencilLine, Plus, Search, ShieldCheck, ShieldX, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { deleteInterviewQuestion, updateInterviewQuestionStatus } from "../_lib/actions";
import { CreateInterviewQuestionDialog } from "./create-interview-question-dialog";
import { UpdateInterviewQuestionSheet } from "./update-interview-question-sheet";

export function InterviewQuestionsList({ questions }: { questions: InterviewQuestion[] }) {
  const [filteredQuestions, setFilteredQuestions] = useState<InterviewQuestion[]>([]);
  const [showCreateInterviewQuestionDialog, setShowCreateInterviewQuestionDialog] = useState(false);
  useEffect(() => {
    setFilteredQuestions(questions.sort((a, b) => a.order - b.order));
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
                setFilteredQuestions(questions.sort((a, b) => a.order - b.order));
              } else {
                setFilteredQuestions(
                  questions
                    .filter(
                      (question) =>
                        question.id.toString().includes(value) ||
                        question.title.toLowerCase().includes(value) ||
                        question.description?.toLowerCase().includes(value),
                    )
                    .sort((a, b) => a.order - b.order),
                );
              }
            }}
          />
        </div>
        <Button onClick={() => setShowCreateInterviewQuestionDialog(true)} className="font-semibold">
          <Plus className="mr-1 size-4" aria-hidden="true" />
          Create
        </Button>
        <CreateInterviewQuestionDialog
          order={questions.length + 1}
          open={showCreateInterviewQuestionDialog}
          onOpenChange={setShowCreateInterviewQuestionDialog}
        />
      </div>
      {filteredQuestions.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3">
          <Image src={InterviewLanding} alt="interview" height={400} priority />
          <p className="text-muted-foreground">No questions found, create one to get started.</p>
        </div>
      )}
      {filteredQuestions.map((question) => (
        <QuestionCard question={question} key={question.id} />
      ))}
    </div>
  );
}

function QuestionCard({ question }: { question: InterviewQuestion }) {
  const [showUpdateInterviewQuestionSheet, setShowUpdateInterviewQuestionSheet] = useState(false);
  const Icon = getInterviewQuestionTypeIcon(question.type);
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
        <DropdownMenu>
          <UpdateInterviewQuestionSheet
            question={question}
            open={showUpdateInterviewQuestionSheet}
            onOpenChange={setShowUpdateInterviewQuestionSheet}
          />
          <DropdownMenuTrigger asChild>
            <Button aria-label="Open menu" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
              <Ellipsis className="size-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem
              onSelect={() => setShowUpdateInterviewQuestionSheet(true)}
              className="space-x-2 cursor-pointer"
            >
              <PencilLine className="w-3 h-3" />
              <span>Update Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                toast.promise(updateInterviewQuestionStatus(question.id, !question.active), {
                  loading: "Updating interview question status...",
                  success: "Updated interview question status successfully",
                  error: (err) => getErrorMessage(err),
                });
              }}
              className="space-x-2 cursor-pointer"
            >
              {question.active ? <ShieldX className="w-3 h-3 " /> : <ShieldCheck className="w-3 h-3 " />}
              {question.active ? <span>Deactivate</span> : <span>Activate</span>}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() =>
                toast.promise(deleteInterviewQuestion(question.id), {
                  loading: "Deleting...",
                  success: "Question deleted successfully",
                  error: "Failed to delete question",
                })
              }
              className="space-x-2 cursor-pointer"
            >
              <Trash className="w-3 h-3 text-destructive" />
              <span className="text-destructive">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
