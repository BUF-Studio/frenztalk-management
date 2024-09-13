import type React from "react";
import { useState, useEffect } from "react";
import { Loader2, X } from "lucide-react";
import type Student from "@/lib/models/student";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { useSnackbar } from "@/lib/context/component/SnackbarContext";
import { Button } from "@/app/components/ui/button";
import { toast } from "@/app/components/hooks/use-toast";

interface StudentFormProps {
  initialStudent?: Student | null;
}

const StudentForm: React.FC<StudentFormProps> = ({ initialStudent }) => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    status: "active",
  });
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialStudent) {
      setFormData({
        name: initialStudent.name || "",
        age: initialStudent.age?.toString() || "",
        status: initialStudent.status || "active",
      });
    }
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
    e.preventDefault()
    setIsSubmitting(true)

    const studentData = {
      ...formData,
      age: parseInt(formData.age, 10),
    }

    try {
      const response = await fetch('/api/students', {
        method: initialStudent ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(initialStudent ? { ...studentData, id: initialStudent.id } : studentData),
      })

      if (!response.ok) {
        throw new Error('Failed to save student')
      }

      const result = await response.json()
      console.log("Result:", result)
      toast({
          title: initialStudent ? "Student Updated" : "Student Created",
          description: `Successfully ${initialStudent ? 'updated' : 'added'} student: ${studentData.name}`,
          variant: "default",
        })
      } catch (error) {
        console.error("Error saving student:", error)
      toast({
        title: "Error",
        description: "Failed to save student. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const optionsMap = {
    status: [
      { value: "active", label: "Active" },
      { value: "frozen", label: "Frozen" },
    ],
  };

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
        defaultValue={"active"}
        value={formData.status}
        onValueChange={(value) => setFormData({ ...formData, status: value })}
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
        <Button
          type="submit"
          variant="default"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? 'Loading...' : (initialStudent ? 'Update Student' : 'Add Student')}
        </Button>
      </div>
    </form>
  );
};

export default StudentForm;
