"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/components/ui/tooltip";
import { cn } from "@ui/utils";
import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Tab {
  title: string;
  icon: LucideIcon;
  href: string;
  type?: never;
}

interface Separator {
  type: "separator";
  title?: never;
  icon?: never;
}

export type TabItem = Tab | Separator;

interface ExpandableTabsProps {
  tabs: TabItem[];
  className?: string;
  before?: React.ReactNode;
  after?: React.ReactNode;
}

const wrapperVariants = {
  initial: {
    gap: 0,
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? ".5rem" : 0,
    paddingLeft: isSelected ? "1rem" : ".5rem",
    paddingRight: isSelected ? "1rem" : ".5rem",
  }),
};

const spanVariants = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
};

const transition = { type: "spring", damping: 10, bounce: 0, duration: 0.6 };
const Separator = () => <div className="mx-1 h-[24px] w-[1.2px] bg-border" aria-hidden="true" />;

export function ExpandableTab(tab: TabItem) {
  const pathname = usePathname();
  if (tab.type === "separator") {
    return <Separator key={tab.type} />;
  }
  const Icon = tab.icon;
  const isSelected = tab.href === pathname;
  return (
    <motion.div
      key={tab.title}
      variants={wrapperVariants}
      initial={false}
      animate="animate"
      custom={isSelected}
      transition={transition}
      className={cn(
        "relative flex items-center rounded-xl p-2 text-sm font-medium transition-colors duration-300",
        isSelected ? "bg-muted text-primary" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={tab.href} className="flex items-center gap-2">
            <Icon size={20} />
            <AnimatePresence initial={false}>
              {isSelected && (
                <motion.span
                  variants={spanVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={transition}
                  className="overflow-hidden"
                >
                  {tab.title}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </TooltipTrigger>
        <TooltipContent>{tab.title}</TooltipContent>
      </Tooltip>
    </motion.div>
  );
}

export function ExpandableTabs({ before, tabs, className, after }: ExpandableTabsProps) {
  return (
    <div className={cn("flex flex-wrap items-center rounded-2xl border bg-background p-2 shadow-lg", className)}>
      {before}
      {tabs.map((tab, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <ExpandableTab key={index} {...tab} />
      ))}
      {after}
    </div>
  );
}
