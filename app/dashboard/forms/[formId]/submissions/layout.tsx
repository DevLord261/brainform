"use client";

import type React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit } from "lucide-react";
import { use } from "react";

export default function SubmissionsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ formId: string }>;
}) {
  const pathname = usePathname();
  const { formId } = use(params);

  const getActiveTab = () => {
    if (pathname.endsWith("/summary")) return "summary";
    if (pathname.endsWith("/questions")) return "questions";
    if (pathname.includes("/individual")) return "individual";
    if (pathname.endsWith("/table")) return "table";
    return "summary";
  };

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 sm:p-6 lg:p-8 border-b space-y-4 bg-background sticky top-0 z-10 print-hide">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="icon">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Submissions</h1>
              <p className="text-muted-foreground">
                View and analyze your form responses.
              </p>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href={`/dashboard/forms/${formId}`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Form
            </Link>
          </Button>
        </div>
        <Tabs value={getActiveTab()} className="w-full">
          <TabsList>
            <TabsTrigger value="summary" asChild>
              <Link href={`/dashboard/forms/${formId}/submissions/summary`}>
                Summary
              </Link>
            </TabsTrigger>
            <TabsTrigger value="questions" asChild>
              <Link href={`/dashboard/forms/${formId}/submissions/questions`}>
                Questions
              </Link>
            </TabsTrigger>
            <TabsTrigger value="individual" asChild>
              <Link href={`/dashboard/forms/${formId}/submissions/individual`}>
                Individual
              </Link>
            </TabsTrigger>
            <TabsTrigger value="table" asChild>
              <Link href={`/dashboard/forms/${formId}/submissions/table`}>
                Table View
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </header>
      <main className="flex-1 overflow-y-auto bg-muted/40 p-4 sm:p-6 lg:p-8 submissions-layout-main">
        {children}
      </main>
    </div>
  );
}
