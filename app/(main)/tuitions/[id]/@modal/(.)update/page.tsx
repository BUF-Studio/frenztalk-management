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
import { useStudentPage } from "@/lib/context/page/studentPageContext";
import { useEffect, useState } from "react";
import { useTuitions } from "@/lib/context/collection/tuitionContext";
import { useTuitionPage } from "@/lib/context/page/tuitionPageContext";
import TuitionForm from "../../../components/tuitionForm";

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

export default function UpdateTuitionModal({ params }: { params: { id: string } }) {
  const { tuition, setTuition } = useTuitionPage();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const { tuitions } = useTuitions();

  useEffect(() => {
    console.log("params", params);
    const fetchTuition = async () => {
      if (tuition && tuition.id === params.id) {
        setLoading(false);
        return;
      }

      const foundTuition = tuitions.find((t) => t.id === params.id);
      if (foundTuition) {
        setTuition(foundTuition);
        setLoading(false);
      }
    };

    fetchTuition();
  }, [params.id, setTuition, tuitions, tuition, params]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      <DialogContent className="sm:max-w-[550px] p-0 border-0">
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Update Tuition</CardTitle>
          </CardHeader>
          <CardContent>
            <TuitionForm initialTuition={tuition}/>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
