import { redirect } from "next/navigation";
export const revalidate = 0;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function Page() {
  redirect("/agent-interface");
}
