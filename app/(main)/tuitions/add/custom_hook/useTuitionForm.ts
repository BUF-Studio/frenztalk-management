import { useState, useEffect } from "react";
import { useUser } from "@/lib/context/collection/userContext"; // Adjust based on your context provider
import Currency from "@/lib/models/currency";
import { Level } from "@/lib/models/level";

interface TuitionFormData {
  name: string;
  studentId: string;
  tutorId: string;
  subjectId: string;
  levelId: string;
  status: string;
  currency: string;
  studentPrice: number;
  tutorPrice: number;
  startDateTime: string;
  duration: number;
  repeatWeeks: number;
  trial: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export const useTuitionForm = (initialTuition: any, levels: Level[]) => {
  const { user } = useUser();

  const [formData, setFormData] = useState<TuitionFormData>({
    name: initialTuition?.name || "",
    studentId: initialTuition?.studentId || "",
    tutorId: initialTuition?.tutorId || (user?.role === 'tutor' ? user.id:''),
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  // Updates prices when levelId or currency changes
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

  const validateTuitionForm = (
    formData: TuitionFormData
  ): FormErrors => {
    const errors: FormErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      errors.name = "Tuition name is required.";
    }

    // Validate studentId
    if (!formData.studentId) {
      errors.studentId = "Student is required.";
    }

    // Validate tutorId (if the user is not a tutor, since you're handling this separately)
    if (formData.tutorId === "") {
      errors.tutorId = "Tutor is required.";
    }

    // Validate subjectId
    if (!formData.subjectId) {
      errors.subjectId = "Subject is required.";
    }

    // Validate levelId
    if (!formData.levelId) {
      errors.levelId = "Level is required.";
    }

    // Validate status
    if (!formData.status) {
      errors.status = "Status is required.";
    }

    // Validate currency
    if (!formData.currency) {
      errors.currency = "Currency is required.";
    }

    // Validate studentPrice
    if (formData.studentPrice <= 0) {
      errors.studentPrice = "Student price must be a positive value.";
    }

    // Validate tutorPrice
    if (formData.tutorPrice <= 0) {
      errors.tutorPrice = "Tutor price must be a positive value.";
    }

    // Validate startDateTime
    if (!formData.startDateTime) {
      errors.startDateTime = "Start date and time are required.";
    } else if (isNaN(new Date(formData.startDateTime).getTime())) {
      errors.startDateTime = "Invalid start date and time.";
    }

    // Validate duration
    if (formData.duration <= 0) {
      errors.duration = "Duration must be a positive number.";
    }

    // Validate repeatWeeks (if this field should not be zero)
    if (formData.repeatWeeks <= 0) {
      errors.repeatWeeks = "Repeat weeks must be a positive number.";
    }

    return errors;
  };

  return {
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    validateTuitionForm,
  };
};
