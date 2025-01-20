"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ui/components/ui/breadcrumb";
import { Separator } from "@ui/components/ui/separator";
import { SidebarTrigger } from "@ui/components/ui/sidebar";
import { cn } from "@ui/utils";
import React from "react";

export interface DataHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  crumbs?: { title: string; href?: string }[];
  title: string;
  variant?: "default" | "raw";
}

export function DataHeader({ title, crumbs, variant = "default", className, ...props }: DataHeaderProps) {
  return (
    <header
      className={cn("w-full h-12 relative flex items-center justify-start py-2 px-3 lg:px-6", className)}
      {...props}
    >
      {variant === "default" && (
        <>
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </>
      )}
      <Breadcrumb>
        <BreadcrumbList>
          {crumbs?.map(({ title, href }, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <React.Fragment key={index}>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={href}>{title}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
            </React.Fragment>
          ))}
          <BreadcrumbItem>
            <BreadcrumbPage className="line-clamp-1 font-medium">{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
