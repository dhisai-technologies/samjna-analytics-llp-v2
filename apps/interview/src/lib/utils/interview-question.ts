import type { InterviewQuestion } from "@config/interview";
import { Image, List, Mic, TypeIcon, Video } from "lucide-react";

export function getInterviewQuestionTypeIcon(type: InterviewQuestion["type"]) {
  const icons = {
    TEXT: TypeIcon,
    SELECT: List,
    IMAGE: Image,
    AUDIO: Mic,
    VIDEO: Video,
  };
  return icons[type] || TypeIcon;
}
