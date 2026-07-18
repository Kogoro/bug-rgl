import type { Metadata } from "next";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Dashboard } from "@/dashboard/dashboard";

export const metadata: Metadata = {
  title: "Pluggable Dashboard POC",
  description:
    "A dashboard with pluggable, registry-driven widgets built on shadcn/ui and react-grid-layout.",
};

export default function DashboardPage() {
  return (
    <TooltipProvider>
      <Dashboard />
      <Toaster richColors closeButton />
    </TooltipProvider>
  );
}
