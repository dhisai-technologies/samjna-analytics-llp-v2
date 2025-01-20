"use client";

import { cn } from "@ui/utils";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

export function CountAnimation({
  number,
  className,
}: {
  number: number;
  className?: string;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const animation = animate(count, number, { duration: 2 });
    return animation.stop;
  }, []);

  return <motion.h1 className={cn(className)}>{rounded}</motion.h1>;
}
