
import Currency from "./currency";

export interface Tuition {
  id: string | null;
  name: string;
  tutorId: string;
  studentId: string;
  subjectId: string;
  levelId: string;
  status: string;
  startTime: string | null;
  duration: number;
  url: string;
  studentPrice: number;
  tutorPrice: number;
  currency: Currency;
  studentInvoiceId: string | null;
  tutorInvoiceId: string | null;
  meetingId: string | null;
  trial: boolean;
}