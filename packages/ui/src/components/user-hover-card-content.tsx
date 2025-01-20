import type { User } from "@config/core";
import { cn } from "@ui/utils";
import { getDefaultProfile } from "@utils/helpers";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { HoverCardContent } from "./ui/hover-card";
import { Skeleton } from "./ui/skeleton";

const UserHoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardContent>,
  React.ComponentPropsWithoutRef<typeof HoverCardContent> & { user?: User }
>(({ user, className, ...props }, ref) => {
  const profile = getDefaultProfile(user?.name || "Anonymous User");
  return (
    <HoverCardContent ref={ref} className={cn("p-3", className)} {...props}>
      {user ? (
        <div className="flex items-center space-x-2">
          <Avatar className="w-10 h-10 text-xs">
            <AvatarImage src="" />
            <AvatarFallback
              style={{
                backgroundColor: profile.bgColor,
                color: profile.textColor,
              }}
              className="font-semibold"
            >
              {profile.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h2 className="text-sm font-semibold  mb-0">{user.name}</h2>
            <p className="text-xs text-muted-foreground mb-0">{user.email}</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      )}
    </HoverCardContent>
  );
});

UserHoverCardContent.displayName = "UserHoverCardContent";

export { UserHoverCardContent };
