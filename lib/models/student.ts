export class Student {
  constructor(
    public id: string | null,
    public name: string,
    public contact: string,
    public parentName: string,
    public parentContact: string,
    public nationality: string,
    public age: number,
    public status: string,
    public createdAt: Date,
  ) // public tuitionsId: string[],
  // public tutorsId: string[],
  {}

  static fromMap(data: Record<string, any>, id: string) {
    return new Student(
      id,
      data.name,
      data.contact,
      data.parentName,
      data.parentContact,
      data.nationality,
      data.age,
      data.status,
      new Date(data.createdAt)
    );
  }

  toMap(): Record<string, any> {
    
    return {
      name: this.name,
      contact: this.contact,
      parentName: this.parentName,
      parentContact: this.parentContact,
      nationality: this.nationality,
      age: this.age,
      status: this.status,
      createdAt: this.createdAt.toISOString()
    };
  }
}
