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

export const useTuitionForm = (initialTuition: any, levels: Level[]) => {
  const { user } = useUser();

  const [formData, setFormData] = useState<TuitionFormData>({
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  return {
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
  };
};
