export const dynamic = "force-dynamic";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { memoryStore } from "@/lib/memory-store";
import { FormCard } from "@/components/dashboard/form-card";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Form } from "@/lib/types";

export default async function DashboardPage() {
  const callforms = await fetch("http://localhost:3000/api/dashboard", {
    cache: "force-cache",
  });
  const forms = await callforms.json();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <AuthGuard requireAuth={true}>
      <div className="h-full bg-gray-100/40 dark:bg-gray-900/50 p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">{today}</p>
          </div>
        </div>

        <div className="relative rounded-lg border bg-card text-card-foreground shadow-sm p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <blockquote className="text-lg font-medium text-center text-blue-800 dark:text-blue-200">
            &ldquo;Your time is limited, so don&apos;t waste it living someone
            else&apos;s life.&rdquo;
          </blockquote>
          <cite className="block text-right mt-2 text-sm text-blue-600 dark:text-blue-400">
            &mdash; Steve Jobs
          </cite>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Forms</CardTitle>
            <CardDescription>
              Manage your existing forms or create a new one.
            </CardDescription>
            <div className="pt-4">
              <Input placeholder="Search forms..." />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              <Link href="/dashboard/forms/new">
                <Card className="flex flex-col items-center justify-center p-6 border-2 border-dashed hover:border-primary/50 hover:bg-accent transition-colors cursor-pointer h-full">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <PlusCircle className="h-12 w-12 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">Create New Form</h3>
                    <p className="text-sm text-muted-foreground">
                      Start from scratch with a blank canvas.
                    </p>
                  </div>
                </Card>
              </Link>
              {forms.map((form: Form) => {
                const submissions = memoryStore.getSubmissions(form.id);
                return (
                  <FormCard
                    key={form.id}
                    form={form}
                    submissions={submissions}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
