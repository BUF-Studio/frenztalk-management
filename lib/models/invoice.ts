
export class Invoice {
    constructor(
        public invoiceId: string | null,
        public name: string,
        public age: number,
    ) { }

    static fromMap(data: Record<string, any>, id: string) {
        return new Invoice(
            id,
            data.name,
            data.age
        );
    }

    toMap(): Record<string, any> {
        return {
            invoiceId: this.invoiceId,
            name: this.name,
            age: this.age,
        };
    }
}