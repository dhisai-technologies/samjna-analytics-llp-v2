import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { PreviewFooter } from "./preview-footer";
import { PreviewHeader } from "./preview-header";

export function Preview() {
  return (
    <div className="bg-custom-background">
      <PreviewHeader />
      <ScrollArea className="h-[calc(100vh-theme(spacing.14))]">
        <main className="container mx-auto">
          <div className="flex h-[calc(100vh-theme(spacing.14))] items-center justify-center gap-32">
            <Image src="/landing.png" alt="Landing" width={500} height={500} className="w-96 h-auto" />
            <div className="space-y-3">
              <h1 className="font-bold text-4xl">The face is the index of the mind</h1>
              <p className="text-muted-foreground pb-3">
                Not feeling your best? We are here to help you recognize your inner self
              </p>
              <Button asChild>
                <Link href="/auth/login">
                  <span className="font-medium">Recognize Yourself</span>
                  <ArrowRight className="ml-1 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </main>
        <PreviewFooter />
      </ScrollArea>
    </div>
  );
}
