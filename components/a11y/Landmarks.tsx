import * as React from "react";
type Props = React.HTMLAttributes<HTMLElement> & { as?: keyof JSX.IntrinsicElements };
export default function Landmarks({ as: As = "main", ...rest }: Props) {
  const Comp: any = As;
  return <Comp {...rest} />;
}
