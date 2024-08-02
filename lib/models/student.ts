export class Student {
  constructor(
    public id: string | null,
    public name: string,
    public age: number,
    public status: string,
    public tuitionsId: string[],
    public tutorsId: string[],
  ) { }

  static fromMap(data: Record<string, any>, id: string) {
    return new Student(
      id,
      data.name,
      data.age,
      data.status,
      data.tuitionsId ?? [],
      data.tutorsId ?? [],
    );
  }

  toMap(): Record<string, any> {
    return {
      name: this.name,
      age: this.age,
      status: this.status,
      tuitionsId: this.tuitionsId,
      tutorsId: this.tutorsId,
    };
  }
}
