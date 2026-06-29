"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-auth";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, isError } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (isError) router.replace("/login");
  }, [isError, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F4EE]">
        <Loader2 className="h-6 w-6 animate-spin text-[#1F6F4F]" />
      </div>
    );
  }

  if (!user) return null;

  return <DashboardShell user={user}>{children}</DashboardShell>;
}