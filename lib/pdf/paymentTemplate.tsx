'use client'

import { useEffect, useState } from "react"
import html2pdf from "html2pdf.js"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { Download } from "lucide-react"
import { useStudents } from "@/lib/context/collection/studentsContext"
import { useSubjects } from "@/lib/context/collection/subjectContext"
import { useTuitions } from "@/lib/context/collection/tuitionContext"
import { InvoiceStatus } from "@/lib/models/invoiceStatus"
import { capitalizeFirstLetter } from "@/lib/utils"
import { Payment } from "@/lib/models/payment"
import { updatePayment } from "@/lib/firebase/payment"
import { toast } from "@/app/components/hooks/use-toast";

interface PaymentTemplateProps {
  initialPayment: Payment | null
}

export default function PaymentTemplate({ initialPayment }: PaymentTemplateProps) {
  const [payment, setPayment] = useState<Payment | null>(initialPayment)
  const [logoLoaded, setLogoLoaded] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.onload = () => setLogoLoaded(true)
    img.src = "/frenztalk-logo.jpg"
  }, [])

  const generatePDF = () => {
    const element = document.getElementById("payment")
    if (element) {
      const opt = {
        margin: 10,
        filename: "payment.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      }
      html2pdf().set(opt).from(element).save()
    }
  }

  function getStatusVariant(
    status: string | undefined
  ): "default" | "secondary" | "destructive" | "outline" | undefined {
    if (!status) {
      return "destructive"
    }

    switch (status.toLowerCase()) {
      case InvoiceStatus.PAID:
        return "outline"
      case InvoiceStatus.PENDING:
        return "default"
      default:
        return "destructive"
    }
  }

  const handleStatusChange = async (status: InvoiceStatus) => {
    if (!payment) return

    try {
      const updatedPayment = new Payment(
        payment.id,
        payment.tuitionId,
        payment.tutorId,
        payment.studentId,
        payment.subjectId,
        payment.rate,
        status,
        payment.startDateTime,
        payment.duration,
        payment.currency,
        payment.price
      )
      await updatePayment(updatedPayment)
      setPayment(updatedPayment) // Update the local state
      toast({
        title: "Status Updated Successfully",
        description: `Payment status has been updated to ${status}`,
      })
    } catch (error) {
      console.error("Error updating payment status:", error)
      toast({
        title: "Error Updating Status",
        description: "An error occurred while updating the status.",
        variant: "destructive",
      })
    }
  }

  if (!payment) {
    return <div className="text-center p-4">No payment data available</div>
  }

  return (
    <div
      id="payment"
      className="font-sans min-w-[768px] max-w-[768px] mx-auto p-6 bg-background text-foreground"
    >
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex items-center mb-4 gap-4">
            <div className="w-8 h-8">
              {logoLoaded && (
                <img
                src="/frenztalk-logo.jpg"
                alt="Frenztalk Logo"
                width={32}
                height={32}
                className="object-contain"
              />
              )}
            </div>
            <h2 className="text-lg font-medium text-primary">
              Payment Statement
            </h2>
          </div>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{payment.id}</h2>
              <Badge variant={getStatusVariant(payment.status)}>
                {capitalizeFirstLetter(payment.status)}
              </Badge>
            </div>
            <div className="flex gap-2" data-html2canvas-ignore>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Change Status</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {Object.values(InvoiceStatus)
                    .filter((status) => status !== payment.status)
                    .map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => handleStatusChange(status)}
                      >
                        {capitalizeFirstLetter(status)}
                      </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" onClick={generatePDF}>
                Download
                <Download className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
        {/* Rest of the component remains the same */}
        {/* ... */}
      </div>
    </div>
  )
}