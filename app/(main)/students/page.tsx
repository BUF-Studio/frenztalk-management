import { DataTable } from "@/app/components/ui/data-table";
import { columns } from "./columns";
import { serverSidePaginateCollection } from "@/lib/firebase/service/serverFirestore";
import { studentFromMap, type Student } from "@/lib/models/student";

export default async function StudentList() {
  let studentData: Student[] = [];
  try {
    const { data, lastDocumentId, hasMore } =
      await serverSidePaginateCollection<Student>(
        "students",
        studentFromMap,
        10
      );
    studentData = data || [];
    console.log("User data:", studentData);
  } catch (error) {
    console.error("Error fetching user data:", error);
  }

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
