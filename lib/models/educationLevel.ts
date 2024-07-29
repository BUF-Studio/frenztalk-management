export class EducationLevel {
    constructor(
        public id: string | null,
        public name: string,
        public levels: string[],
    ) { }

    static fromMap(data: Record<string, any>, id: string) {
        return new EducationLevel(
            id,
            data.name,
            data.levels,
        );
    }

    toMap(): Record<string, any> {
        return {
            name: this.name,
            levels: this.levels,
        };
    }
}
