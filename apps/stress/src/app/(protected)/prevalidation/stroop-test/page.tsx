import { DataHeader } from "@ui/components/registry/data-header";
import { Button } from "@ui/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui/components/ui/card";
import { Separator } from "@ui/components/ui/separator";
import { History } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <DataHeader
        title="Stroop Test"
        variant="raw"
        crumbs={[
          {
            title: "Prevalidation",
            href: "/prevalidation",
          },
        ]}
        className="border-b"
      />
      <main className="p-3 md:p-6">
        <Card className="space-y-6 w-full md:w-[50vw] mx-auto flex flex-col">
          <CardHeader className="pb-0">
            <CardTitle>Stroop Test</CardTitle>
            <CardDescription>Please select the level you wish to take.</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="flex flex-col items-center justify-center gap-3">
            <div className="flex items-center justify-center gap-3">
              <Button asChild variant="outline" className="w-32">
                <Link href="/prevalidation/stroop-test/level-3">Level 1</Link>
              </Button>
              <Button asChild variant="outline" className="w-32">
                <Link href="/prevalidation/stroop-test/level-3">Level 2</Link>
              </Button>
              <Button asChild variant="outline" className="w-32">
                <Link href="/prevalidation/stroop-test/level-3">Level 3</Link>
              </Button>
            </div>
            <Button asChild variant="secondary" className="ml-10">
              <Link href="/prevalidation/stroop-test/sessions">
                <History className="size-3 mr-2" /> Previous Stroop Sessions
              </Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
