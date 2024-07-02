
export class Student {
    constructor(
        public studentId: string | null,
        public name: string,
        public age: number,
    ) { }

    static fromMap(data: Record<string, any>, id: string) {
        return new Student(
            id,
            data.name,
            data.age
        );
    }

    toMap(): Record<string, any> {
        return {
            studentId: this.studentId,
            name: this.name,
            age: this.age,
        };
    }
}