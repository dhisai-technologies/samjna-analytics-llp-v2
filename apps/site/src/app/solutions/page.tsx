import { CrossPatternCard, CrossPatternCardBody } from "@ui/components/cross-pattern-card";
import { Brain, Command, Computer } from "lucide-react";

export default function Page() {
  const solutions = [
    {
      title: "Poshanam",
      icon: Command,
      color: "text-green-500",
    },
    {
      title: "Chinta",
      icon: Brain,
      color: "text-blue-500",
    },
    {
      title: "Shabdhkosh",
      icon: Computer,
      color: "text-yellow-500",
    },
  ];
  return (
    <main className="container mx-auto">
      <div className="flex h-[calc(100vh-theme(spacing.14))] items-center justify-center flex-col">
        <h2 className="text-3xl font-bold text-center mb-12">Our Solutions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution) => (
            <CrossPatternCard key={solution.title} className="border shadow-xl">
              <CrossPatternCardBody className="flex flex-col items-center justify-center text-center">
                <solution.icon size={28} className={solution.color} />
                <h3 className="text-lg font-bold mb-1 mt-3 text-foreground">{solution.title}</h3>
              </CrossPatternCardBody>
            </CrossPatternCard>
          ))}
        </div>
      </div>
    </main>
  );
}
