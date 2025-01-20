import type { User } from "@config/core";
import { getDefaultProfile } from "@packages/utils/helpers";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/components/ui/avatar";
import { HoverCard, HoverCardTrigger } from "@ui/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@ui/components/ui/tooltip";
import { cn } from "@ui/utils";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";
import { UserHoverCardContent } from "./user-hover-card-content";

const avatarStackVariants = cva("flex cursor-pointer", {
  variants: {
    orientation: {
      vertical: "flex-row",
      horizontal: "flex-col",
    },
    spacing: {
      sm: "-space-x-5 -space-y-5",
      md: "-space-x-4 -space-y-4",
      lg: "-space-x-3 -space-y-3",
      xl: "-space-x-2 -space-y-2",
    },
  },
  defaultVariants: {
    orientation: "vertical",
    spacing: "md",
  },
});

export interface AvatarStackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarStackVariants> {
  avatars: User[];
  maxAvatarsAmount?: number;
}

const AvatarStack = ({
  className,
  orientation,
  avatars,
  spacing,
  maxAvatarsAmount = 3,
  ...props
}: AvatarStackProps) => {
  const shownAvatars = avatars.slice(0, maxAvatarsAmount);
  const hiddenAvatars = avatars.slice(maxAvatarsAmount);

  return (
    <div
      className={cn(
        avatarStackVariants({ orientation, spacing }),
        className,
        orientation === "horizontal" ? "-space-x-0" : "-space-y-0",
      )}
      {...props}
    >
      {shownAvatars.map((user) => {
        const profile = getDefaultProfile(user.name);
        return (
          <HoverCard key={user.id}>
            <HoverCardTrigger asChild>
              <Avatar className={cn(avatarStackVariants(), "hover:z-10")}>
                <AvatarImage src="" />
                <AvatarFallback
                  style={{
                    backgroundColor: profile.bgColor,
                    color: profile.textColor,
                  }}
                  className="font-semibold border border-background"
                >
                  {profile.initials}
                </AvatarFallback>
              </Avatar>
            </HoverCardTrigger>
            <UserHoverCardContent user={user} />
          </HoverCard>
        );
      })}
      {hiddenAvatars.length ? (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar key="Excessive avatars">
                <AvatarFallback>+{avatars.length - shownAvatars.length}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              {hiddenAvatars.map((user) => (
                <p key={user.id}>{user.name}</p>
              ))}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : null}
    </div>
  );
};

export { AvatarStack, avatarStackVariants };
