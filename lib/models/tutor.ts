
export class Tutor {
  constructor(
    public id: string | null,
    public name: string,
    public subjects: string[],
    // public studentId: string[],
    public des: string,
    public status: string,
    public pic: string,
    public createdAt: Date
  ) {}

  static fromMap(data: Record<string, any>, id: string) {
    return new Tutor(
      id,
      data.name,
      data.subjects,
      // data.studentId,
      data.des,
      data.status,
      data.pic,
      data.createdAt ? new Date(data.createdAt) : new Date()
    );
  }

  toMap(): Record<string, any> {
    return {
      name: this.name,
      subjects: this.subjects,
      // studentId: this.studentId,
      des: this.des,
      status: this.status,
      pic: this.pic,
      createdAt: this.createdAt.toISOString()
    };
  }
}