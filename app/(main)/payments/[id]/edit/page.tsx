"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useInvoicePage } from '@/lib/context/page/invoicePageContext';
import { useInvoices } from '@/lib/context/collection/invoiceContext';
import InvoiceForm from '../paymentForm';

export default function EditInvoice({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { invoice, setInvoice } = useInvoicePage();
  const { invoices } = useInvoices();

  if (invoice === null || invoice.id !== params.id) {

    const foundInvoice = invoices.find(s => s.id === params.id);
    if (foundInvoice)
      setInvoice(foundInvoice);
  }


  if (invoice === null) {
    return (
      <div>
        <h1>Invoice Not Found</h1>
        
          <button onClick={(e)=>{router.back()}}>Back</button>
        
      </div>
    );
  }


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    router.back();
  };

  return (
    <div className="edit-page">
      <h2>Edit Invoice</h2>
      <InvoiceForm></InvoiceForm>
      
    </div>
  );
}