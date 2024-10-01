import type React from "react";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
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
import { formatDateTimeLocal } from "@/utils/util";
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

interface TuitionFormProps {
  initialTuition?: Tuition | null;
}

const TuitionForm: React.FC<TuitionFormProps> = ({ initialTuition }) => {
  const { user } = useUser();
  const { students } = useStudents();
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

  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    tutorId: "",
    subjectId: "",
    levelId: "",
    status: "",
    currency: "",
    studentPrice: 0,
    tutorPrice: 0,
    startDateTime: "",
    duration: 60,
    repeatWeeks: 1,
    trial: true,
  });

  useEffect(() => {
    if (formData.levelId && formData.currency) {
      const selectedLevel = levels.find((l) => l.id === formData.levelId);
      if (selectedLevel) {
        const prices = {
          [Currency.USD]: {
            student: selectedLevel.student_price_usd ?? 0,
            tutor: selectedLevel.tutor_price_usd ?? 0,
          },
          [Currency.GBP]: {
            student: selectedLevel.student_price_gbp ?? 0,
            tutor: selectedLevel.tutor_price_gbp ?? 0,
          },
          [Currency.MYR]: {
            student: selectedLevel.student_price_myr ?? 0,
            tutor: selectedLevel.tutor_price_myr ?? 0,
          },
        };

        setFormData((prevData) => ({
          ...prevData,
          studentPrice: prices[formData.currency as Currency].student,
          tutorPrice: prices[formData.currency as Currency].tutor,
        }));
      }
    }
  }, [formData.levelId, formData.currency, levels]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (initialTuition) {
      setFormData({
        name: initialTuition?.name || "",
        studentId: initialTuition?.studentId || "",
        tutorId: initialTuition?.tutorId || "",
        subjectId: initialTuition?.subjectId || "",
        levelId: initialTuition?.levelId || "",
        status: initialTuition?.status || "",
        currency: initialTuition?.currency || Currency.MYR,
        studentPrice: initialTuition?.studentPrice || 0,
        tutorPrice: initialTuition?.tutorPrice || 0,
        startDateTime: initialTuition?.startTime || "",
        duration: initialTuition?.duration || 60,
        repeatWeeks: 1,
        trial: initialTuition?.trial ?? true,
      });
    }
    setIsLoading(false);
  }, [initialTuition]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
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
    setIsSubmitting(true);

    try {
      const startTime = new Date(formData.startDateTime);
      const duration = Number(formData.duration);
      const repeatWeeks = Number(formData.repeatWeeks);

      if (!initialTuition) {
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
        toast({
          title: "Success",
          description: `${repeatWeeks} tuition sessions created successfully.`,
        });
        router.back();
      } else {
        const newStartTime = new Date(startTime.getTime() + 8 * 60 * 60 * 1000);
        const zoomStartTime = newStartTime.toISOString();

        if (
          initialTuition.startTime !== zoomStartTime ||
          initialTuition.name !== formData.name ||
          initialTuition.duration !== duration
        ) {
          const zoomAcc = getZoomAcc(zoomStartTime, duration);
          if (!zoomAcc) throw new Error("No Zoom Account Available");

          await updateZoom(
            zoomAcc,
            initialTuition.meetingId ?? "",
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
          zoomStartTime,
          duration,
          initialTuition.url,
          formData.studentPrice,
          formData.tutorPrice,
          formData.currency as Currency,
          siid,
          tiid,
          initialTuition.meetingId,
          formData.trial
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
    student: students.map((student) => ({
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="student">Student</Label>
          <Select
            value={formData.studentId}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, studentId: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Student" />
            </SelectTrigger>
            <SelectContent>
              {optionsMap.student.map((option) => (
                <SelectItem key={option.value} value={option.value as string}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {user?.role !== "tutor" && <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="tutor">Tutor</Label>
          <Select
            value={formData.tutorId}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, tutorId: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Tutor" />
            </SelectTrigger>
            <SelectContent>
              {optionsMap.tutor.map((option) => (
                <SelectItem key={option.value} value={option.value as string}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="subject">Subject</Label>
          <Select
            value={formData.subjectId}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, subjectId: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              {optionsMap.subject.map((option) => (
                <SelectItem key={option.value} value={option.value as string}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="level">Level</Label>
          <Select
            value={formData.levelId}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, levelId: value }))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Level" />
            </SelectTrigger>
            <SelectContent>
              {optionsMap.level.map((option) => (
                <SelectItem key={option.value} value={option.value as string}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, status: value }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {optionsMap.status.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="currency">Currency</Label>
        <Select
          value={formData.currency}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, currency: value as Currency }))
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            {optionsMap.currency.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {user?.role !== "tutor" && <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="student-rate">Student Rate</Label>
          <Input
            type="number"
            name="studentPrice"
            value={formData.studentPrice}
            onChange={handleChange}
            placeholder="Student Price"
            required
          />
        </div>
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="tutor-rate">Tutor Rate</Label>
          <Input
            type="number"
            name="tutorPrice"
            value={formData.tutorPrice}
            onChange={handleChange}
            placeholder="Tutor Price"
            required
          />
        </div>
      </div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="datetime">Date & Time</Label>
          <Input
            type="datetime-local"
            name="startDateTime"
            value={formatDateTimeLocal(formData.startDateTime as string)}
            onChange={handleChange}
            placeholder="Start Time"
            required
          />
        </div>
        {/* FIXME : Duration's granularity should be 30 minutes instead of 1 minute? */}
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="duration">Duration (min)</Label>
          <Input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="Duration (minutes)"
            required
          />
        </div>
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="repeatWeeks">Repeat Weeks</Label>
        <Input
          type="number"
          name="repeatWeeks"
          value={formData.repeatWeeks}
          onChange={handleChange}
          placeholder="Repeat Weeks"
          required
          min={1}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="trial"
          checked={formData.trial}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, trial: checked as boolean }))
          }
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
