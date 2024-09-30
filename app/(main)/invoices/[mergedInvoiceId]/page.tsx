"use client";

import { useEffect, useState } from "react";
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
import { Download, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import generatePDF from "@/lib/pdf/pdf";

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

  const router = useRouter();

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
        return "secondary";
      case InvoiceStatus.PENDING:
        return "default";
      case InvoiceStatus.CANCEL:
        return "outline";
      default:
        return "destructive";
    }
  }

  function handleStatusChange(status: InvoiceStatus): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="container mx-auto">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors mb-4"
      >
        <ArrowBackIosNew className="h-5 w-5 mr-2" />
        <h1 className="text-lg font-semibold">Invoice Details</h1>
      </button>
      <div className="rounded-lg shadow-md p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <h1 className="text-2xl font-bold">Merged Invoice</h1>
            <div>
              <Badge variant={getStatusVariant(mergeInvoice?.status)}>
                {capitalizeFirstLetter(mergeInvoice.status)}
              </Badge>
            </div>
          </div>
          {/* <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              Download
            </Button>
          </div> */}
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
            <Button
              variant="outline"
              onClick={() => console.log("Edit")}
            >
              Download
              <Download className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-muted-foreground text-sm">Invoice ID</p>
            <p className="font-medium">{mergeInvoice.id}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Student</p>
            <p className="font-medium">{student?.name}</p>
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
                    {invoice.currency} {invoice.rate.toFixed(2)}
                  </TableCell>
                  <TableCell>{invoice.duration} min</TableCell>
                  <TableCell>
                    {invoice.currency} {invoice.price.toFixed(2)}
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
