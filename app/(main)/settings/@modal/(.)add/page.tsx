"use client";

import { useRouter } from "next/navigation";
import ZoomForm from "../../components/zoomForm";
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
import { DialogDescription } from "@radix-ui/react-dialog";

export default function AddZoomModal() {
  const router = useRouter();
  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      <DialogContent className="sm:max-w-[550px] p-0 bg-white border-0">
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Add Zoom Account</CardTitle>
            {/* <CardDescription>Card Description</CardDescription> */}
          </CardHeader>
          <CardContent>
            <ZoomForm />
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
