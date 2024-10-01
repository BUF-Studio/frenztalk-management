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
import { useSnackbar } from "@/lib/context/component/SnackbarContext";
import { capitalizeFirstLetter } from "@/lib/utils";
import { Payment } from "../models/payment";
import { updatePayment } from "../firebase/payment";

interface PaymentTemplateProps {
  payment: Payment | null;
}

export default function PaymentTemplate({ payment }: PaymentTemplateProps) {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const { students } = useStudents();
  const { subjects } = useSubjects();
  const { tuitions } = useTuitions();
  const { showSnackbar } = useSnackbar();

  const tuition = tuitions.find((t) => t.id === payment?.tuitionId);
  const tutor = students.find((s) => s.id === payment?.tutorId);
  const subject = subjects.find((s) => s.id === payment?.subjectId);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setLogoLoaded(true);
    img.src = "/frenztalk-logo.jpg";
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
        return "secondary";
      case InvoiceStatus.PENDING:
        return "default";
      case InvoiceStatus.CANCEL:
        return "outline";
      default:
        return "destructive";
    }
  }
  const handleStatusChange = async (status: InvoiceStatus) => {
    if (payment) {
      const updatedPayment = new Payment(
        payment.id,
        payment.tuitionId,
        payment.tutorId,
        payment.studentId,
        payment.subjectId,
        payment.rate,
        status,
        payment.startDateTime,
        payment.duration,
        payment.currency,
        payment.price
      );
      await updatePayment(updatedPayment);
      showSnackbar("Payment status updated", "success");
    }
  };

  return (
    <div
      id="payment"
      className="font-sans min-w-[768px] max-w-[768px] mx-auto p-6 bg-background text-foreground"
    >
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex items-center mb-4 gap-4">
            <div className="w-8 h-8">
              {logoLoaded && (
                <img
                  src="/frenztalk-logo.jpg"
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
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold">{payment?.id}</h2>
              <Badge variant={getStatusVariant(payment?.status)}>
                {capitalizeFirstLetter(payment?.status)}
              </Badge>
            </div>
            <div className="flex gap-2" data-html2canvas-ignore>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Change Status</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {Object.values(InvoiceStatus)
                    .filter((status) => status !== payment?.status)
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
        <div className="flex justify-between">
          <div>
            <p className="text-md mb-1 text-muted-foreground">Billed to:</p>
            <strong className="font-bold text-lg mb-1">{tutor?.name}</strong>
            {/* <div className="text-sm">
              <p><span className="font-medium">Email:</span> --</p>
              <p><span className="font-medium">Phone No.:</span> --</p>
            </div> */}
          </div>
        </div>
        <div className="grid grid-cols-3 border border-border">
          <div className="p-4 border-r border-border">
            <p className="font-normal text-sm text-muted-foreground">
              Date Issued:
            </p>
            <p className="mt-1 font-bold text-md">{payment?.startDateTime}</p>
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
              payment?.currency
            } ${payment?.rate.toFixed(2)}`}</p>
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
              <td className="py-3 px-4">{tuition?.startTime}</td>
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
                {payment?.rate.toFixed(2)}
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
                {`${payment?.currency} ${payment?.rate.toFixed(2)}`}
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
        <div>
          <div className="font-bold mb-1">Payment Information</div>
          <p className="text-sm">
            <span className="font-medium">Account Name:</span> FREN TALK HUB
          </p>
          <p className="text-sm">
            <span className="font-medium">Account No.:</span> 04400099507
          </p>
        </div>
      </div>
    </div>
  );
}