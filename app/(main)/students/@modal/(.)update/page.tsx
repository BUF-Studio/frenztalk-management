"use client";

import { useRouter } from "next/navigation";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  Card,
  CardContent,
} from "@/app/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/app/components/ui/dialog";
import StudentForm from "../../components/studentForm";
import { Suspense } from "react";
import { useStudentPage } from "@/lib/context/page/studentPageContext";

function LoadingContent() {
  return (
    <div className="animate-pulse">
      <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded mb-4" />
      <div className="space-y-2">
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded" />
      </div>
    </div>
  );
}

export default function UpdateStudentModal() {
  const router = useRouter();
  const { student } = useStudentPage();

  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      <DialogContent className="sm:max-w-[550px] p-0 border-0">
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Update Student</CardTitle>
          </CardHeader>
          <CardContent>
            <StudentForm initialStudent={student} />
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
