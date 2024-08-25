import type React from "react";
import { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import { Invoice } from "../models/invoice";
import { Badge, BadgeProps } from "@/app/components/ui/badge";
import DropdownButton from "@/app/components/ui/dropdown";
import { Download, Trash2 } from "lucide-react";
import { useStudents } from "../context/collection/studentsContext";
import { useSubjects } from "../context/collection/subjectContext";
import { useTuitions } from "../context/collection/tuitionContext";
import { useTutors } from "../context/collection/tutorContext";
import type { Student } from "../models/student";
import type { Subject } from "../models/subject";
import type { Tuition } from "../models/tuition";
import type { Tutor } from "../models/tutor";
import {
  capitalizeFirstLetter,
  formatDate,
  formatDateRange,
} from "@/utils/util";
import { updateInvoice } from "../firebase/invoice";
import { InvoiceStatus } from "../models/invoiceStatus";
import { useSnackbar } from "../context/component/SnackbarContext";

type InvoiceTemplateProps = {
  invoice: Invoice | null;
  role: "tutor" | "student";
};

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ invoice }) => {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const { students } = useStudents();
  const { tutors } = useTutors();
  const { subjects } = useSubjects();
  const { tuitions } = useTuitions()
  const {showSnackbar} = useSnackbar();

  const tuition: Tuition | undefined = tuitions.find(
    (tuition) => tuition.id === invoice?.tuitionId
  );
  const student: Student | undefined = students.find(
    (student) => student.id === invoice?.studentId
  );
  const tutor: Tutor | undefined = tutors.find(
    (tutor) => tutor.id === invoice?.tutorId
  );
  const subject: Subject | undefined = subjects.find(
    (subject) => subject.id === invoice?.subjectId
  );

  useEffect(() => {
    const img = new Image();
    img.onload = () => setLogoLoaded(true);
    img.src = "/frenztalk-logo.jpg";
  }, []);

  const generatePDF = () => {
    const element = document.getElementById("invoice");
    if (element) {
      const opt = {
        margin: 10,
        filename: "invoice.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
      html2pdf().set(opt).from(element).save();
    }
  };

  function getStatusVariant(status: string | undefined): BadgeProps["variant"] {
    if (!status) {
      // Handle the case where status is undefined or null
      return "error"; // or any appropriate fallback value
    }

    switch (status.toLowerCase()) {
      case "paid":
        return "success";
      case "pending":
        return "info";
      case "cancel":
        return "warning";
      // Add other cases as needed
      default:
        return "error"; // Handle unexpected statuses
    }
  }

  const handleStatusChange = async(status: InvoiceStatus) => {
    if (invoice) {
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
        invoice.price,
        invoice.invoiceType
      );
      await updateInvoice(updatedInvoice);
      showSnackbar("Invoice status updated", "success");
    }
  };

  return (
    <div id="invoice" className="font-sans min-w-3xl max-w-3xl mx-auto p-6">
      <div className="flex flex-col gap-6 justify-between">
        <div>
          <div className="flex flex-1 justify-start mb-4 gap-4">
            <div className="w-8 h-8">
              {logoLoaded && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/frenztalk-logo.jpg"
                  alt="Frenztalk Logo"
                  width={32}
                  height={32}
                  style={{
                    width: "32px",
                    height: "32px",
                    objectFit: "contain",
                  }}
                />
              )}
            </div>
            <h2 className="text-lg font-medium text-red-600 mb-1">
              Invoice Statement
            </h2>
          </div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-4 items-center">
              <h2 className="text-xl font-bold">{invoice?.id}</h2>
              <Badge variant={getStatusVariant(invoice?.status)}>
                {capitalizeFirstLetter(invoice?.status)}
              </Badge>
            </div>
            <div className="flex flex-row gap-2" data-html2canvas-ignore>
              <DropdownButton
                title="Change Status"
                items={Object.values(InvoiceStatus)
                  .filter((status) => status !== invoice?.status)
                  .map((status) => ({
                    label: capitalizeFirstLetter(status),
                    onClick: () => handleStatusChange(status),
                  }))}
              />
              <DropdownButton
                title="..."
                arrowDown={false}
                items={[
                  {
                    icon: <Download size={16} />,
                    label: "Download PDF",
                    onClick: generatePDF,
                  },
                  {
                    icon: <Trash2 size={16} />,
                    label: "Delete",
                    onClick: () => console.log("Delete"),
                  },
                ]}
              />
            </div>
          </div>
        </div>
        <div className="flex w-full flex-row justify-between">
          <div className="flex flex-col">
            <p className="text-md mb-1">Billed to:</p>
            <strong className="font-bold text-lg mb-1">
              {invoice?.invoiceType === "tutor" ? tutor?.name : student?.name}
            </strong>
            <div className="flex flex-row gap-1 text-sm">
              <p className="font-medium">Email:</p>
              <p className="font-light">--</p>
            </div>
            <div className="flex flex-row gap-1 text-sm">
              <p className="font-medium">Phone No.:</p>
              <p className="font-light">--</p>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between border border-gray-900">
          <div className="flex-1 p-4 border-r border-gray-900">
            <p className="font-normal text-sm">Date Issued:</p>
            <p className="mt-1 font-bold text-md">
              {formatDate(invoice?.startDateTime, true)}
            </p>
          </div>
          <div className="flex-1 p-4 border-r border-gray-900">
            <p className="font-normal text-sm">Due Date:</p>
            <p className="mt-1 font-bold text-md">
              {formatDateRange(invoice?.startDateTime, invoice?.duration)}
            </p>
          </div>
          <div className="flex-1 p-4">
            <p className="font-normal text-sm">Due Amount:</p>
            <p className="mt-1 font-bold text-md">
              {`${invoice?.currency} ${invoice?.rate.toFixed(2)}`}
            </p>
          </div>
        </div>
        <table className="w-full border-collapse mt-4">
          <thead>
            <tr className="border-b border-gray-400">
              <th className="text-left text-md py-3 px-4 font-bold text-gray-700">
                Description
              </th>
              <th className="text-left text-md py-3 px-4 font-bold text-gray-700">
                Date
              </th>
              <th className="text-center text-md py-3 px-4 font-bold text-gray-700">
                Quantity
              </th>
              <th className="text-center text-md py-3 px-4 font-bold text-gray-700">
                Unit Price (RM)
              </th>
              <th className="text-right text-md py-3 px-4 font-bold text-gray-700">
                Total (RM)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-300">
              <td className="py-3 px-4">{subject?.name}</td>
              <td className="py-3 px-4">{formatDate(tuition?.startTime)}</td>
              <td className="py-3 px-4 text-center">{tuition?.duration}</td>
              <td className="py-3 px-4 text-center">
                {(invoice?.invoiceType === "tutor"
                  ? tuition?.tutorPrice
                  : tuition?.studentPrice
                )?.toFixed(2)}
              </td>
              <td className="py-3 px-4 text-right">
                {(
                  (invoice?.invoiceType === "tutor"
                    ? tuition?.tutorPrice ?? 0
                    : tuition?.studentPrice ?? 0) * (tuition?.duration ?? 0)
                ).toFixed(2)}
              </td>
            </tr>
          </tbody>
          <tfoot className="pt-8">
            <tr>
              <td colSpan={4} className="py-4  px-4 text-right font-medium">
                Subtotal
              </td>
              <td className="py-4 px-4 text-right">
                {invoice?.rate.toFixed(2)}
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
                {`${invoice?.currency} ${invoice?.rate.toFixed(2)}`}
              </td>
            </tr>
          </tfoot>
        </table>
        <div className="flex flex-col">
          <p className="font-normal text-gray-900 text-xl mb-2">
            Thanks for choosing Frenztalk!
          </p>
          <p className="font-normal text-gray-600 text-sm">
            Kindly forward your payment receipt to the WhatsApp group after
            payment.
          </p>
          <p className="font-normal text-gray-600 text-sm">
            Thank you and have a nice day!
          </p>
        </div>
        <div>
          <div className="font-bold mb-1">Payment Information</div>
          <div className="flex flex-row gap-1 text-md">
            <p className="font-medium">Account Name:</p>
            <p className="font-light">FREN TALK HUB</p>
          </div>
          <div className="flex flex-row gap-1 text-md">
            <p className="font-medium">Account No.:</p>
            <p className="font-light">04400099507</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
