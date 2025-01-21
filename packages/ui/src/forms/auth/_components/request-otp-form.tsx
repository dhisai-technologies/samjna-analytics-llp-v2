import { useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";

import type { Module } from "@config/core";
import { apps } from "@config/ui";
import { Loaders } from "@ui/components/loaders";
import { DataForm, DataFormContainer, DataFormError, DataFormField } from "@ui/components/registry/data-form";
import { Button, buttonVariants } from "@ui/components/ui/button";
import { useDataFormState } from "@ui/hooks/use-data-form-state";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { verifyUserOtp } from "../_lib/actions";
import type { VerifyUserOtpSchema } from "../_lib/validations";

interface RequestOtpFormProps {
  setEmail: React.Dispatch<React.SetStateAction<string | undefined>>;
  module: Module;
  hideAssessmentLink?: boolean;
}

export function RequestOtpForm({ setEmail, module, hideAssessmentLink }: RequestOtpFormProps) {
  const form = useForm<VerifyUserOtpSchema>({
    defaultValues: {
      email: "",
      module,
      otp: "123456",
    },
  });
  const [state, action] = useDataFormState(verifyUserOtp, {
    onSuccess: () => {
      toast.success("OTP sent successfully");
    },
  });

  function FormSubmission() {
    const { pending } = useFormStatus();
    return (
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? <Loaders.buttonLoader caption={"Signing In..."} /> : <span>Continue to sign in</span>}
      </Button>
    );
  }

  useEffect(() => {
    if (state?.success) {
      setEmail(form.getValues().email);
    }
  }, [state, form, setEmail]);

  const app = Object.values(apps).find((app) => app.key === module);

  return (
    <DataFormContainer
      type="card"
      containerClassName="border-none shadow-none w-full"
      className="p-0 w-full min-w-[280px] sm:min-w-96"
    >
      <DataForm form={form} state={state} action={action} className="w-full">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome to {app?.name}</h1>
          <p className="text-sm text-muted-foreground">Enter your email below to request for OTP</p>
        </div>
        <DataFormField type="text" name="email" placeholder="johndoe@xcompany.com" />
        <input hidden {...form.register("module")} />
        <input hidden {...form.register("otp")} />
        <DataFormError />
        <FormSubmission />
        {!hideAssessmentLink && (
          <Link href="/auth/assessment" className={buttonVariants({ variant: "link" })}>
            Take the assessment
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Link>
        )}
      </DataForm>
    </DataFormContainer>
  );
}
