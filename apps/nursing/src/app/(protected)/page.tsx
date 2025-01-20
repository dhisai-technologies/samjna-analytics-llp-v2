import NursingLanding from "@/lib/images/nursing-landing.png";
import type { SearchParams } from "@config/utils";
import { DataError } from "@ui/components/registry/data-error";
import { DataPagination } from "@ui/components/registry/data-pagination";
import { Separator } from "@ui/components/ui/separator";
import Image from "next/image";
import { NursingTestCard } from "./_components/nursing-test-card";
import { NursingTestsToolbar } from "./_components/nursing-tests-toolbar";
import { getNursingTests } from "./_lib/queries";

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const result = await getNursingTests(searchParams);
  if ("error" in result) {
    return <DataError {...result.error} />;
  }
  const { pageCount, nursingTests } = result;
  return (
    <main className="p-3 lg:p-6 grid gap-3">
      <div>
        <h1 className="text-xl font-semibold">Nursing Tests</h1>
        <p className="text-muted-foreground text-sm">Oversee, organize, and analyze nursing tests effectively.</p>
      </div>
      <Separator />
      <div className="grid gap-3">
        <NursingTestsToolbar />
        {pageCount === 1 && nursingTests.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center gap-3">
            <Image src={NursingLanding} alt="nursing" height={400} priority />
            <p className="text-muted-foreground">No nursing tests found. Create one to get started.</p>
          </div>
        )}
        <div className="grid lg:grid-cols-3 gap-3">
          {nursingTests.map((nursingTest) => (
            <NursingTestCard key={nursingTest.id} nursingTest={nursingTest} />
          ))}
        </div>
        {pageCount > 1 && <DataPagination pageCount={pageCount} defaultPerPage={5} className="justify-end" />}
      </div>
    </main>
  );
}
