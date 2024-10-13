"use client";

import { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import { useStudents } from "@/lib/context/collection/studentsContext";
import { useSubjects } from "@/lib/context/collection/subjectContext";
import { useTuitions } from "@/lib/context/collection/tuitionContext";
import { InvoiceStatus } from "@/lib/models/invoiceStatus";
import { capitalizeFirstLetter } from "@/lib/utils";
import { Payment } from "@/lib/models/payment";
import { updatePayment } from "@/lib/firebase/payment";
import { toast } from "@/app/components/hooks/use-toast";
import { useTutors } from "../context/collection/tutorContext";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/lib/firebase/service/clientApp";

interface PaymentTemplateProps {
  initialPayment: Payment | null;
}

export default function PaymentTemplate({
  initialPayment,
}: PaymentTemplateProps) {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const { tutors } = useTutors();
  const { subjects } = useSubjects();
  const { tuitions } = useTuitions();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const tutor = tutors.find((t) => t.id === initialPayment?.tutorId);
  const subject = subjects.find((s) => s.id === initialPayment?.subjectId);
  const tuition = tuitions.find((t) => t.id === initialPayment?.tuitionId);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const logoRef = ref(storage, "frenztalk-logo.jpg");
        const url = await getDownloadURL(logoRef);
        setLogoUrl(url);
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };
    fetchLogo();
  }, []);

  const generatePDF = () => {
    const element = document.getElementById("payment");
    if (element) {
      const opt = {
        margin: 10,
        filename: "payment.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      html2pdf().set(opt).from(element).save();
    }
  };

  function getStatusVariant(
    status: string | undefined
  ): "default" | "secondary" | "destructive" | "outline" | undefined {
    if (!status) {
      return "destructive";
    }

    switch (status.toLowerCase()) {
      case InvoiceStatus.PAID:
        return "outline";
      case InvoiceStatus.PENDING:
        return "default";
      default:
        return "destructive";
    }
  }

  const handleStatusChange = async (status: InvoiceStatus) => {
    if (!initialPayment) return;

    try {
      const updatedPayment = new Payment(
        initialPayment.id,
        initialPayment.tuitionId,
        initialPayment.tutorId,
        initialPayment.studentId,
        initialPayment.subjectId,
        initialPayment.rate,
        status,
        initialPayment.startDateTime,
        initialPayment.duration,
        initialPayment.currency,
        initialPayment.price
      );
      await updatePayment(updatedPayment);
      toast({
        title: "Status Updated Successfully",
        description: `Payment status has been updated to ${status}`,
      });
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast({
        title: "Error Updating Status",
        description: "An error occurred while updating the status.",
        variant: "destructive",
      });
    }
  };

  if (!initialPayment) {
    return <div className="text-center p-4">No payment data available</div>;
  }

  return (
    <div
      id="payment"
      className="font-sans min-w-[768px] max-w-[768px] mx-auto p-6 bg-background text-foreground"
    >
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex items-center mb-4 gap-4">
            <div className="w-8 h-8">
              {logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt="Frenztalk Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              )}
            </div>
            <h2 className="text-lg font-medium text-primary">
              Payment Statement
            </h2>
          </div>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{initialPayment.id}</h2>
              <Badge variant={getStatusVariant(initialPayment.status)}>
                {capitalizeFirstLetter(initialPayment.status)}
              </Badge>
            </div>
            <div className="flex gap-2" data-html2canvas-ignore>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Change Status</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {Object.values(InvoiceStatus)
                    .filter((status) => status !== initialPayment.status)
                    .map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => handleStatusChange(status)}
                      >
                        {capitalizeFirstLetter(status)}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" onClick={generatePDF}>
                Download
                <Download className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
        {/* Rest of the component remains the same */}
        {/* ... */}
        <div className="flex justify-between">
          <div>
            <p className="text-md mb-1 text-muted-foreground">Billed to:</p>
            <strong className="font-bold text-lg mb-1">{tutor?.name}</strong>
            {/* <div className="text-sm">
              <p><span className="font-medium">Email:</span> --</p>
              <p><span className="font-medium">Phone No.:</span> --</p>
            </div> */}
          </div>
          <div className="flex flex-col items-end">
            <p className="text-md mb-1 text-muted-foreground">
              Payment Information
            </p>
            <strong className="font-bold text-md mb-1">FREN TALK HUB</strong>
            <p className="font-normal text-sm mb-1">04400099507</p>
            <p className="font-normal text-sm mb-1">Hong Leong Bank</p>
          </div>
        </div>
        <div className="grid grid-cols-3 border border-border">
          <div className="p-4 border-r border-border">
            <p className="font-normal text-sm text-muted-foreground">
              Date Issued:
            </p>
            <p className="mt-1 font-bold text-md">
              {new Date(initialPayment?.startDateTime).toDateString()}
            </p>
          </div>
          <div className="p-4 border-r border-border">
            <p className="font-normal text-sm text-muted-foreground">
              Due Date:
            </p>
            <p className="mt-1 font-bold text-md">--</p>
          </div>
          <div className="p-4">
            <p className="font-normal text-sm text-muted-foreground">
              Due Amount:
            </p>
            <p className="mt-1 font-bold text-md">{`${
              initialPayment?.currency
            } ${initialPayment?.rate.toFixed(2)}`}</p>
          </div>
        </div>
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-md py-3 px-4 font-bold text-muted-foreground">
                Description
              </th>
              <th className="text-left text-md py-3 px-4 font-bold text-muted-foreground">
                Date
              </th>
              <th className="text-center text-md py-3 px-4 font-bold text-muted-foreground">
                Quantity
              </th>
              <th className="text-center text-md py-3 px-4 font-bold text-muted-foreground">
                Unit Price (RM)
              </th>
              <th className="text-right text-md py-3 px-4 font-bold text-muted-foreground">
                Total (RM)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="py-3 px-4">{subject?.name}</td>
              <td className="py-3 px-4">
                {new Date(tuition?.startTime!).toDateString()}
              </td>
              <td className="py-3 px-4 text-center">{tuition?.duration}</td>
              <td className="py-3 px-4 text-center">
                {tuition?.studentPrice.toFixed(2)}
              </td>
              <td className="py-3 px-4 text-right">
                {(
                  (tuition?.studentPrice ?? 0) *
                  (tuition?.duration! / 60)
                ).toFixed(2)}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="py-4 px-4 text-right font-medium">
                Subtotal
              </td>
              <td className="py-4 px-4 text-right">
                {initialPayment?.rate.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td colSpan={4} className="px-4 text-right font-medium">
                Discount
              </td>
              <td className="px-4 text-right">--</td>
            </tr>
            <tr>
              <td
                colSpan={4}
                className="py-3 px-4 text-right font-bold text-xl"
              >
                Total
              </td>
              <td className="py-3 px-4 text-right font-bold text-xl">
                {`${initialPayment?.currency} ${initialPayment?.rate.toFixed(
                  2
                )}`}
              </td>
            </tr>
          </tfoot>
        </table>
        <div>
          <p className="font-normal text-xl mb-2">
            Thanks for choosing Frenztalk!
          </p>
          <p className="font-normal text-sm text-muted-foreground">
            Kindly forward your payment receipt to the WhatsApp group after
            payment.
          </p>
          <p className="font-normal text-sm text-muted-foreground">
            Thank you and have a nice day!
          </p>
        </div>
      </div>
    </div>
  );
}
