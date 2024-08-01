import InvoiceStatus from "./invoiceStatus";

export class Invoice {
  constructor(
    public id: string | null,

    public tuitionId: string,
    public tutorId: string,
    public studentId: string,
    public subjectId: string,
    public rate: number,
    public status: InvoiceStatus,
    // public rate: string,


  ) { }

  static fromMap(data: Record<string, any>, id: string) {
    return new Invoice(
      id,
      data.tuitionId,
      data.tutorId,
      data.studentId,
      data.subjectId,
      data.rate,
      data.status,
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

    };
  }
}
