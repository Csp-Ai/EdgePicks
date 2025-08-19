"use client";
import React, { useId } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

interface Props {
  content: React.ReactNode;
  children: React.ReactElement;
}

export function AccessibleTooltip({ content, children }: Props) {
  const id = useId();
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {React.cloneElement(children, {
            tabIndex: children.props.tabIndex ?? 0,
            "aria-describedby": id,
          })}
        </TooltipTrigger>
        <TooltipContent id={id} role="tooltip" className="bg-black text-white px-2 py-1 rounded">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
