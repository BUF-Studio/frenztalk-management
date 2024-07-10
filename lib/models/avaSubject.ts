export class AvaSubject {
    constructor(
        public id: string | null,
        public name: string,
        public level: string,
    ) { }

    static fromMap(data: Record<string, any>, id: string) {
        return new AvaSubject(id, data.name, data.level);
    }

    toMap(): Record<string, any> {
        return {
            // avaSubjectId: this.avaSubjectId,
            name: this.name,
            level: this.level,
        };
    }
}
