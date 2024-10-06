"use client";

import { usePayments } from "@/lib/context/collection/paymentContext";
import { useSubjects } from "@/lib/context/collection/subjectContext";
import { useTutors } from "@/lib/context/collection/tutorContext";
import html2pdf from "html2pdf.js";
import { Payment } from "@/lib/models/payment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ArrowBackIosNew } from "@mui/icons-material";
import { Separator } from "@/app/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { capitalizeFirstLetter } from "@/lib/utils";
import { useMergePayments } from "@/lib/context/collection/mergePaymentContext";
import { InvoiceStatus } from "@/lib/models/invoiceStatus";
import { MergePayment } from "@/lib/models/mergePayment";
import { Button } from "@/app/components/ui/button";
import { Download } from "lucide-react";
import { updateMergePayment } from "@/lib/firebase/mergePayment";
import { toast } from "@/app/components/hooks/use-toast";
import { updatePayment } from "@/lib/firebase/payment";

export default function PaymentDetail({
  params,
}: {
  params: { mergedPaymentId: string };
}) {
  const { payments } = usePayments();
  const [mergePayment, setMergePayment] = useState<MergePayment | null>(null);
  const [singlePayments, setSinglePayments] = useState<Payment[]>([]);
  const { mergePayments } = useMergePayments();
  const { tutors } = useTutors();
  const { subjects } = useSubjects();
  const [loading, setLoading] = useState(true);
  const [logoLoaded, setLogoLoaded] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const img = new Image();
    img.onload = () => setLogoLoaded(true);
    img.src = "/frenztalk-logo.jpg";
  }, []);

  useEffect(() => {
    const foundMergePayment = mergePayments.find(
      (m) => m.id === params.mergedPaymentId
    );
    if (foundMergePayment) {
      setMergePayment(foundMergePayment);
      const foundSinglePayments = payments.filter((payment) =>
        foundMergePayment.paymentsId.includes(payment.id!)
      );
      setSinglePayments(foundSinglePayments);
    }
    setLoading(false);
  }, [params.mergedPaymentId, mergePayments, payments]);

  const subject = (id: string) => subjects.find((s) => s.id === id);
  const tutor = tutors.find((t) => t.id === mergePayment?.tutorId);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!mergePayment) {
    return <div>Payment not found</div>;
  }

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

  async function handleStatusChange(status: InvoiceStatus): Promise<void> {
    if (!mergePayment || loading) return;

    setLoading(true);
    try {
      const updatedMergePayment = new MergePayment(
        mergePayment.id,
        mergePayment.paymentsId,
        mergePayment.month,
        mergePayment.rate,
        status,
        mergePayment.currency,
        mergePayment.tutorId
      );
      await updateMergePayment(updatedMergePayment);

      for (const payment of singlePayments) {
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
      }
      toast({
        title: "Status Updated Successfully",
        description: `Merge payment status has been updated to ${status}`,
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error Updating Status",
        description: "An error occurred while updating the status.",
      });
    } finally {
      setLoading(false);
    }
  }

  const generatePDF = () => {
    const element = document.getElementById(mergePayment?.id!);
    if (element) {
      const opt = {
        margin: 10,
        filename: `invoice_${mergePayment?.id}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      html2pdf().set(opt).from(element).save();
    }
  };

  return (
    <div className="container mx-auto">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors mb-4"
      >
        <ArrowBackIosNew className="h-5 w-5 mr-2" />
        <h1 className="text-lg font-semibold">Payment Details</h1>
      </button>
      <div
        id={mergePayment?.id!}
        className="rounded-lg shadow-md p-6 space-y-6 bg-background text-foreground"
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
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
            <h1 className="text-2xl font-bold">Merged Payment</h1>
            <div>
              <Badge variant={getStatusVariant(mergePayment.status)}>
                {capitalizeFirstLetter(mergePayment.status)}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2" data-html2canvas-ignore>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Change Status</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {Object.values(InvoiceStatus)
                  .filter((status) => status !== mergePayment.status)
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
        <div className="flex justify-between">
          <div>
            <p className="text-md mb-1 text-muted-foreground">Billed to:</p>
            <strong className="font-bold text-lg mb-1">{tutor?.name}</strong>
            {/* <div className="text-sm">
              <p><span className="font-medium">Email:</span> --</p>
              <p><span className="font-medium">Phone No.:</span> --</p>
            </div> */}
          </div>
          {/* <div className="flex flex-col items-end">
            <p className="text-md mb-1 text-muted-foreground">
              Payment Information
            </p>
            <strong className="font-bold text-md mb-1">FREN TALK HUB</strong>
            <p className="font-normal text-sm mb-1">04400099507</p>
            <p className="font-normal text-sm mb-1">Hong Leong Bank</p>
          </div> */}
        </div>
        <Separator />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-muted-foreground text-sm">Payment ID</p>
            <p className="font-medium">{mergePayment.id}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Payment Month</p>
            <p className="font-medium">{mergePayment.month}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Total Price</p>
            <p className="font-medium text-primary">
              {mergePayment.currency} {mergePayment.rate.toFixed(2)}
            </p>
          </div>
        </div>
        <Separator />
        <div>
          <h2 className="text-xl font-bold mb-4">Single Payment</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tuition Subject</TableHead>
                <TableHead>Tutor</TableHead>
                <TableHead>Rate (hour)</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {singlePayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <Button
                      variant="link"
                      onClick={() =>
                        router.push(
                          `/payments/${mergePayment.id}/${payment.id}`
                        )
                      }
                    >
                      {subject(payment.subjectId)?.name}
                    </Button>
                  </TableCell>
                  <TableCell>{tutor?.name}</TableCell>
                  <TableCell>
                    {payment.currency} {payment.price.toFixed(2)}
                  </TableCell>
                  <TableCell>{payment.duration} min</TableCell>
                  <TableCell>
                    {payment.currency} {payment.rate.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <Badge variant={getStatusVariant(payment?.status)}>
                        {capitalizeFirstLetter(payment.status)}
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
