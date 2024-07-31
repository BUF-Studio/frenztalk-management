export class Tutor {
  constructor(
    public id: string | null,
    public name: string,
    public subjects: string[],
    public des: string,
    public status: string,
    public pic: string,
  ) {}

  static fromMap(data: Record<string, any>, id: string) {
    return new Tutor(
      id,
      data.name,
      data.subjects,
      data.des,
      data.status,
      data.pic,
    );
  }

  toMap(): Record<string, any> {
    return {
      name: this.name,
      subjects: this.subjects,
      des: this.des,
      status: this.status,
      pic: this.pic,
    };
  }
}
