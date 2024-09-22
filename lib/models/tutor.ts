export interface Tutor {
  id: string | null,
  name: string,
  subjects: string[],
  studentId: string[],
  des: string,
  status: string,
  pic: string,

}

export class Tutor {
  constructor(
    public id: string | null,
    public name: string,
    public subjects: string[],
    public studentId: string[],
    public des: string,
    public status: string,
    public pic: string,
  ) {}

  static fromMap(data: Record<string, any>, id: string) {
    return new Tutor(
      id,
      data.name,
      data.subjects,
      data.studentId,
      data.des,
      data.status,
      data.pic,
    );
  }

  toMap(): Record<string, any> {
    return {
      name: this.name,
      subjects: this.subjects,
      studentId: this.studentId,
      des: this.des,
      status: this.status,
      pic: this.pic,
    };
  }
}