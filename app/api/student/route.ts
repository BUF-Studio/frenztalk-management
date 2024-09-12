import { NextRequest, NextResponse } from 'next/server';
import { Student } from '@/lib/models/student';
import { createDocument, deleteDocument, getData, getPaginatedData, setDocument } from '@/lib/firebase/service/firebaseCRUD';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    if (id) {
        try {
            const result = await getData<Student>('students');
            return NextResponse.json(result);
        } catch (error) {
            console.error('Error fetching students:', error);
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }
    } else {
        const page = parseInt(searchParams.get('page') || '1', 10);
        const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

        try {
            const result = await getPaginatedData<Student>('students', page, pageSize);
            return NextResponse.json(result);
        } catch (error) {
            console.error('Error fetching students:', error);
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }
    }

}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const id = await createDocument('students', body);
        return NextResponse.json({ id }, { status: 201 });
    } catch (error) {
        console.error('Error creating student:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...data } = body;
        await setDocument('students', id, data);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating student:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();
        await deleteDocument('students', id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting student:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

