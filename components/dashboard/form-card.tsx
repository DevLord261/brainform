"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye, Edit, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FormWithId, Submission } from "@/lib/memory-store";
import { useEffect, useState } from "react";

interface FormCardProps {
  form: FormWithId;
  submissions: Submission[];
}

export function FormCard({ form, submissions }: FormCardProps) {
  const router = useRouter();
  const submissionCount = submissions.length;
  const [lastUpdatedAt, setlastUpdatedAt] = useState<Date | null>(null);
  const handleCardClick = () => {
    router.push(`/dashboard/forms/${form.id}/submissions`);
  };

  useEffect(() => {
    const updatedat =
      submissionCount > 0
        ? new Date(
            Math.max(
              ...submissions.map((s) => new Date(s.createdAt).getTime()),
            ),
          )
        : null;

    setlastUpdatedAt(updatedat);
  }, [submissionCount, submissions]);

  return (
    <Card
      onClick={handleCardClick}
      className="hover:shadow-md transition-shadow flex flex-col cursor-pointer"
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1 pr-2">
            <CardTitle className="line-clamp-1">{form.title}</CardTitle>
            <CardDescription className="line-clamp-2 h-[40px]">
              {form.description}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenuItem asChild>
                <Link
                  href={`/forms/${form.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View form
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/forms/${form.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit form
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/forms/${form.id}/submissions`}>
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Submissions
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-sm text-muted-foreground space-y-1">
          <div>Created: {new Date(form.createdAt).toLocaleDateString()}</div>
          <div>Created by: Admin User</div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-end text-sm text-muted-foreground">
        <div>
          {lastUpdatedAt ? (
            <span>Last updated: {lastUpdatedAt.toLocaleDateString()}</span>
          ) : (
            <span>No submissions yet</span>
          )}
        </div>
        <div className="font-medium text-foreground">
          {submissionCount} submission{submissionCount !== 1 ? "s" : ""}
        </div>
      </CardFooter>
    </Card>
  );
}
