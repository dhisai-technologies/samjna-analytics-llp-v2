import type { NursingQuestion } from "@config/nursing";
import { Image, List, Mic, TypeIcon, Video } from "lucide-react";

export function getNursingQuestionTypeIcon(type: NursingQuestion["type"]) {
  const icons = {
    TEXT: TypeIcon,
    SELECT: List,
    IMAGE: Image,
    AUDIO: Mic,
    VIDEO: Video,
  };
  return icons[type] || TypeIcon;
}
