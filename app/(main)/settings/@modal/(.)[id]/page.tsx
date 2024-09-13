"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Dialog, DialogContent } from "@/app/components/ui/dialog";
import { useZoomAccounts } from "@/lib/context/collection/zoomContext";
import { useRouter } from "next/navigation";
import ZoomForm from "../../components/zoomForm";

function EditZoomModal({ params }: { params: { id: string } }) {
  const { zoomAccounts } = useZoomAccounts();
  const zoom = zoomAccounts.find((account) => account.id === params.id);
  const router = useRouter();

  return (
    <Dialog open={true} onOpenChange={() => router.back()}>
      <DialogContent className="sm:max-w-[550px] p-0 bg-white border-0">
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Edit Zoom Account</CardTitle>
            {/* <CardDescription>Card Description</CardDescription> */}
          </CardHeader>
          <CardContent>
            <ZoomForm zoom={zoom}/>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

export default EditZoomModal;
