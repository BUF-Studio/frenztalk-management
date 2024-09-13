import { NextRequest, NextResponse } from 'next/server';
import { createDocument, deleteDocument, getCollection, getData, getPaginatedData, QueryFilter, SearchQuery, SortOption, updateDocument } from '@/lib/firebase/service/firebaseCRUD';
import { Subject } from '@/lib/models/subject';

const PATH = 'subjects'

export async function GET(request: NextRequest) {
    // const searchParams = request.nextUrl.searchParams;

    try {
        const result = await getCollection<Subject>(PATH);
        console.log(PATH)
        console.log(result)
        return NextResponse.json(result);

    } catch (error) {
        console.error('Error fetching subjects:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const id = await createDocument(PATH, body);
        return NextResponse.json({ id }, { status: 201 });
    } catch (error) {
        console.error('Error creating subject:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, ...data } = body;
        await updateDocument(PATH, id, data);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating subject:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();
        await deleteDocument(PATH, id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting subject:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

