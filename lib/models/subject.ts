export class Subject {
    constructor(
        public id: string | null,
        public name: string,
        public tutorId: string,
        public avaSubjectId: string,
    ) { }

    static fromMap(data: Record<string, any>, id: string) {
        return new Subject(
            id,
            data.name,
            data.tutorId,
            data.avaSubjectId
        );
    }

    toMap(): Record<string, any> {
        return {
            name: this.name,
            tutorId: this.tutorId,
            avaSubjectId: this.avaSubjectId,
        };
    }
}
