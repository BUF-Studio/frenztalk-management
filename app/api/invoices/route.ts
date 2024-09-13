import { type NextRequest, NextResponse } from "next/server";
import {
  createDocument,
  deleteDocument,
  getData,
  getPaginatedData,
  type QueryFilter,
  type SearchQuery,
  type SortOption,
  updateDocument,
} from "@/lib/firebase/service/firebaseCRUD";
import { Invoice } from "@/lib/models/invoice";

const PATH = "invoices";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const studentId = searchParams.get("studentId");
    const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.max(1, Number.parseInt(searchParams.get("pageSize") || "10", 10));
    const sortField = searchParams.get("sortField");
    const sortDirection = searchParams.get("sortDirection");
    const searchTerm = searchParams.get("searchTerm");
  
    try {
      if (id) {
        // Fetch a single document by ID
        const result = await getData<Invoice>(PATH, id);
        if (!result) {
          return NextResponse.json(
            { error: "Invoice not found" },
            { status: 404 }
          );
        }
        return NextResponse.json(result);
      }
      const query: QueryFilter[] = [];
  
      if (studentId) {
        const q: QueryFilter = {
          field: "studentId",
          operator: "==",
          value: studentId,
        };
        query.push(q);
      }
  
      let sortOption: SortOption | undefined;
  
      if (sortField && sortDirection) {
        sortOption = {
          field: sortField as string,
          direction: sortDirection as "asc" | "desc",
        };
      }
  
      let searchQuery: SearchQuery | undefined;
  
      if (searchTerm) {
        searchQuery = {
          field: "name",
          term: searchTerm,
        };
      }
  
      const result = await getPaginatedData<Invoice>(
        PATH,
        page,
        pageSize,
        query,
        sortOption,
        searchQuery
      );
      return NextResponse.json(result);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = await createDocument(PATH, body);
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    await updateDocument(PATH, id, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await deleteDocument(PATH, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
