import { Timestamp } from "firebase/firestore";

export class Tuition {
  constructor(
    public id: string | null,
    public name: string,
    public tutorId: string,
    public studentId: string,
    public subjectId: string,
    public status: string,
    public startTime: Timestamp | null,
    public duration: number,
    public url: string,
    public price: number,
    public currency: string,
  ) { }

  static fromMap(data: Record<string, any>, id: string) {
    return new Tuition(
      id,
      data.name,
      data.tutorId,
      data.studentId,
      data.subjectId,
      data.status,
      data.startTime,
      data.duration,
      data.url,
      data.price,
      data.currency,
    );
  }

  toMap(): Record<string, any> {
    return {
      name: this.name,
      tutorId: this.tutorId,
      studentId: this.studentId,
      subjectId: this.subjectId,
      status: this.status,
      startTime: this.startTime,
      duration: this.duration,
      url: this.url,
      price: this.price,
      currency: this.currency,
    };
  }
}
