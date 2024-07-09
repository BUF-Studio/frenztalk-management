export class User {
    constructor(
        public userId: string | null,
        public name: string,
        public age: number,
    ) { }

    static fromMap(data: Record<string, any>, id: string) {
        return new User(
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