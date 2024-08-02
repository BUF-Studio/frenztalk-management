"use client";

import { useInvoices } from '@/lib/context/collection/invoiceContext';
import { useTuitions } from '@/lib/context/collection/tuitionContext';
import { useInvoicePage } from '@/lib/context/page/invoicePageContext';
import { useTuitionPage } from '@/lib/context/page/tuitionPageContext';
import { Invoice } from '@/lib/models/invoice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';



export default function TuitionDetail({ params }: { params: { id: string } }) {
    const { tuition, setTuition } = useTuitionPage();
    const { invoice, setInvoice } = useInvoicePage();
    const { tuitions } = useTuitions();
    const { invoices } = useInvoices();
    const router = useRouter();


    if (tuition === null || tuition.id !== params.id) {
        const foundTuition = tuitions.find(s => s.id === params.id);
        if (foundTuition)
            setTuition(foundTuition);
    }

    if (tuition === null) {
        return (
            <div>
                <h1>Tuition Not Found</h1>
                <Link href="/back/tuitions">
                    <button>Back to Tuition List</button>
                </Link>
            </div>
        );
    }

    const viewInvoice = (invoiceId: string) => {
        const invoice = invoices.find(inv => inv.id === invoiceId)
        setInvoice(invoice ?? null)
        router.push(`/back/invoices/${invoiceId}`)
    }



    return (
        <div>
            <Link href="/back/tuitions">
                <button>Back to Tuition List</button>
            </Link>

            <div>
                <h1>Tuition Details</h1>
                <p>Name: {tuition.name}</p>

                {tuition.invoiceId !== null && tuition.invoiceId !== undefined && (
                    <div>
                        <button onClick={(e) => { viewInvoice(tuition.invoiceId!) }}>View Invoice</button>
                    </div>
                )}
                <Link href={`/back/tuitions/${tuition.id}/edit`}>
                    <button>Edit</button>
                </Link>

            </div>


        </div>

    );
}