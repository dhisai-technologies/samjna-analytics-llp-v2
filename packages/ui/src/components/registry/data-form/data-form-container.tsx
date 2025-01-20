"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@ui/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@ui/components/ui/sheet";
import { cn } from "@ui/utils";
import { createContext, useContext } from "react";
import { match } from "ts-pattern";

interface DataFormContainerContextType {
  type: "dialog" | "sheet" | "card";
}

const DataFormContainerContext = createContext<DataFormContainerContextType | undefined>(undefined);

interface DataFormDialogProps extends React.ComponentPropsWithRef<typeof Dialog> {
  type: "dialog";
}

interface DataFormSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  type: "sheet";
}

interface DataFormCardProps extends React.ComponentPropsWithRef<typeof Card> {
  type: "card";
  containerClassName?: string;
}

type DataFormContainerProps = {
  type: "dialog" | "sheet" | "card";
  title?: string;
  description?: string;
  className?: string;
  headerClassName?: string;
} & (DataFormDialogProps | DataFormSheetProps | DataFormCardProps);

export function DataFormContainer(props: DataFormContainerProps) {
  return match(props)
    .with({ type: "dialog" }, ({ type, title, description, headerClassName, className, children, ...props }) => (
      <DataFormContainerContext.Provider value={{ type }}>
        <Dialog {...props}>
          <DialogContent className={cn("min-w-[50vw]", className)}>
            <DialogHeader className={headerClassName}>
              <DialogTitle>{title || "Form title"}</DialogTitle>
              <DialogDescription>{description || "Form description"}</DialogDescription>
            </DialogHeader>
            {children}
          </DialogContent>
        </Dialog>
      </DataFormContainerContext.Provider>
    ))
    .with({ type: "sheet" }, ({ type, title, description, headerClassName, className, children, ...props }) => (
      <DataFormContainerContext.Provider value={{ type }}>
        <Sheet {...props}>
          <SheetContent className={cn("flex flex-col gap-6 w-full sm:w-auto sm:max-w-md", className)}>
            <SheetHeader className={cn("text-left", headerClassName)}>
              <SheetTitle>{title || "Form title"}</SheetTitle>
              <SheetDescription>{description || "Form description"}</SheetDescription>
            </SheetHeader>
            {children}
          </SheetContent>
        </Sheet>
      </DataFormContainerContext.Provider>
    ))
    .with(
      { type: "card" },
      ({ type, title, description, className, headerClassName, containerClassName, children, ...props }) => (
        <DataFormContainerContext.Provider value={{ type }}>
          <Card className={containerClassName} {...props}>
            <CardContent className={cn("pt-6", className)}>
              {(title || description) && (
                <CardHeader className={headerClassName}>
                  {title && <CardTitle>{title}</CardTitle>}
                  {description && <CardDescription>{description}</CardDescription>}
                </CardHeader>
              )}
              {children}
            </CardContent>
          </Card>
        </DataFormContainerContext.Provider>
      ),
    )
    .exhaustive();
}

export function useDataFormContainer() {
  const context = useContext(DataFormContainerContext);
  if (!context) {
    throw new Error("useDataFormContainer must be used within a DataFormContainer");
  }
  return context;
}
