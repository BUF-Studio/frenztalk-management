import { useInvoices } from '@/lib/context/invoiceContext';
import React from 'react';

const InvoiceList: React.FC = () => {
    const { invoices } = useInvoices
    ();


    return (
        <div>
            <h1>Invoice List</h1>
            <ul>
                {invoices.map((invoice) => (
                    <li key={invoice.invoiceId}>
                        {invoice.name} - Age: {invoice.age}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default InvoiceList