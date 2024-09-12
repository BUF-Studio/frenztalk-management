export interface Student {
  id: string | null;
  name: string;
  age: number;
  status: string;
}

export const studentFromMap = (data: Record<string, any>, id: string): Student => ({
  id,
  name: data.name,
  age: data.age,
  status: data.status,
});

export const studentToMap = (student: Student): Record<string, any> => ({
  name: student.name,
  age: student.age,
  status: student.status,
});