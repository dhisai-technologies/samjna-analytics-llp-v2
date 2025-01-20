import type { SearchParams } from "@config/utils";
import { AssessmentForm } from "@ui/forms/auth";

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main className="flex flex-col items-center justify-center w-full">
      <AssessmentForm module="NURSING" assessmentSearchParam="nursingTestId" searchParams={searchParams} />
    </main>
  );
}
