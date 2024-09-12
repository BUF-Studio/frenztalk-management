import { DataTable } from "@/app/components/ui/data-table";
import { columns } from "./columns";
import { serverSidePaginateCollection } from "@/lib/firebase/service/serverFirestore";
import { studentFromMap, type Student } from "@/lib/models/student";

import { DataTable } from "@/app/components/dashboard/DataTable";
// import { useStudents } from "@/lib/context/collection/studentsContext";
import { useStudentPage } from "@/lib/context/page/studentPageContext";
// import { addStudent, updateStudent } from "@/lib/firebase/student";
import { Student } from "@/lib/models/student";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSnackbar } from "@/lib/context/component/SnackbarContext";
import { Badge, type BadgeProps } from "@/app/components/general/badge";
import StudentDialog from "./components/studentForm";
import { capitalizeFirstLetter } from "@/utils/util";
import { useTableColumn } from "@/lib/general_hooks/useTableColumn";
import { TableOrderEnum } from "@/lib/enums/TableOrderEnum";
import { useSearchTableData } from "@/lib/general_hooks/useSearchTableData";
import { SearchBar } from "@/app/components/general/input/searchBar";
import PaginatedResult from "@/lib/models/paginationResult";

export default function StudentList() {
  // const { students } = useStudents();
  const [students, setStudents] = useState<PaginatedResult<Student>>({ data: [], total: 0, page: 1, pageSize: 10 })
  const router = useRouter();
  // const { setStudent } = useStudentPage();
  const { showSnackbar } = useSnackbar();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    fetchStudents()
    
  }, [])

  async function fetchStudents(page = 1) {
    const response = await fetch(`/api/students?page=${page}&pageSize=10`)
    const data = await response.json()
    setStudents(data)
  }

  function getStatusVariant(status: string): BadgeProps["variant"] {
    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "frozen":
        return "error";
      default:
        return "info";
    }
  }

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  const handleAddStudent = async (studentData: Partial<Student>) => {
    try {
      const newStudent = new Student(
        null,
        studentData.name ?? "",
        studentData.age ?? 0,
        studentData.status ?? "active"
      );

      // await addStudent(newStudent);
      showSnackbar("Successfully added student", "success");
      toggleDialog();
    } catch (error) {
      showSnackbar("Error processing student", "error");
    }
  };

  const initialColumns: { key: keyof Student; label: string; order: string }[] =
    [
      { key: "id", label: "ID", order: TableOrderEnum.NONE },
      { key: "name", label: "Name", order: TableOrderEnum.NONE },
      { key: "age", label: "Age", order: TableOrderEnum.NONE },
      { key: "status", label: "Status", order: TableOrderEnum.NONE },
    ];

  const [columns, setColumns] = useState(initialColumns);

  const { sortedData: sortedStudents, sortColumn: sortStudentByColumns } =
    useTableColumn(students.data, columns, setColumns);

  const { filteredData: filteredStudents } = useSearchTableData(
    sortedStudents,
    searchTerm
  );

  const renderStudentCell = (student: Student, columnKey: keyof Student) => {
    if (columnKey === "status") {
      return (
        <Badge variant={getStatusVariant(student.status)}>
          {capitalizeFirstLetter(student.status as string)}
        </Badge>
      );
    }
    return student[columnKey] as React.ReactNode;
  };

  const viewStudent = (student: Student) => {
    // setStudent(student);
    router.push(`/students/${student.id}`);
  };

  return (
    <div>
      <div className="flex flex-1 flex-row justify-between items-center pb-4">
        <h1 className="text-xl font-bold">Student List</h1>
        <div className="flex flex-row items-center space-x-4"/>
      </div>
      <DataTable columns={columns} data={studentData} />
    </div>
  );
}
