import Currency from "./currency";
import { InvoiceStatus } from "./invoiceStatus";

export class MergeInvoice {
  constructor(
    public id: string | null,
    public invoicesId: string[],
    public month: string,
    public rate: number,
    public status: InvoiceStatus,
    public currency: Currency,
    public studentId: string,


  ) { }

  static fromMap(data: Record<string, any>, id: string) {
    return new MergeInvoice(
      id,
      data.invoicesId,
      data.month,
      data.rate,
      data.status,
      data.currency,
      data.studentId,

    );
  }

  toMap(): Record<string, any> {
    return {
      invoicesId: this.invoicesId,
      month: this.month,
      rate: this.rate,
      status: this.status,
      currency: this.currency,
      studentId: this.studentId,
    };
  }
}
