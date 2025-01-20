import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";

import type { Module } from "@config/core";
import { Loaders } from "@ui/components/loaders";
import { DataForm, DataFormContainer, DataFormError } from "@ui/components/registry/data-form";
import { Button } from "@ui/components/ui/button";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@ui/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@ui/components/ui/input-otp";
import { useDataFormState } from "@ui/hooks/use-data-form-state";
import { getErrorMessage } from "@utils/helpers";
import { toast } from "sonner";
import { resendUserOtp, verifyUserOtp } from "../_lib/actions";
import type { VerifyUserOtpSchema } from "../_lib/validations";

interface VerifyOtpFormProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string | undefined>>;
  module: Module;
}

export function VerifyOtpForm({ email, setEmail, module }: VerifyOtpFormProps) {
  const [countdown, setCountdown] = useState(60); // 60 seconds countdown
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<VerifyUserOtpSchema>({
    defaultValues: {
      email: email,
      otp: "",
      module,
    },
  });
  const [state, action] = useDataFormState(verifyUserOtp, {
    onSuccess: () => {
      toast.success("Logged in successfully");
    },
  });

  function handleResendOtp(email: string) {
    if (!email) {
      setEmail(undefined);
      toast.error("Session expired, please request for OTP again");
      return;
    }
    setIsLoading(true);
    toast.promise(resendUserOtp({ email, module }), {
      loading: "Resending OTP",
      success: () => {
        setIsLoading(false);
        setIsResendDisabled(true);
        setCountdown(60);
        return "OTP Resent successfully";
      },
      error: (err) => {
        setIsLoading(false);
        setIsResendDisabled(true);
        setCountdown(60);
        return getErrorMessage(err);
      },
    });
  }

  function FormSubmission() {
    const { pending } = useFormStatus();
    return (
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? <Loaders.buttonLoader caption={"Verifying..."} /> : <span>Continue</span>}
      </Button>
    );
  }

  useEffect(() => {
    form.setValue("email", email);
  }, [email, form]);

  useEffect(() => {
    if (!isResendDisabled) return;
    // Start countdown when component mounts
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(interval); // Clear interval when countdown reaches 0
          setIsResendDisabled(false); // Enable resend button
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [isResendDisabled]);

  return (
    <DataFormContainer type="card" containerClassName="border-none shadow-none w-full" className="p-0">
      <DataForm form={form} state={state} action={action}>
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Verify yourself</h1>
        </div>
        <input hidden {...form.register("email")} />
        <input hidden {...form.register("module")} />
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} className="rounded-r-md" />
                    <div className="flex w-10 justify-center items-center">
                      <div className="w-3 h-1 rounded-full bg-border" />
                    </div>
                    <InputOTPSlot index={3} className="rounded-l-md border-l" />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your email <span className="text-foreground">{email}</span>.
              </FormDescription>
              <FormMessage>{state?.errors?.email || state?.errors?.otp}</FormMessage>
            </FormItem>
          )}
        />
        <DataFormError />
        <div className="text-muted-foreground text-xs flex items-center gap-1">
          <span>Haven't received the OTP yet?</span>
          <div>
            {isResendDisabled ? (
              <p>
                Resend OTP in <span className="text-foreground font-medium">{countdown}</span> seconds
              </p>
            ) : (
              <button
                type="button"
                className="text-foreground font-medium underline"
                onClick={() => handleResendOtp(email)}
                disabled={isLoading}
              >
                Resend
              </button>
            )}
          </div>
        </div>
        <FormSubmission />
      </DataForm>
    </DataFormContainer>
  );
}
