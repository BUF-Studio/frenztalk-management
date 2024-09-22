"use client";

import TuitionList from "@/app/components/main/tuitionList";
import { useTuitions } from "@/lib/context/collection/tuitionContext";
import { useTuitionPage } from "@/lib/context/page/tuitionPageContext";
import { useRouter } from "next/navigation";

export default function StudentList() {
  const router = useRouter();
  const { setTuition } = useTuitionPage();
  const { endTuitions } = useTuitions();

  return (
    <div>
      <div className="flex flex-1 flex-row w-full justify-between items-center pb-4">
        <h1 className="text-xl font-bold">History Class</h1>
        <div className="flex flex-row items-center space-x-4">
          {/* <Link href="/students/add" prefetch={true}>
            <Button variant={"default"}>Add Student</Button>
          </Link> */}
        </div>
      </div>
      <TuitionList tuitions={endTuitions}></TuitionList>
      
    </div>
  );
}
