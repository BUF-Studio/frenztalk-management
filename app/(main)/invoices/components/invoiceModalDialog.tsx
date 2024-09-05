"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useInvoicePage } from "@/lib/context/page/invoicePageContext";
import { updateInvoice } from "@/lib/firebase/invoice";
import { Invoice } from "@/lib/models/invoice";
import { useTuitions } from "@/lib/context/collection/tuitionContext";
import { useStudents } from "@/lib/context/collection/studentsContext";
import { useTutors } from "@/lib/context/collection/tutorContext";
import { useSubjects } from "@/lib/context/collection/subjectContext";
import Currency from "@/lib/models/currency";
import { InvoiceStatus } from "@/lib/models/invoiceStatus";
import TextFieldComponent from "@/app/components/general/input/textField";
import SelectFieldComponent from "@/app/components/general/input/selectFieldComponent";
import DatepickerInput from "@/app/components/general/input/datePicker";

interface InvoiceModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  setInvoice: (invoice: Invoice | null) => void;
}

export const InvoiceModalDialog: React.FC<InvoiceModalDialogProps> = ({
  isOpen,
  onClose,
  invoice,
  setInvoice,
}) => {
  const router = useRouter();
  const { tuitions } = useTuitions();
  const { students } = useStudents();
  const { tutors } = useTutors();
  const { subjects } = useSubjects();

  const [formData, setFormData] = useState({
    status: invoice?.status || InvoiceStatus.PENDING,
    currency: invoice?.currency || Currency.MYR,
    price: invoice?.price || 0,
    startDateTime: invoice?.startDateTime || "",
    duration: invoice?.duration || 60,
    rate: invoice?.rate || 0,
  });

  useEffect(() => {
    if (invoice) {
      setFormData({
        status: invoice.status,
        currency: invoice.currency,
        price: invoice.price,
        startDateTime: invoice.startDateTime || "",
        duration: invoice.duration,
        rate: invoice.rate,
      });
    }
  }, [invoice]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
      if (name === "price" || name === "duration") {
        updatedData.rate = (Number(updatedData.price) * Number(updatedData.duration)) / 60;
      }
      return updatedData;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const startTimestamp = new Date(formData.startDateTime);
      const zoomStartTime = startTimestamp.toISOString().replace("Z", "+08:00");

      const updatedInvoice = new Invoice(
        invoice?.id ?? "",
        invoice?.tuitionId ?? "",
        invoice?.tutorId ?? "",
        invoice?.studentId ?? "",
        invoice?.subjectId ?? "",
        formData.rate,
        formData.status as InvoiceStatus,
        zoomStartTime,
        Number(formData.duration),
        formData.currency as Currency,
        Number(formData.price),
      );

      await updateInvoice(updatedInvoice);
      setInvoice(updatedInvoice);
      onClose();
    } catch (error) {
      console.error("Failed to submit the form", error);
    }
  };

  if (!isOpen || !invoice) return null;

  const tuition = tuitions.find((t) => t.id === invoice.tuitionId);
  const student = students.find((s) => s.id === invoice.studentId);
  const tutor = tutors.find((t) => t.id === invoice.tutorId);
  const subject = subjects.find((s) => s.id === invoice.subjectId);

  const optionsMap = {
    status: Object.values(InvoiceStatus).map((s) => ({
      value: s,
      label: s.charAt(0).toUpperCase() + s.slice(1),
    })),
    currency: Object.values(Currency).map((c) => ({
      value: c,
      label: c.charAt(0).toUpperCase() + c.slice(1),
    })),
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Edit Invoice
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              <span className="font-semibold">ID:</span> {invoice.id}
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              <span className="font-semibold">Student:</span> {student?.name}
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              <span className="font-semibold">Tutor:</span> {tutor?.name}
            </p>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              <span className="font-semibold">Subject:</span> {subject?.name}
            </p>
          </div>

          <SelectFieldComponent
            id="status"
            name="status"
            label="Status"
            required
            options={optionsMap.status}
            value={formData.status}
            onChange={handleInputChange}
          />

          <SelectFieldComponent
            id="currency"
            name="currency"
            label="Currency"
            required
            options={optionsMap.currency}
            value={formData.currency}
            onChange={handleInputChange}
          />

          <TextFieldComponent
            id="price"
            name="price"
            label="Price / hour"
            type="number"
            step="0.01"
            required
            value={formData.price}
            onChange={handleInputChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatepickerInput
              id="startDateTime"
              name="startDateTime"
              label="Start Date & Time"
              required
              value={formData.startDateTime}
              onChange={handleInputChange}
            />
            <TextFieldComponent
              id="duration"
              name="duration"
              type="number"
              label="Duration (Min)"
              required
              value={formData.duration}
              onChange={handleInputChange}
            />
          </div>

          <TextFieldComponent
            id="rate"
            name="rate"
            label="Final Rate"
            type="number"
            step="0.01"
            required
            value={formData.rate}
            readOnly
          />

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-neutral-300 dark:bg-neutral-600 text-neutral-800 dark:text-neutral-100 rounded hover:bg-neutral-400 dark:hover:bg-neutral-500 transition-colors font-sans text-xs font-bold uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="block select-none rounded bg-gradient-to-tr from-red-900 to-red-800 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceModalDialog;