import InterviewLanding from "@/lib/images/interview-landing.png";
import type { SearchParams } from "@config/utils";
import { DataError } from "@ui/components/registry/data-error";
import { DataPagination } from "@ui/components/registry/data-pagination";
import { Separator } from "@ui/components/ui/separator";
import { getSessionUser } from "@utils/server";
import Image from "next/image";
import { InterviewCard } from "./_components/interview-card";
import { InterviewsToolbar } from "./_components/interviews-toolbar";
import { getInterviews } from "./_lib/queries";

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const result = await getInterviews(searchParams);
  const user = getSessionUser();
  if ("error" in result) {
    return <DataError {...result.error} />;
  }
  const { pageCount, interviews } = result;
  return (
    <main className="p-3 lg:p-6 grid gap-3">
      <div>
        <h1 className="text-xl font-semibold">Interviews</h1>
        <p className="text-muted-foreground text-sm">Oversee, organize, and analyze interview processes effectively.</p>
      </div>
      <Separator />
      <div className="grid gap-3">
        <InterviewsToolbar />
        {pageCount === 1 && interviews.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-3">
            <Image src={InterviewLanding} alt="interview" height={400} priority />
            {user.role === "ORGANIZATION" ? (
              <p className="text-muted-foreground">No interviews found. Create one to get started.</p>
            ) : (
              <p className="text-muted-foreground">No scheduled interviews found</p>
            )}
          </div>
        )}
        <div className="grid lg:grid-cols-3 gap-3">
          {interviews.map((interview) => (
            <InterviewCard key={interview.id} interview={interview} />
          ))}
        </div>
        {pageCount > 1 && <DataPagination pageCount={pageCount} defaultPerPage={5} className="justify-end" />}
      </div>
    </main>
  );
}
