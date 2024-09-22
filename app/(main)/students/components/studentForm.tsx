import type React from "react";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Button } from "@/app/components/ui/button";
import { toast } from "@/app/components/hooks/use-toast";
import { Student } from "@/lib/models/student";
import { addStudent, updateStudent } from "@/lib/firebase/student";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";

interface StudentFormProps {
  initialStudent?: Student | null;
}

const StudentForm: React.FC<StudentFormProps> = ({ initialStudent }) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    status: "active",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (initialStudent) {
      console.log("initial student:", initialStudent);
      setFormData({
        name: initialStudent.name || "",
        age: initialStudent.age?.toString() || "",
        status: initialStudent.status || "active",
      });
    }
    setIsLoading(false);
  }, [initialStudent]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (initialStudent) {
        const studentData = new Student(
          initialStudent.id,
          formData.name,
          Number.parseInt(formData.age),
          formData.status
        );
        await updateStudent(studentData);
      } else {
        const studentData = new Student(
          null,
          formData.name,
          Number.parseInt(formData.age),
          formData.status
        );
        await addStudent(studentData);
      }
      toast({
        title: initialStudent ? "Student Updated" : "Student Created",
        description: `Successfully ${
          initialStudent ? "updated" : "added"
        } student: ${formData.name}`,
        variant: "default",
      });
      revalidatePath("/students/[id]");
      router.back();
    } catch (error) {
      console.error("Error saving student:", error);
      toast({
        title: "Error",
        description: "Failed to save student. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const optionsMap = {
    status: [
      { value: "active", label: "Active" },
      { value: "frozen", label: "Frozen" },
    ],
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <Input
        type="number"
        name="age"
        value={formData.age}
        onChange={handleChange}
        placeholder="Age"
        required
      />
      <Select
        value={formData.status}
        onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {optionsMap.status.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex justify-end space-x-2 mt-6">
        <Button type="submit" variant="default" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting
            ? "Loading..."
            : initialStudent
            ? "Update Student"
            : "Add Student"}
        </Button>
      </div>
    </form>
  );
};

export default StudentForm;