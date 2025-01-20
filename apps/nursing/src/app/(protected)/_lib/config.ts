import { nursingLevels } from "@config/nursing";
import { convertEnumToReadableFormat } from "@utils/helpers";
import { ALargeSmall, CalendarDays } from "lucide-react";

export const sorters = [
  {
    value: "startTime",
    label: "Start Time",
    icon: CalendarDays,
  },
  {
    value: "title",
    label: "Title",
    icon: ALargeSmall,
  },
];

export const filterFields = [
  {
    label: "Level",
    value: "level",
    placeholder: "Filter by level",
    options: nursingLevels.map((value) => ({
      label: convertEnumToReadableFormat(value),
      value,
    })),
  },
];
