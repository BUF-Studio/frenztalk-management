
export class AvaSubject {
    constructor(
        public avaSubjectId: string | null,
        public name: string,
    ) { }

    static fromMap(data: Record<string, any>, id: string) {
        return new AvaSubject(
            id,
            data.name,
        );
    }

    toMap(): Record<string, any> {
        return {
            // avaSubjectId: this.avaSubjectId,
            name: this.name,
        };
    }
}