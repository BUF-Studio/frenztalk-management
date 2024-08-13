import { jsPDF } from 'jspdf';
import { Invoice } from '../models/invoice';

const generatePDF = (invoice: Invoice) => {
  const doc = new jsPDF();

  // Add the title
  doc.setFontSize(20);
  doc.text('Invoice', 10, 10);

  // Add invoice details
  doc.setFontSize(12);
  doc.text(`Invoice ID: ${invoice.id}`, 10, 20);
  doc.text(`Tuition ID: ${invoice.tuitionId}`, 10, 30);
  doc.text(`Tutor ID: ${invoice.tutorId}`, 10, 40);
  doc.text(`Student ID: ${invoice.studentId}`, 10, 50);
  doc.text(`Subject ID: ${invoice.subjectId}`, 10, 60);
  doc.text(`Rate: ${invoice.currency} ${invoice.rate}`, 10, 70);
  doc.text(`Price: ${invoice.currency} ${invoice.price}`, 10, 80);
  doc.text(`Status: ${invoice.status}`, 10, 90);
  doc.text(`Start DateTime: ${invoice.startDateTime}`, 10, 100);
  doc.text(`Duration: ${invoice.duration} minutes`, 10, 110);
  doc.text(`Invoice Type: ${invoice.invoiceType}`, 10, 120);

  // Save the PDF
  doc.save(`invoice_${invoice.id}.pdf`);
};

export default generatePDF;
