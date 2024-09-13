import { NextRequest, NextResponse } from 'next/server';
import { createDocument, deleteDocument, getData, getPaginatedData, updateDocument } from '@/lib/firebase/service/firebaseCRUD';
import { Tutor } from '@/lib/models/tutor';

const PATH = 'tutors'

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    if (id) {
        try {
            const result = await getData<Tutor>(PATH, id);
            return NextResponse.json(result);
        } catch (error) {
            console.error('Error fetching tutors:', error);
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }
    } else {
        const page = parseInt(searchParams.get('page') || '1', 10);
        const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

        try {
            const result = await getPaginatedData<Tutor>(PATH, page, pageSize);
            console.log('result')
            console.log(result)
            return NextResponse.json(result);
        } catch (error) {
            console.error('Error fetching tutors:', error);
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }
    }

}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const id = await createDocument(PATH, body);
        return NextResponse.json({ id }, { status: 201 });
    } catch (error) {
        console.error('Error creating tutor:', error);
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
        console.error('Error updating tutor:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();
        await deleteDocument(PATH, id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting tutor:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

