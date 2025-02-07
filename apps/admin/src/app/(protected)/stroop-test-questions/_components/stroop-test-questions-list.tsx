"use client";

import InterviewLanding from "@/lib/images/interview-landing.png";
import type { StroopTestQuestion } from "@config/stress";
import { Badge } from "@ui/components/ui/badge";
import { Button } from "@ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { Input } from "@ui/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/components/ui/popover";
import { cn } from "@ui/utils";
import { getErrorMessage } from "@utils/helpers";
import { Ellipsis, Eye, PencilLine, Plus, Search, ShieldCheck, ShieldX, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { deleteStroopTestQuestion, updateStroopTestQuestionStatus } from "../_lib/actions";
import { CreateStroopTestQuestionDialog } from "./create-stroop-test-question-dialog";
import { UpdateStroopTestQuestionSheet } from "./update-stroop-test-question-sheet";

export function StroopTestQuestionsList({ questions }: { questions: StroopTestQuestion[] }) {
  const [filteredQuestions, setFilteredQuestions] = useState<StroopTestQuestion[]>([]);
  const [showCreateStroopTestQuestionDialog, setShowCreateStroopTestQuestionDialog] = useState(false);
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
                        question.id.toString().includes(value) || question.title.toLowerCase().includes(value),
                    )
                    .sort((a, b) => a.order - b.order),
                );
              }
            }}
          />
        </div>
        <Button onClick={() => setShowCreateStroopTestQuestionDialog(true)} className="font-semibold">
          <Plus className="mr-1 size-4" aria-hidden="true" />
          Create
        </Button>
        <CreateStroopTestQuestionDialog
          order={questions.length + 1}
          open={showCreateStroopTestQuestionDialog}
          onOpenChange={setShowCreateStroopTestQuestionDialog}
        />
      </div>
      {filteredQuestions.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3">
          <Image src={InterviewLanding} alt="interview" height={400} priority />
          <p className="text-muted-foreground">No questions found, create one to get started.</p>
        </div>
      )}
      {filteredQuestions.map((question, index) => (
        <QuestionCard question={question} key={question.id} index={index} />
      ))}
    </div>
  );
}

function QuestionCard({ question, index }: { question: StroopTestQuestion; index: number }) {
  const [showUpdateStroopTestQuestionSheet, setShowUpdateStroopTestQuestionSheet] = useState(false);
  return (
    <div key={question.id} className="flex gap-3 min-h-24 items-start border border-border p-3 rounded-md">
      <div className="self-start flex size-8 items-center justify-center rounded-sm border">
        <span className="text-sm font-semibold">{index + 1}</span>
      </div>
      <div className="self-start flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h3 className="font-medium">{question.title}</h3>
            <Badge
              variant={question.active ? "default" : "destructive"}
              className={cn("text-xs text-[10px]", question.active && "bg-green-100 text-green-700 hover:bg-green-200")}
            >
              {question.active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
        <div className="flex gap-3 items-center font-medium text-xs text-muted-foreground">
          <p>
            Level: <span className="font-normal">{question.level}</span>
          </p>
          <p>
            Time limit: <span className="text-orange-500">{question.timeLimit}s</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <Popover>
          <PopoverTrigger asChild>
            <Button aria-label="Open menu" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
              <Eye className="size-4" aria-hidden="true" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="min-w-96" align="end">
            <div className="flex text-muted-foreground font-semibold gap-[1px] text-sm">
              <div className="w-32 flex flex-col items-center justify-center p-3 rounded-l-2xl bg-neutral-800">
                <p
                  style={{
                    color: question.source.color,
                  }}
                  className="text-center"
                >
                  {question.source.label}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 px-3 w-96 text-center p-3 bg-neutral-800">
                {question.destination.map((destination) => (
                  <p
                    key={destination.id}
                    style={{
                      color: destination.color,
                    }}
                  >
                    {destination.label}
                  </p>
                ))}
              </div>
              <div className="pl-3 w-32 flex-col flex items-center justify-center p-3 rounded-r-2xl bg-neutral-800">
                <p
                  style={{
                    color:
                      question.destination.find((destination) => destination.id === question.answer.toString())
                        ?.color || "white",
                  }}
                  className="text-center"
                >
                  {question.destination.find((destination) => destination.id === question.answer.toString())?.label ||
                    "Invalid"}
                </p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <DropdownMenu>
          <UpdateStroopTestQuestionSheet
            question={question}
            open={showUpdateStroopTestQuestionSheet}
            onOpenChange={setShowUpdateStroopTestQuestionSheet}
          />
          <DropdownMenuTrigger asChild>
            <Button aria-label="Open menu" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
              <Ellipsis className="size-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem
              onSelect={() => setShowUpdateStroopTestQuestionSheet(true)}
              className="space-x-2 cursor-pointer"
            >
              <PencilLine className="w-3 h-3" />
              <span>Update Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                toast.promise(updateStroopTestQuestionStatus(question.id, !question.active), {
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
                toast.promise(deleteStroopTestQuestion(question.id), {
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
