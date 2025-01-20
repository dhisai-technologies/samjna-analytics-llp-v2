import type {
  ArrayPath,
  ControllerRenderProps,
  FieldArrayWithId,
  FieldValues,
  Path,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from "react-hook-form";

type Matcher =
  | boolean
  | ((date: Date) => boolean)
  | Date
  | Date[]
  | DateRange
  | DateBefore
  | DateAfter
  | DateInterval
  | DayOfWeek;

type DateAfter = {
  after: Date;
};
type DateBefore = {
  before: Date;
};
type DateInterval = {
  before: Date;
  after: Date;
};
type DateRange = {
  from: Date | undefined;
  to?: Date | undefined;
};
type DayOfWeek = {
  dayOfWeek: number[];
};

interface TextFieldProps {
  type: "text";
  onInput?: React.FormEventHandler<HTMLInputElement> | undefined;
  disabled?: boolean | undefined;
}

interface NumberFieldProps {
  type: "number";
  onInput?: React.FormEventHandler<HTMLInputElement> | undefined;
  disabled?: boolean | undefined;
}

interface PasswordFieldProps {
  type: "password";
  onInput?: React.FormEventHandler<HTMLInputElement> | undefined;
  disabled?: boolean | undefined;
}

interface SelectFieldProps {
  type: "select";
  options: { label: string; value: string }[];
  disabled?: boolean | undefined;
}

interface TextAreaFieldProps {
  type: "textarea";
  disabled?: boolean | undefined;
}

interface DateFieldProps {
  type: "date";
  disabled?: Matcher | Matcher[];
}

interface DateTimeFieldProps {
  type: "datetime";
  disabled?: Matcher | Matcher[];
  showSeconds?: boolean;
}

interface FileFieldProps {
  type: "file";
  disabled?: boolean | undefined;
}

interface RadioFieldProps {
  type: "radio";
  options: { label: string; value: string }[];
  disabled?: boolean | undefined;
}

interface ArrayFieldProps<TFieldValues extends FieldValues> {
  type: "array";
  element: (props: {
    field: FieldArrayWithId<TFieldValues>;
    remove: UseFieldArrayRemove;
    index: number;
  }) => React.ReactNode;
  renderAppend: (props: {
    append: UseFieldArrayAppend<TFieldValues, ArrayPath<TFieldValues>>;
  }) => React.ReactNode;
}

interface OthersFieldProps<TFieldValues extends FieldValues> {
  type: "others";
  render: (props: { field: ControllerRenderProps<TFieldValues, Path<TFieldValues>> }) => React.ReactNode;
}

export type DataFormFieldProps<TFieldValues extends FieldValues> = {
  type:
    | "text"
    | "number"
    | "password"
    | "select"
    | "textarea"
    | "date"
    | "datetime"
    | "file"
    | "radio"
    | "array"
    | "others";
  name: Path<TFieldValues>;
  label?: string;
  description?: string;
  placeholder?: string;
  className?: string;
} & (
  | TextFieldProps
  | NumberFieldProps
  | PasswordFieldProps
  | SelectFieldProps
  | TextAreaFieldProps
  | DateFieldProps
  | DateTimeFieldProps
  | FileFieldProps
  | RadioFieldProps
  | ArrayFieldProps<TFieldValues>
  | OthersFieldProps<TFieldValues>
);
