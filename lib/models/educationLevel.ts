export class Subject {
    constructor(
        public id: string | null,
        public name: string,
    ) { }

    static fromMap(data: Record<string, any>, id: string) {
        return new Subject(
            id,
            data.name,
        );
    }

    toMap(): Record<string, any> {
        return {
            name: this.name,
        };
    }
}
