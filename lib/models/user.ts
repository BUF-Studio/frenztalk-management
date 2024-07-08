
export class User {
    constructor(
        public userId: string | null,
        public name: string,
    ) { }

    static fromMap(data: Record<string, any>, id: string) {
        return new User(
            id,
            data.name,
        );
    }

    toMap(): Record<string, any> {
        return {
            invoiceId: this.userId,
            name: this.name,
        };
    }
}