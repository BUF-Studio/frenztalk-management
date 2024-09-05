"use client";
import React from "react";
import ZoomForm from "../components/zoomForm";
import { ZoomAccount } from "@/lib/models/zoom";
import { useZoomAccounts } from "@/lib/context/collection/zoomContext";
import { useRouter } from "next/navigation";
import { ArrowBackIosNew } from "@mui/icons-material";

function EditZoom({ params }: { params: { id: string } }) {
  const { zoomAccounts } = useZoomAccounts();
  const zoom = zoomAccounts.find((account) => account.id === params.id);
  const router = useRouter();

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
        <h1 className="text-lg font-semibold">Edit Zoom Account</h1>
      </button>
      <ZoomForm zoom={zoom} />
    </>
  );
}

export default EditZoom;
