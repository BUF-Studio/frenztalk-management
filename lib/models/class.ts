import { Timestamp } from "firebase/firestore";

export class Class {
  constructor(
    public classId: string | null,
    public subjectId: string,
    public startTime: Timestamp | null,
    public endTime: Timestamp | null,
    public status: string,
  ) {}

  static fromMap(data: Record<string, any>, id: string) {
    return new Class(
      id,
      data.subjectId,
      data.startTime,
      data.endTime,
      data.status,
    );
  }

  toMap(): Record<string, any> {
    return {
      // studentId: this.studentId,
      subjectId: this.subjectId,
      startTime: this.startTime,
      endTime: this.endTime,
      status: this.status,
    };
  }
}
