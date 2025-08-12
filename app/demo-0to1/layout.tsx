import { Metadata } from "next";

export const metadata: Metadata = {
  title: "0→1 Live Demo",
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
