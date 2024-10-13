"use client";

import { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import { useRouter } from "next/navigation";
import { ArrowBackIosNew } from "@mui/icons-material";
import { Button } from "@/app/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { useMergeInvoices } from "@/lib/context/collection/mergeInvoiceContext";
import { MergeInvoice } from "@/lib/models/mergeInvoice";
import { useStudents } from "@/lib/context/collection/studentsContext";
import { Badge } from "@/app/components/ui/badge";
import { capitalizeFirstLetter } from "@/lib/utils";
import { InvoiceStatus } from "@/lib/models/invoiceStatus";
import { useInvoices } from "@/lib/context/collection/invoiceContext";
import { Invoice } from "@/lib/models/invoice";
import { useSubjects } from "@/lib/context/collection/subjectContext";
import { useTutors } from "@/lib/context/collection/tutorContext";
import { Separator } from "@/app/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import { updateMergeInvoice } from "@/lib/firebase/mergeInvoice";
import { updateInvoice } from "@/lib/firebase/invoice";
import { toast } from "@/app/components/hooks/use-toast";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/lib/firebase/service/clientApp";

export default function InvoiceDetail({
  params,
}: {
  params: { mergedInvoiceId: string };
}) {
  const { mergeInvoices } = useMergeInvoices();
  const { invoices } = useInvoices();
  const [mergeInvoice, setMergeInvoice] = useState<MergeInvoice | null>(null);
  const [singleInvoices, setSingleInvoices] = useState<Invoice[]>([]);
  const { students } = useStudents();
  const { subjects } = useSubjects();
  const { tutors } = useTutors();
  const [loading, setLoading] = useState(true);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const router = useRouter();

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

  useEffect(() => {
    const foundMergeInvoice = mergeInvoices.find(
      (m) => m.id === params.mergedInvoiceId
    );
    if (foundMergeInvoice) {
      setMergeInvoice(foundMergeInvoice);
      const foundSingleInvoices = invoices.filter((invoice) =>
        foundMergeInvoice.invoicesId.includes(invoice.id!)
      );
      setSingleInvoices(foundSingleInvoices);
    }
    console.log(`Params: ${params.mergedInvoiceId}`);
    setLoading(false);
  }, [params.mergedInvoiceId, mergeInvoices, invoices]);

  const student = students.find((s) => s.id === mergeInvoice?.studentId);
  const subject = (id: string) => subjects.find((s) => s.id === id);
  const tutor = (id: string) => tutors.find((t) => t.id === id);

  const generatePDF = () => {
    const element = document.getElementById(mergeInvoice?.id!);
    if (element) {
      const opt = {
        margin: 10,
        filename: `invoice_${mergeInvoice?.id}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      html2pdf().set(opt).from(element).save();
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!mergeInvoice) {
    return <div>Merge Invoice not found</div>;
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
    if (!mergeInvoice) return;

    try {
      const updatedMergeInvoice = new MergeInvoice(
        mergeInvoice.id,
        mergeInvoice.invoicesId,
        mergeInvoice.month,
        mergeInvoice.rate,
        status,
        mergeInvoice.currency,
        mergeInvoice.studentId
      );
      await updateMergeInvoice(updatedMergeInvoice);

      for (const invoice of singleInvoices) {
        const updatedInvoice = new Invoice(
          invoice.id,
          invoice.tuitionId,
          invoice.tutorId,
          invoice.studentId,
          invoice.subjectId,
          invoice.rate,
          status,
          invoice.startDateTime,
          invoice.duration,
          invoice.currency,
          invoice.price
        );
        await updateInvoice(updatedInvoice);
      }
      toast({
        title: "Status Updated Successfully",
        description: `Merge Invoice status has been updated to ${status}`,
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error Updating Status",
        description: "An error occurred while updating the status.",
      });
    }
  }

  return (
    <div className="container mx-auto ">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors mb-4"
      >
        <ArrowBackIosNew className="h-5 w-5 mr-2" />
        <h1 className="text-lg font-semibold">Invoice Details</h1>
      </button>
      <div
        id={mergeInvoice?.id!}
        className="rounded-lg shadow-md p-6 space-y-6 bg-background text-foreground"
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
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
            <h1 className="text-2xl font-bold">Merged Invoice</h1>
            <div>
              <Badge variant={getStatusVariant(mergeInvoice?.status)}>
                {capitalizeFirstLetter(mergeInvoice.status)}
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
                  .filter((status) => status !== mergeInvoice?.status)
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
            <strong className="font-bold text-lg mb-1">{student?.name}</strong>
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
        <Separator />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-muted-foreground text-sm">Invoice ID</p>
            <p className="font-medium">{mergeInvoice.id}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Invoice Month</p>
            <p className="font-medium">{mergeInvoice.month}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Total Price</p>
            <p className="font-medium text-primary">
              {mergeInvoice.currency} {mergeInvoice.rate.toFixed(2)}
            </p>
          </div>
        </div>
        <Separator />
        <div>
          <h2 className="text-xl font-bold mb-4">Single Invoices</h2>
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
              {singleInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <Button
                      variant="link"
                      onClick={() =>
                        router.push(
                          `/invoices/${mergeInvoice.id}/${invoice.id}`
                        )
                      }
                    >
                      {subject(invoice.subjectId)?.name}
                    </Button>
                  </TableCell>
                  <TableCell>{tutor(invoice.tutorId)?.name}</TableCell>
                  <TableCell>
                    {invoice.currency} {invoice.price.toFixed(2)}
                  </TableCell>
                  <TableCell>{invoice.duration} min</TableCell>
                  <TableCell>
                    {invoice.currency} {invoice.rate.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <Badge variant={getStatusVariant(invoice?.status)}>
                        {capitalizeFirstLetter(invoice.status)}
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
