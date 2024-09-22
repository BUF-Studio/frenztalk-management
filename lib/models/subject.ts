export class Subject {
    constructor(
        public id: string | null,
        public name: string,
        // public levelId: string,
    ) { }

    static fromMap(data: Record<string, any>, id: string) {
        return new Subject(
            id,
            data.name,
            // data.levelId,
        );
    }

    toMap(): Record<string, any> {
        return {
            name: this.name,
            // levelId: this.levelId,
        };
    }
}