import { Timestamp } from "firebase/firestore";

export class Tuition {
  constructor(
    public id: string | null,
    public name: string,
    public tutorId: string,
    public studentId: string,
    public startTime: Timestamp | null,
    public endTime: Timestamp | null,
    public status: string,
  ) { }

  static fromMap(data: Record<string, any>, id: string) {
    return new Tuition(
      id,
      data.name,
      data.tutorId,
      data.studentId,
      data.startTime,
      data.endTime,
      data.status,
    );
  }

  toMap(): Record<string, any> {
    return {
      // studentId: this.studentId,
      name: this.name,
      tutorId: this.tutorId,
      studentId: this.studentId,
      startTime: this.startTime,
      endTime: this.endTime,
      status: this.status,
    };
  }
}
