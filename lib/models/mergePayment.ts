import { InvoiceStatus } from "./invoiceStatus";

export class MergePayment {
  constructor(
    public id: string | null,
    public paymentsId: string[],
    public month: string,
    public rate: number,
    public status: InvoiceStatus,
    public tutorId: string,


  ) { }

  static fromMap(data: Record<string, any>, id: string) {
    return new MergePayment(
      id,
      data.paymentsId,
      data.month,
      data.rate,
      data.status,
      data.tutorId,

    );
  }

  toMap(): Record<string, any> {
    return {
      paymentsId: this.paymentsId,
      month: this.month,
      rate: this.rate,
      status: this.status,
      tutorId: this.tutorId,
    };
  }
}
