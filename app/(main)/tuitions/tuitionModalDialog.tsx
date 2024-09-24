"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Tuition } from "@/lib/models/tuition";
import { X } from "lucide-react";
import TextFieldComponent from "@/app/components/general/input/textField";
import SelectFieldComponent from "@/app/components/general/input/selectFieldComponent";
import DatepickerInput from "@/app/components/general/input/datePicker";
import { Meeting, ZoomAccount } from "@/lib/models/zoom";
import Currency from "@/lib/models/currency";
import TuitionStatus from "@/lib/models/tuitionStatus";
import { InvoiceStatus } from "@/lib/models/invoiceStatus";
import axios from "axios";
import CheckboxFieldComponent from "@/app/components/general/input/checkBox";
import { useLevels } from "@/lib/context/collection/levelContext";
import { useStudents } from "@/lib/context/collection/studentsContext";
import { useTutors } from "@/lib/context/collection/tutorContext";
import { useSubjects } from "@/lib/context/collection/subjectContext";
import { useZoomAccounts } from "@/lib/context/collection/zoomContext";
import { addTuition, updateTuition } from "@/lib/firebase/tuition";
import { updateZoomAccount } from "@/lib/firebase/zoomAccount";
import { Invoice } from "@/lib/models/invoice";
import { addInvoice, deleteInvoice } from "@/lib/firebase/invoice";
import { Payment } from "@/lib/models/payment";
import { addPayment, deletePayment } from "@/lib/firebase/payment";
import { updateMergeInvoice } from "@/lib/firebase/mergeInvoice";
import { MergeInvoice } from "@/lib/models/mergeInvoice";
import { useMergeInvoices } from "@/lib/context/collection/mergeInvoiceContext";
import { updateMergePayment } from "@/lib/firebase/mergePayment";
import { MergePayment } from "@/lib/models/mergePayment";
import { useMergePayments } from "@/lib/context/collection/mergePaymentContext";
import { usePayments } from "@/lib/context/collection/paymentContext";
import { useInvoices } from "@/lib/context/collection/invoiceContext";

interface AddTuitionModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tuition: Tuition | null;
  setTuition: (tuition: Tuition | null) => void;
}

export const AddTuitionModalDialog: React.FC<AddTuitionModalDialogProps> = ({
  isOpen,
  onClose,
  tuition,
  setTuition,
}) => {
  const { levels } = useLevels();
  // const { tuition, setTuition } = useTuitionPage();
  const { students } = useStudents();
  const { tutors } = useTutors();
  const { subjects } = useSubjects();
  const { zoomAccounts } = useZoomAccounts();

  const [formData, setFormData] = useState({
    name: tuition?.name || "",
    studentId: tuition?.studentId || "",
    tutorId: tuition?.tutorId || "",
    subjectId: tuition?.subjectId || "",
    levelId: tuition?.levelId || "",
    status: tuition?.status || "",
    currency: tuition?.currency || Currency.MYR,
    studentPrice: tuition?.studentPrice || 0,
    tutorPrice: tuition?.tutorPrice || 0,
    startDateTime: tuition?.startTime || "",
    duration: tuition?.duration || 60,
    repeatWeeks: 1,
    trial: tuition?.trial ?? true,
  });

  useEffect(() => {
    setFormData({
      name: tuition?.name || "",
      studentId: tuition?.studentId || "",
      tutorId: tuition?.tutorId || "",
      subjectId: tuition?.subjectId || "",
      levelId: tuition?.levelId || "",
      status: tuition?.status || "",
      currency: tuition?.currency || Currency.MYR,
      studentPrice: tuition?.studentPrice || 0,
      tutorPrice: tuition?.tutorPrice || 0,
      startDateTime: tuition?.startTime?.slice(0, 16) || "",
      duration: tuition?.duration || 60,
      repeatWeeks: 1,
      trial: tuition?.trial ?? true,
    });
  }, [tuition]);

  useEffect(() => {
    if (formData.levelId !== "") {
      const selectedLevel = levels.find((l) => formData.levelId === l.id);
      const prices = {
        [Currency.USD]: {
          student: selectedLevel?.student_price_usd,
          tutor: selectedLevel?.tutor_price_usd,
        },
        [Currency.GBP]: {
          student: selectedLevel?.student_price_gbp,
          tutor: selectedLevel?.tutor_price_gbp,
        },
        [Currency.MYR]: {
          student: selectedLevel?.student_price_myr,
          tutor: selectedLevel?.tutor_price_myr,
        },
      };
      setFormData((prevData) => ({
        ...prevData,
        studentPrice: prices[formData.currency].student ?? 0,
        tutorPrice: prices[formData.currency].tutor ?? 0,
      }));
    }
  }, [formData.levelId, formData.currency, levels]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const authToken = async (zoom: ZoomAccount) => {
    try {
      const response = await axios.post("/api/auth/authorize", {
        clientId: zoom.clientid,
        clientSecret: zoom.clientsecret,
        accountId: zoom.accountid,
      });
      return response.data.access_token;
    } catch (error) {
      console.error("Error getting auth token:", error);
      throw error;
    }
  };

  const createZoom = async (
    account: ZoomAccount,
    topic: string,
    start_time: string,
    duration: number
  ) => {
    try {
      const token = await authToken(account);
      const response = await axios.post("/api/addZoom", {
        accessToken: token,
        topic,
        start_time,
        duration,
        password: null,
      });
      return { meetingid: response.data.id, url: response.data.join_url };
    } catch (error) {
      console.error("Error creating Zoom meeting:", error);
      throw error;
    }
  };

  const updateZoom = async (
    zoom: ZoomAccount,
    meetingId: string,
    topic: string,
    start_time: string,
    duration: number
  ) => {
    try {
      const token = await authToken(zoom);
      const response = await axios.post("/api/updateZoom", {
        accessToken: token,
        meetingId,
        topic,
        start_time,
        duration,
        password: null,
        recurrence: null,
      });
      if (response.status === 204) {
        return { success: true };
      }
      throw new Error(`Unexpected response status: ${response.status}`);
    } catch (error) {
      console.error("Error updating Zoom meeting:", error);
      throw error;
    }
  };

  const getZoomAcc = (
    zoomStartTime: string,
    duration: number
  ): ZoomAccount | null => {
    const newStartTime = new Date(zoomStartTime).getTime();
    const newEndTime = newStartTime + duration * 60 * 1000;

    return (
      zoomAccounts.find((zoom) => {
        if (zoom.meetings.length === 0) return true;
        return !zoom.meetings.some((meeting) => {
          const meetingStartTime = new Date(meeting.start).getTime();
          const meetingEndTime =
            meetingStartTime + meeting.duration * 60 * 1000;
          return (
            (newStartTime >= meetingStartTime &&
              newStartTime < meetingEndTime) ||
            (newEndTime > meetingStartTime && newEndTime <= meetingEndTime) ||
            (newStartTime <= meetingStartTime && newEndTime >= meetingEndTime)
          );
        });
      }) || null
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const startTime = new Date(formData.startDateTime);
      const duration = Number(formData.duration);
      const repeatWeeks = Number(formData.repeatWeeks);

      if (!tuition) {
        for (let i = 0; i < repeatWeeks; i++) {
          const newStartTime = new Date(
            startTime.getTime() +
            i * 7 * 24 * 60 * 60 * 1000 +
            8 * 60 * 60 * 1000
          );
          const zoomStartTime = newStartTime.toISOString();

          const zoomAcc = getZoomAcc(zoomStartTime, duration);
          if (!zoomAcc) throw new Error("No Zoom Account Available");

          const zoom = await createZoom(
            zoomAcc,
            formData.name,
            zoomStartTime,
            duration
          );
          if (!zoom) throw new Error("Failed to create zoom meeting");

          const { meetingid, url } = zoom;
          const newTuition = new Tuition(
            null,
            formData.name,
            formData.tutorId,
            formData.studentId,
            formData.subjectId,
            formData.levelId,
            formData.status as TuitionStatus,
            zoomStartTime,
            duration,
            url,
            formData.studentPrice,
            formData.tutorPrice,
            formData.currency as Currency,
            null,
            null,
            meetingid,
            i === 0 && formData.trial
          );
          await addTuition(newTuition);

          const updatedMeetings = [
            ...zoomAcc.meetings,
            new Meeting(zoomStartTime, duration),
          ];
          await updateZoomAccount(
            new ZoomAccount(
              zoomAcc.id,
              zoomAcc.email,
              zoomAcc.clientid,
              zoomAcc.clientsecret,
              zoomAcc.accountid,
              updatedMeetings
            )
          );
        }
      } else {
        const newStartTime = new Date(startTime.getTime() + 8 * 60 * 60 * 1000);
        const zoomStartTime = newStartTime.toISOString();

        if (
          tuition.startTime !== zoomStartTime ||
          tuition.name !== formData.name ||
          tuition.duration !== duration
        ) {
          const zoomAcc = getZoomAcc(zoomStartTime, duration);
          if (!zoomAcc) throw new Error("No Zoom Account Available");

          await updateZoom(
            zoomAcc,
            tuition.meetingId ?? "",
            formData.name,
            zoomStartTime,
            duration
          );

          const updatedMeetings = [
            ...zoomAcc.meetings,
            new Meeting(zoomStartTime, duration),
          ];
          await updateZoomAccount(
            new ZoomAccount(
              zoomAcc.id,
              zoomAcc.email,
              zoomAcc.clientid,
              zoomAcc.clientsecret,
              zoomAcc.accountid,
              updatedMeetings
            )
          );
        }

        let tiid = tuition.tutorInvoiceId;
        let siid = tuition.studentInvoiceId;
        if (
          tuition.status !== TuitionStatus.END &&
          formData.status === TuitionStatus.END &&
          (!tiid || !siid)
        ) {
          const month = zoomStartTime.slice(0, 7);
          if (!siid) {
            const studentRate = (formData.studentPrice * duration) / 60;
            const studentInvoice = new Invoice(
              null,
              tuition.id ?? "",
              formData.tutorId,
              formData.studentId,
              formData.subjectId,
              studentRate,
              InvoiceStatus.PENDING,
              zoomStartTime,
              duration,
              formData.currency as Currency,
              formData.studentPrice
            );
            siid = await addInvoice(studentInvoice);

            const { mergeInvoices } = useMergeInvoices()

            const mergeInvoiceId = month + formData.studentId
            const existMergeInvoice = mergeInvoices.find(minv => minv.id === mergeInvoiceId);

            if (existMergeInvoice) {
              const mergeInvoice = new MergeInvoice(
                mergeInvoiceId,
                [...existMergeInvoice.invoicesId, siid!],
                month,
                existMergeInvoice.rate + studentRate,
                InvoiceStatus.PENDING,
                existMergeInvoice.currency,
                formData.studentId
              )

              await updateMergeInvoice(mergeInvoice)
            } else {
              const mergeInvoice = new MergeInvoice(
                mergeInvoiceId,
                [siid!],
                month,
                studentRate,
                InvoiceStatus.PENDING,
                formData.currency,
                formData.studentId
              )

              await updateMergeInvoice(mergeInvoice)
            }

          }
          if (!tiid) {
            const tutorRate = (formData.tutorPrice * duration) / 60;
            const tutorPayment = new Payment(
              null,
              tuition.id ?? "",
              formData.tutorId,
              formData.studentId,
              formData.subjectId,
              tutorRate,
              InvoiceStatus.PENDING,
              zoomStartTime,
              duration,
              formData.currency as Currency,
              formData.tutorPrice
            );
            tiid = await addPayment(tutorPayment);

            const { mergePayments } = useMergePayments()

            const mergePaymentId = month + formData.tutorId
            const existMergePayment = mergePayments.find(minv => minv.id === mergePaymentId);

            if (existMergePayment) {
              const mergePayment = new MergePayment(
                mergePaymentId,
                [...existMergePayment.paymentsId, tiid!],
                month,
                existMergePayment.rate + tutorRate,
                InvoiceStatus.PENDING,
                existMergePayment.currency,
                formData.tutorId
              )

              await updateMergePayment(mergePayment)
            } else {
              const mergePayment = new MergePayment(
                mergePaymentId,
                [tiid!],
                month,
                tutorRate,
                InvoiceStatus.PENDING,
                formData.currency,
                formData.tutorId
              )

              await updateMergePayment(mergePayment)
            }
          }
        }


        if (tuition.status === TuitionStatus.END && formData.status !== TuitionStatus.END && tiid && siid) {

          const month = tuition.startTime.slice(0, 7)
          const mergeInvoiceId = month + formData.studentId
          const mergePaymentId = month + formData.tutorId

          const { mergeInvoices } = useMergeInvoices()
          const { mergePayments } = useMergePayments()

          const mergeInvoice = mergeInvoices.find(minv => minv.id === mergeInvoiceId);
          const mergePayment = mergePayments.find(minv => minv.id === mergePaymentId);

          let updatedMergeInvoice = mergeInvoice
          let updatedMergePayment = mergePayment

          updatedMergeInvoice?.invoicesId.filter(invoiceId => invoiceId !== siid);
          updatedMergePayment?.paymentsId.filter(paymentId => paymentId !== tiid);
          if (updatedMergeInvoice) {
            const { invoices } = useInvoices()
            const inv = invoices.find(inv => inv.id === siid)
            updatedMergeInvoice.rate = updatedMergeInvoice.rate - (inv?.rate ?? 0)
            await updateMergeInvoice(updatedMergeInvoice)

          }
          if (updatedMergePayment) {
            const { payments } = usePayments()
            const pay = payments.find(inv => inv.id === tiid)
            updatedMergePayment.rate = updatedMergePayment.rate - (pay?.rate ?? 0)
            await updateMergePayment(updatedMergePayment)

          }

          await deleteInvoice(siid)
          await deletePayment(tiid)

          siid = null
          tiid = null

        }

        const updatedTuition = new Tuition(
          tuition.id,
          formData.name,
          formData.tutorId,
          formData.studentId,
          formData.subjectId,
          formData.levelId,
          formData.status as TuitionStatus,
          zoomStartTime,
          duration,
          tuition.url,
          formData.studentPrice,
          formData.tutorPrice,
          formData.currency as Currency,
          siid,
          tiid,
          tuition.meetingId,
          formData.trial
        );
        await updateTuition(updatedTuition);
        setTuition(updatedTuition);
      }
    } catch (error) {
      console.error("Failed to submit the form", error);
    }
    onClose();
  };

  if (!isOpen) return null;

  const optionsMap = {
    student: students.filter((student) => student.status !== "frozen").map((s) => ({ value: s.id, label: s.name })),
    tutor: tutors.map((t) => ({ value: t.id, label: t.name })),
    subject: subjects.map((s) => ({ value: s.id, label: s.name })),
    level: levels.map((l) => ({ value: l.id, label: l.name })),
    status: Object.values(TuitionStatus).map((s) => ({
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
            {tuition ? "Edit Class" : "Add Class"}
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
          <TextFieldComponent
            id="name"
            name="name"
            label="Class Name"
            required
            value={formData.name}
            onChange={handleInputChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectFieldComponent
              id="student"
              name="studentId"
              label="Student"
              required
              options={[
                { value: "", label: "Choose Student" },
                ...optionsMap.student,
              ]}
              value={formData.studentId}
              onChange={handleInputChange}
            />
            <SelectFieldComponent
              id="tutor"
              name="tutorId"
              label="Tutor"
              required
              options={[
                { value: "", label: "Choose Tutor" },
                ...optionsMap.tutor,
              ]}
              value={formData.tutorId}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectFieldComponent
              id="subject"
              name="subjectId"
              label="Subject"
              required
              options={[
                { value: "", label: "Choose Subject" },
                ...optionsMap.subject,
              ]}
              value={formData.subjectId}
              onChange={handleInputChange}
            />
            <SelectFieldComponent
              id="level"
              name="levelId"
              label="Level"
              required
              options={[
                { value: "", label: "Choose Level" },
                ...optionsMap.level,
              ]}
              value={formData.levelId}
              onChange={handleInputChange}
            />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextFieldComponent
              id="studentPrice"
              name="studentPrice"
              label="Student Rate"
              type="number"
              step="0.01"
              required
              value={formData.studentPrice}
              onChange={handleInputChange}
            />
            <TextFieldComponent
              id="tutorPrice"
              name="tutorPrice"
              label="Tutor Rate"
              type="number"
              step="0.01"
              required
              value={formData.tutorPrice}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatepickerInput
              id="startDateTime"
              name="startDateTime"
              label="Date & Time"
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
            id="repeatWeeks"
            name="repeatWeeks"
            type="number"
            label="Repeat Weeks"
            required
            value={formData.repeatWeeks}
            onChange={handleInputChange}
            min={1}
          />
          <CheckboxFieldComponent
            id="trial"
            name="trial"
            label="Trial Class"
            checked={formData.trial}
            onChange={handleCheckboxChange}
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

export default AddTuitionModalDialog;
