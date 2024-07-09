
export class Student {
    constructor(
        public id: string | number,
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
            id: this.id,
            name: this.name,
            age: this.age,
        };
    }
}