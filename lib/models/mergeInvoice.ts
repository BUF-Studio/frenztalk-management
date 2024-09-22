import type { InvoiceStatus } from "./invoiceStatus";

export class MergeInvoice {
  constructor(
    public id: string | null,
    public invoicesId: string[],
    public month: string,
    public rate: number,
    public status: InvoiceStatus,
    // TODO: add one more currency to the MergeInvoice model


  ) { }

  static fromMap(data: Record<string, any>, id: string) {
    return new MergeInvoice(
      id,
      data.invoicesId,
      data.month,
      data.rate,
      data.status,

    );
  }

  toMap(): Record<string, any> {
    return {
      invoicesId: this.invoicesId,
      month: this.month,
      rate: this.rate,
      status: this.status,
    };
  }
}
