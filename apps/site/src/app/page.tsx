import { Button } from "@ui/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Page() {
  return (
    <main className="container mx-auto">
      <div className="flex h-[calc(100vh-theme(spacing.14))] items-center justify-center gap-32">
        <Image src="/landing.png" alt="Landing" width={500} height={500} className="w-96 h-auto" />
        <div className="space-y-3">
          <h1 className="font-bold text-4xl text-foreground">The face is the index of the mind</h1>
          <p className="text-muted-foreground pb-3">
            Not feeling your best? We are here to help you recognize your inner self
          </p>
          <Button asChild>
            <a href="/">
              <span className="font-medium">Recognize Yourself</span>
              <ArrowRight className="ml-1 size-4" />
            </a>
          </Button>
        </div>
      </div>
    </main>
  );
}
