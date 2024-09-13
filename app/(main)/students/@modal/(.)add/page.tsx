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

export default function AddStudentModal() {
  const router = useRouter();
  console.log("Hello from AddStudentModal");
  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      <DialogContent className="sm:max-w-[550px] p-0 border-0">
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Add Student</CardTitle>
          </CardHeader>
          <CardContent>
            <StudentForm />
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
