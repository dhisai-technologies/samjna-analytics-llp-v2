import { LoginForm } from "@ui/forms/auth";

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center w-full">
      <LoginForm module="ADMIN" hideAssessmentLink />
    </main>
  );
}
