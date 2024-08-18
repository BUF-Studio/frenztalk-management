import type React from "react";
import { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";
import type { Invoice } from "../models/invoice";
import { Badge } from "@/app/components/ui/badge";
import DropdownButton from "@/app/components/ui/dropdown";
import { Download, Trash2 } from "lucide-react";

type InvoiceTemplateProps = {
  invoice: Invoice | null;
};

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ invoice }) => {
  const [logoLoaded, setLogoLoaded] = useState(false);

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

  return (
    <div id="invoice" className="font-sans min-w-3xl max-w-3xl mx-auto p-6">
      <div className="flex flex-col gap-6 justify-between">
        <div>
          <div className="flex flex-1 justify-start mb-4 gap-4">
            <div className="w-8 h-8">
              {logoLoaded && (
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
              <h2 className="text-2xl font-bold">#EN2024123B</h2>
              <Badge variant="success">Status</Badge>
            </div>
            <div className="flex flex-row gap-2" data-html2canvas-ignore>
              <DropdownButton
                title="Change Status"
                items={[
                  {
                    label: "Edit",
                    onClick: () => console.log("Edit"),
                  },
                  {
                    label: "Delete",
                    onClick: () => console.log("Delete"),
                  },
                ]}
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

            {/* <button
              type="button"
              onClick={generatePDF}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              data-html2canvas-ignore
            >
              Download
            </button> */}
          </div>
        </div>
        <div className="flex w-full flex-row justify-between">
          <div className="flex flex-col">
            <p className="text-md mb-1">Billed to:</p>
            <strong className="font-bold text-lg mb-1">ANG ZHI HENG</strong>
            <div className="flex flex-row gap-1 text-sm">
              <p className="font-medium">Email:</p>
              <p className="font-light">zhiheng426@gmail.com</p>
            </div>
            <div className="flex flex-row gap-1 text-sm">
              <p className="font-medium">Phone No.:</p>
              <p className="font-light">+6012-436 5174</p>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-between border border-gray-900">
          <div className="flex-1 p-4 border-r border-gray-900">
            <p className="font-normal text-sm">Date Issued:</p>
            <p className="mt-1 font-bold text-md">15 Aug 2024</p>
          </div>
          <div className="flex-1 p-4 border-r border-gray-900">
            <p className="font-normal text-sm">Due Date:</p>
            <p className="mt-1 font-bold text-md">15 Sep 2024</p>
          </div>
          <div className="flex-1 p-4">
            <p className="font-normal text-sm">Due Amount:</p>
            <p className="mt-1 font-bold text-md">RM 123.00</p>
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
              <td className="py-3 px-4">English</td>
              <td className="py-3 px-4">4 Aug</td>
              <td className="py-3 px-4 text-center">1</td>
              <td className="py-3 px-4 text-center">123.00</td>
              <td className="py-3 px-4 text-right">123.00</td>
            </tr>
          </tbody>
          <tfoot className="pt-8">
            <tr>
              <td colSpan={4} className="py-4  px-4 text-right font-medium">
                Subtotal
              </td>
              <td className="py-4 px-4 text-right">123.00</td>
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
              <td className="py-3 px-4 text-right font-bold text-xl">123.00</td>
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
