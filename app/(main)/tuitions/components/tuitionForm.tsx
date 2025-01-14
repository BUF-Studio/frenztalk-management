import type React from "react";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { toast } from "@/app/components/hooks/use-toast";
import { useRouter } from "next/navigation";
import { addTuition, updateTuition } from "@/lib/firebase/tuition";
import { Tuition } from "@/lib/models/tuition";
import Currency from "@/lib/models/currency";
import TuitionStatus from "@/lib/models/tuitionStatus";
import { useInvoices } from "@/lib/context/collection/invoiceContext";
import { usePayments } from "@/lib/context/collection/paymentContext";
import { useStudents } from "@/lib/context/collection/studentsContext";
import { useSubjects } from "@/lib/context/collection/subjectContext";
import { useTutors } from "@/lib/context/collection/tutorContext";
import { useZoomAccounts } from "@/lib/context/collection/zoomContext";
import { useLevels } from "@/lib/context/collection/levelContext";
import { Checkbox } from "@/app/components/ui/checkbox";
import { formatDateTimeLocalToUTC } from "@/utils/util";
import { Label } from "@/app/components/ui/label";
import { Meeting, ZoomAccount } from "@/lib/models/zoom";
import axios from "axios";
import { updateZoomAccount } from "@/lib/firebase/zoomAccount";
import { Invoice } from "@/lib/models/invoice";
import { InvoiceStatus } from "@/lib/models/invoiceStatus";
import { addInvoice, deleteInvoice } from "@/lib/firebase/invoice";
import { useMergePayments } from "@/lib/context/collection/mergePaymentContext";
import { useMergeInvoices } from "@/lib/context/collection/mergeInvoiceContext";
import { MergeInvoice } from "@/lib/models/mergeInvoice";
import {
  deleteMergeInvoice,
  updateMergeInvoice,
} from "@/lib/firebase/mergeInvoice";
import { Payment } from "@/lib/models/payment";
import { addPayment, deletePayment } from "@/lib/firebase/payment";
import { MergePayment } from "@/lib/models/mergePayment";
import {
  deleteMergePayment,
  updateMergePayment,
} from "@/lib/firebase/mergePayment";
import { useTuitionPage } from "@/lib/context/page/tuitionPageContext";
import { useUser } from "@/lib/context/collection/userContext";
import SelectField from "./SelectField";
import InputField from "./InputField";
import { useTuitionForm } from "../add/custom_hook/useTuitionForm";
import { useZoomAPI } from "../add/custom_hook/useZoomApi";

interface TuitionFormProps {
  initialTuition?: Tuition | null;
}

const TuitionForm: React.FC<TuitionFormProps> = ({ initialTuition }) => {
  const { user } = useUser();
  const { nonFreezedStudents } = useStudents();
  const { tutors } = useTutors();
  const { subjects } = useSubjects();
  const { zoomAccounts } = useZoomAccounts();
  const { invoices } = useInvoices();
  const { payments } = usePayments();
  const { levels } = useLevels();
  const { setTuition } = useTuitionPage();

  const { mergeInvoices } = useMergeInvoices();
  const { mergePayments } = useMergePayments();

  const router = useRouter();

  const { formData, setFormData, isSubmitting, setIsSubmitting, validateTuitionForm } =
    useTuitionForm(initialTuition, levels);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const { createZoom, updateZoom, getZoomAcc, deleteZoom } = useZoomAPI();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

  

    const errors = validateTuitionForm(formData);
    if (Object.keys(errors).length > 0) {
      setIsSubmitting(false);
      console.log(errors)
      return toast({
        title: "Failed",
        description: "Please fill in all required fields.",
      });
    }

    const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    try {
      const startTime = new Date(formData.startDateTime);
      const duration = Number(formData.duration);
      const repeatWeeks = Number(formData.repeatWeeks);

      if (!initialTuition) {
        let zoomAcc: ZoomAccount | null = null;
        let updatedMeetings: Meeting[] = [];

        for (let i = 0; i < repeatWeeks; i++) {
          const newStartTime = new Date(
            startTime.getTime() +
            i * 7 * 24 * 60 * 60 * 1000 +
            8 * 60 * 60 * 1000
          );
          const zoomStartTime = newStartTime.toISOString();

          if (i === 0) {
            zoomAcc = getZoomAcc(
              zoomStartTime,
              duration,
              repeatWeeks,
              zoomAccounts
            );
            if (zoomAcc && zoomAcc.meetings.length !== 0) {
              updatedMeetings.push(...zoomAcc.meetings);
            }
          }

          if (!zoomAcc) throw new Error("No Time Slot available in any of the Zoom Account");

          const zoom = await createZoom(
            zoomAcc,
            formData.name,
            zoomStartTime,
            duration,
            localTimeZone
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
            localTimeZone,
            duration,
            url,
            formData.studentPrice,
            formData.tutorPrice,
            formData.currency as Currency,
            null,
            null,
            meetingid,
            i === 0 && formData.trial,
            zoomAcc.id!
          );
          await addTuition(newTuition);

          updatedMeetings.push(new Meeting(zoomStartTime, duration, meetingid));
        }
        if (zoomAcc)
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
        toast({
          title: "Success",
          description: `${repeatWeeks} tuition sessions created successfully.`,
        });
        router.back();
      } else {
        const newStartTime = new Date(startTime.getTime());
        const zoomStartTime = newStartTime.toISOString();
        const startTimeUTC = formatDateTimeLocalToUTC(startTime.toISOString());
        let zoomAccount: string | null = initialTuition.zoomAcc;
        let deleteZoomAcc = false;
        let newZoomMeetingId = null;
        let newZoomMeetingUrl = null;

        if (
          initialTuition.startTime !== zoomStartTime ||
          initialTuition.name !== formData.name ||
          initialTuition.duration !== duration
        ) {
          if (newStartTime.getTime() > Date.now()) {
            console.log("update zoom");
            const zoomAcc = getZoomAcc(
              zoomStartTime,
              duration,
              1,
              zoomAccounts
            );
            if (!zoomAcc) throw new Error("No Zoom Account Available");

            zoomAccount = zoomAcc.id;

            if (initialTuition.meetingId === "") {
              const { meetingid, url } = await createZoom(
                zoomAcc,
                formData.name,
                zoomStartTime,
                duration,
                localTimeZone
              );

              newZoomMeetingId = meetingid;
              newZoomMeetingUrl = url;
            } else {
              await updateZoom(
                zoomAcc,
                initialTuition.meetingId ?? "",
                formData.name,
                zoomStartTime,
                localTimeZone,
                duration
              );
            }

            const updatedMeetings = [
              ...zoomAcc.meetings.filter(
                (meeting) => meeting.meetingId !== initialTuition.meetingId
              ),
              new Meeting(
                zoomStartTime,
                duration,
                newZoomMeetingId ?? initialTuition.meetingId ?? ""
              ),
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

          if (
            newStartTime.getTime() < Date.now() &&
            new Date(initialTuition.startTime).getTime() > Date.now()
          ) {
            if (initialTuition.meetingId) {
              const zoomAcc = zoomAccounts.find(
                (account) => account.id === initialTuition.zoomAcc
              );

              if (zoomAcc) {
                await deleteZoom(zoomAcc, initialTuition.meetingId);

                deleteZoomAcc = true;
                const updatedMeetings: Meeting[] = [
                  ...zoomAcc.meetings.filter(
                    (meeting) => meeting.meetingId !== initialTuition.meetingId
                  ),
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
              console.log("No meeting ID found to delete.");
            }
          }
        }

        let tiid = initialTuition.tutorInvoiceId;
        let siid = initialTuition.studentInvoiceId;
        if (
          initialTuition.status !== TuitionStatus.END &&
          formData.status === TuitionStatus.END &&
          (!tiid || !siid)
        ) {
          const month = zoomStartTime.slice(0, 7);
          if (!siid) {
            const studentRate = (formData.studentPrice * duration) / 60;
            const studentInvoice = new Invoice(
              null,
              initialTuition.id ?? "",
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

            const mergeInvoiceId = month + formData.studentId;
            const existMergeInvoice = mergeInvoices.find(
              (minv) => minv.id === mergeInvoiceId
            );

            if (existMergeInvoice) {
              const mergeInvoice = new MergeInvoice(
                mergeInvoiceId,
                [...existMergeInvoice.invoicesId, siid as string],
                month,
                existMergeInvoice.rate + studentRate,
                InvoiceStatus.PENDING,
                existMergeInvoice.currency,
                formData.studentId
              );

              await updateMergeInvoice(mergeInvoice);
            } else {
              const mergeInvoice = new MergeInvoice(
                mergeInvoiceId,
                [siid as string],
                month,
                studentRate,
                InvoiceStatus.PENDING,
                formData.currency as Currency,
                formData.studentId
              );

              await updateMergeInvoice(mergeInvoice);
            }
          }
          if (!tiid) {
            const tutorRate = (formData.tutorPrice * duration) / 60;
            const tutorPayment = new Payment(
              null,
              initialTuition.id ?? "",
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

            const mergePaymentId = month + formData.tutorId;
            const existMergePayment = mergePayments.find(
              (minv) => minv.id === mergePaymentId
            );

            if (existMergePayment) {
              const mergePayment = new MergePayment(
                mergePaymentId,
                [...existMergePayment.paymentsId, tiid as string],
                month,
                existMergePayment.rate + tutorRate,
                InvoiceStatus.PENDING,
                existMergePayment.currency,
                formData.tutorId
              );

              await updateMergePayment(mergePayment);
            } else {
              const mergePayment = new MergePayment(
                mergePaymentId,
                [tiid as string],
                month,
                tutorRate,
                InvoiceStatus.PENDING,
                formData.currency as Currency,
                formData.tutorId
              );

              await updateMergePayment(mergePayment);
            }
          }
        }

        if (
          initialTuition.status === TuitionStatus.END &&
          formData.status !== TuitionStatus.END &&
          tiid &&
          siid
        ) {
          const month = initialTuition.startTime.slice(0, 7);
          const mergeInvoiceId = month + formData.studentId;
          const mergePaymentId = month + formData.tutorId;

          const mergeInvoice = mergeInvoices.find(
            (minv) => minv.id === mergeInvoiceId
          );
          const mergePayment = mergePayments.find(
            (minv) => minv.id === mergePaymentId
          );

          const updatedMergeInvoice = mergeInvoice;
          const updatedMergePayment = mergePayment;

          if (updatedMergeInvoice) {
            updatedMergeInvoice.invoicesId =
              updatedMergeInvoice.invoicesId.filter(
                (invoiceId) => invoiceId !== siid
              );

            if (updatedMergeInvoice.invoicesId.length === 0) {
              await deleteMergeInvoice(mergeInvoiceId);
            } else {
              const inv = invoices.find((inv) => inv.id === siid);
              updatedMergeInvoice.rate =
                updatedMergeInvoice.rate - (inv?.rate ?? 0);
              await updateMergeInvoice(updatedMergeInvoice);
            }
          }

          if (updatedMergePayment) {
            updatedMergePayment.paymentsId =
              updatedMergePayment?.paymentsId.filter(
                (paymentId) => paymentId !== tiid
              );

            if (updatedMergePayment.paymentsId.length === 0) {
              await deleteMergePayment(mergePaymentId);
            } else {
              const pay = payments.find((inv) => inv.id === tiid);
              updatedMergePayment.rate =
                updatedMergePayment.rate - (pay?.rate ?? 0);
              await updateMergePayment(updatedMergePayment);
            }
          }

          await deleteInvoice(siid);
          await deletePayment(tiid);

          siid = null;
          tiid = null;
        }

        const updatedTuition = new Tuition(
          initialTuition.id,
          formData.name,
          formData.tutorId,
          formData.studentId,
          formData.subjectId,
          formData.levelId,
          formData.status as TuitionStatus,
          startTimeUTC,
          localTimeZone,
          duration,
          newZoomMeetingUrl ? newZoomMeetingUrl : initialTuition.url,
          formData.studentPrice,
          formData.tutorPrice,
          formData.currency as Currency,
          siid,
          tiid,
          deleteZoomAcc
            ? ""
            : newZoomMeetingId
              ? newZoomMeetingId
              : initialTuition.meetingId,
          formData.trial,
          zoomAccount
        );
        await updateTuition(updatedTuition);
        setTuition(updatedTuition);
        toast({
          title: "Success",
          description: "Tuition updated successfully.",
        });
        router.back();
      }
    } catch (error) {
      toast({
        title: "Failed",
        description: `Error : ${error}.`,
      });
      console.error("Failed to submit the form", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const optionsMap = {
    status: Object.values(TuitionStatus).map((status) => ({
      value: status,
      label: status.charAt(0).toUpperCase() + status.slice(1),
    })),
    currency: Object.values(Currency).map((currency) => ({
      value: currency,
      label: currency,
    })),
    student: nonFreezedStudents.map((student) => ({
      value: student.id,
      label: student.name,
    })),
    tutor: tutors.map((tutor) => ({ value: tutor.id, label: tutor.name })),
    subject: subjects.map((subject) => ({
      value: subject.id,
      label: subject.name,
    })),
    level: levels.map((level) => ({ value: level.id, label: level.name })),
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="name">Title</Label>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Tuition Name"
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          label="Student"
          name="student"
          value={formData.studentId}
          onChange={(value: string) =>
            setFormData((prev) => ({ ...prev, studentId: value }))
          }
          options={optionsMap.student}
          placeholder="Select Student"
        />
        {user?.role !== "tutor" && (
          <SelectField
            label="Tutor"
            name="tutor"
            value={formData.tutorId}
            onChange={(value: string) =>
              setFormData((prev) => ({ ...prev, tutorId: value }))
            }
            options={optionsMap.tutor}
            placeholder="Select Tutor"
          />
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          label="Subject"
          name="subject"
          value={formData.subjectId}
          onChange={(value: string) =>
            setFormData((prev) => ({ ...prev, subjectId: value }))
          }
          options={optionsMap.subject}
          placeholder="Select Subject"
        />
        <SelectField
          label="Level"
          name="level"
          value={formData.levelId}
          onChange={(value: string) =>
            setFormData((prev) => ({ ...prev, levelId: value }))
          }
          options={optionsMap.level}
          placeholder="Select Level"
        />
      </div>
      <SelectField
        label="Status"
        name="status"
        value={formData.status}
        onChange={(value: string) =>
          setFormData((prev) => ({ ...prev, status: value }))
        }
        options={optionsMap.status}
        placeholder="Select Status"
      />
      {user?.role !== "tutor" && <SelectField
        label="Currency"
        name="currency"
        value={formData.currency}
        onChange={(value: string) =>
          setFormData((prev) => ({ ...prev, currency: value as Currency }))
        }
        options={optionsMap.currency}
        placeholder="Select Currency"
      />}

      {user?.role !== "tutor" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Student Rate"
            name="studentPrice"
            type="number"
            value={formData.studentPrice}
            onChange={handleChange}
            placeholder="Student Price"
            required
          />
          <InputField
            label="Tutor Rate"
            name="tutorPrice"
            type="number"
            value={formData.tutorPrice}
            onChange={handleChange}
            placeholder="Tutor Price"
            required
          />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="datetime">Date & Time</Label>
          <Input
            type="datetime-local"
            name="startDateTime"
            value={formatDateTimeLocalToUTC(formData.startDateTime)}
            onChange={handleChange}
            placeholder="Start Time"
            required
          />
        </div>
        {/* FIXME : Duration's granularity should be 30 minutes instead of 1 minute? */}
        <InputField
          label="Duration (min)"
          name="duration"
          type="number"
          value={formData.duration}
          onChange={handleChange}
          placeholder="Duration (minutes)"
          required
        />
      </div>
      {initialTuition == null && (
        <InputField
          label="Repeat Weeks"
          name="repeatWeeks"
          type="number"
          value={formData.repeatWeeks}
          onChange={handleChange}
          placeholder="Repeat Weeks"
          required
          min={1}
        />
      )}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="trial"
          checked={formData.trial}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, trial: checked as boolean }))
          }
          onClick={(e) => e.stopPropagation}
        />
        <label
          htmlFor="trial"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Trial Class
        </label>
      </div>
      <div className="flex justify-end space-x-2 mt-6">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : initialTuition ? (
            "Update Tuition"
          ) : (
            "Add Tuition"
          )}
        </Button>
      </div>
    </form>
  );
};

export default TuitionForm;
