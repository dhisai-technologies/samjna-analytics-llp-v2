import { Button } from "@ui/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui/components/ui/card";
import { Separator } from "@ui/components/ui/separator";
import { MoveRight } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <main className="p-3 md:p-6">
      <Card className="space-y-6 w-full md:w-[50vw] mx-auto flex flex-col">
        <CardHeader className="pb-0">
          <CardTitle>Prevalidation</CardTitle>
          <CardDescription>Please select one of the tests below to begin the prevalidation process.</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          <Button asChild>
            <Link href="/prevalidation/stroop-test">
              Stroop Test <MoveRight className="size-3 ml-2" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
