import * as React from "react";

import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  as?: keyof JSX.IntrinsicElements; // optional polymorphic
};

export default function Landmarks({ as: As = "main", ...rest }: Props) {
  const Comp: any = As;
  return <Comp className={cn(rest.className)} {...rest} />;
}
