
export class Tutor {
    constructor(
        public tutorId: string | null,
        public name: string,
        public age: number,
    ) { }

    static fromMap(data: Record<string, any>, id: string) {
        return new Tutor(
            id,
            data.name,
            data.age
        );
    }

    toMap(): Record<string, any> {
        return {
            tutorId: this.tutorId,
            name: this.name,
            age: this.age,
        };
    }
}