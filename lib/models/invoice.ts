export class Invoice {
  constructor(
    public id: string | null,

    public tuitionId: string,
    public tutorId: string,
    public studentId: string,
    public rate: number,


  ) { }

  static fromMap(data: Record<string, any>, id: string) {
    return new Invoice(
      id,
      data.tuitionId,
      data.tutorId,
      data.studentId,
      data.rate,
    );
  }

  toMap(): Record<string, any> {
    return {
      // invoiceId: this.invoiceId,
      tuitionId: this.tuitionId,
      tutorId: this.tutorId,
      studentId: this.studentId,
      rate: this.rate,

    };
  }
}
