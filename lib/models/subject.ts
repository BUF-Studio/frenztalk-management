export class Subject {
  constructor(
    public subjectId: string | null,
    public tutorId: string,
    public avaSubjectId: string,
  ) {}

  static fromMap(data: Record<string, any>, id: string) {
    return new Subject(id, data.tutorId, data.avaSubjectId);
  }

  toMap(): Record<string, any> {
    return {
      tutorId: this.tutorId,
      avaSubjectId: this.avaSubjectId,
    };
  }
}
