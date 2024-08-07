"use client";

import { DataTable } from "@/app/components/dashboard/DataTable";
import { useStudents } from "@/lib/context/collection/studentsContext";
import { useStudentPage } from "@/lib/context/page/studentPageContext";
import { addStudent, updateStudent } from "@/lib/firebase/student";
import { Student } from "@/lib/models/student";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSnackbar } from "@/lib/context/component/SnackbarContext";
import Badge from "@/app/components/dashboard/Badge";

export default function StudentList() {
  const { students } = useStudents();
  const router = useRouter();
  const { student, setStudent } = useStudentPage();
  const { showSnackbar } = useSnackbar();

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | string>("");
  const [status, setStatus] = useState("active");

  const toggleDialog = () => {
    setName("");
    setAge("");
    setStatus("active");
    setIsOpen(!isOpen);
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (student === null) {
        const newStudent = new Student(null, name, Number(age), status);
        await addStudent(newStudent);
      } else {
        const updatedStudent = new Student(
          student.id,
          name,
          Number(age),
          status
        );
        await updateStudent(updatedStudent);
      }
      toggleDialog();
      showSnackbar("Successfully added student", "success");
    } catch (error) {
      showSnackbar("Error adding student", "error");
    }
  };

  const columns: { key: keyof Student; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "age", label: "Age" },
    { key: "status", label: "Status" },
  ];

  const renderStudentCell = (student: Student, columnKey: keyof Student) => {
    if (columnKey === "status") {
      return <Badge status={student.status as string} />;
    }
    return student[columnKey] as React.ReactNode;
  };


  const viewStudent = (student: Student) => {
    setStudent(student);
    router.push(`/back/students/${student.id}`);
  };

  return (
    <div>
      <div className="flex flex-1 flex-row justify-between pb-4">
        <h1 className="text-xl font-bold">Student List</h1>
        <button
          className="flex flex-row items-center px-4 py-2  bg-red-800 text-white text-sm rounded-md font-semibold hover:bg-red-800/[0.8] hover:shadow-lg"
          type="button"
          onClick={toggleDialog}
        >
          <Plus size={16} strokeWidth={3} className="mr-1" />
          Add Student
        </button>
      </div>
      <DataTable
        data={students}
        columns={columns}
        actions={[]}
        onRowClick={(student) => viewStudent(student)}
        renderCell={renderStudentCell}
      />
      {isOpen && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        <div
          className="fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm"
          onClick={toggleDialog}
        >
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
          <div
            className="relative mx-auto flex w-full max-w-[24rem] flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            <form
              onSubmit={handleAddStudent}
              className="flex flex-col gap-4 p-6"
            >
              <h4 className="block font-sans text-2xl font-semibold leading-snug tracking-normal text-blue-gray-900">
                Create Student
              </h4>
              <p className="block mb-3 font-sans text-base font-normal leading-relaxed text-gray-700">
                Enter new student&apos;s information.
              </p>
              <div className="relative h-11 w-full min-w-[200px]">
                <input
                  type="text"
                  className="w-full h-full px-3 py-3 font-sans text-sm font-normal transition-all bg-transparent border rounded-md peer border-blue-gray-200 border-t-transparent text-blue-gray-700 outline outline-0 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                  placeholder=" "
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                  Name
                </label>
              </div>
              <div className="relative h-11 w-full min-w-[200px]">
                <input
                  type="number"
                  className="w-full h-full px-3 py-3 font-sans text-sm font-normal transition-all bg-transparent border rounded-md peer border-blue-gray-200 border-t-transparent text-blue-gray-700 outline outline-0 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                  placeholder=" "
                  value={age}
                  onChange={(e) =>
                    setAge(
                      e.target.value === ""
                        ? ""
                        : Number.parseInt(e.target.value)
                    )
                  }
                  required
                />
                <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                  Age
                </label>
              </div>
              <div className="relative h-11 w-full min-w-[200px]">
                <select
                  className="w-full h-full px-3 py-3 font-sans text-sm font-normal transition-all bg-transparent border rounded-md peer border-blue-gray-200 border-t-transparent text-blue-gray-700 outline outline-0 placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                  required
                >
                  <option value="active">Active</option>
                  <option value="frozen">Frozen</option>
                </select>
                <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.1] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                  Status
                </label>
              </div>
              <div className="p-6 pt-0">
                <button
                  className="block w-full select-none rounded-lg bg-gradient-to-tr from-red-900 to-red-800 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                  type="submit"
                >
                  Create Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
