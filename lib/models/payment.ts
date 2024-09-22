import Currency from "./currency";
import { InvoiceStatus } from "./invoiceStatus";


export class Payment {
  constructor(
    public id: string | null,
    public tuitionId: string,
    public tutorId: string,
    public studentId: string,
    public subjectId: string,
    public rate: number,
    public status: InvoiceStatus,
    public startDateTime: string,
    public duration: number,
    public currency: Currency,
    public price: number,

    // public rate: string,


  ) { }

  static fromMap(data: Record<string, any>, id: string) {
    return new Payment(
      id,
      data.tuitionId,
      data.tutorId,
      data.studentId,
      data.subjectId,
      data.rate,
      data.status,
      data.startDateTime,
      data.duration,
      data.currency,
      data.price,
    );
  }

  toMap(): Record<string, any> {
    return {
      // invoiceId: this.invoiceId,
      tuitionId: this.tuitionId,
      tutorId: this.tutorId,
      studentId: this.studentId,
      subjectId: this.subjectId,
      rate: this.rate,
      status: this.status,
      startDateTime: this.startDateTime,
      duration: this.duration,
      currency: this.currency,
      price: this.price,

    };
  }
}
