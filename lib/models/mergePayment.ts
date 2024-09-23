import Currency from "./currency";
import type { InvoiceStatus } from "./invoiceStatus";

export class MergePayment {
  constructor(
    public id: string | null,
    public paymentsId: string[],
    public month: string,
    public rate: number,
    public status: InvoiceStatus,
    public currency: Currency,
    public tutorId: string,


  ) { }

  static fromMap(data: Record<string, any>, id: string) {
    return new MergePayment(
      id,
      data.paymentsId,
      data.month,
      data.rate,
      data.status,
      data.currency,
      data.tutorId,

    );
  }

  toMap(): Record<string, any> {
    return {
      paymentsId: this.paymentsId,
      month: this.month,
      rate: this.rate,
      status: this.status,
      currency: this.currency,
      tutorId: this.tutorId,
    };
  }
}
