"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTuitionPage } from "@/lib/context/page/tuitionPageContext";
import Link from "next/link";
import { useTuitions } from "@/lib/context/collection/tuitionContext";
import { ArrowBackIosNew } from "@mui/icons-material";
import TuitionForm from "../../components/tuitionForm";

export default function UpdateTuitionPage({ params }: { params: { id: string } }) {
  const { tuition, setTuition } = useTuitionPage();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const { tuitions } = useTuitions();

  useEffect(() => {
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
  }, [params.id, setTuition, tuitions, tuition]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          router.back();
        }}
        className="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors mb-4"
      >
        <ArrowBackIosNew className="h-5 w-5 mr-2" />
        <h1 className="text-lg font-semibold">Update Tuition</h1>
      </button>
      <TuitionForm initialTuition={tuition}/>
    </>
  );
}
