import type { Invoice } from "@/lib/models/invoice";
import type { ScriptProps } from "next/script";
import { createContext, useContext, useState } from "react";

type InvoicePageContextType = {
  invoice: Invoice | null;
  setInvoice: (invoice: Invoice | null) => void;
};

const initialContext: InvoicePageContextType = {
  invoice: null,
  setInvoice: () => {},
};
// Create a context to hold the data
const InvoicePageContext = createContext<InvoicePageContextType>(initialContext);

export const useInvoicePage = () => useContext(InvoicePageContext);

function InvoicePageProvider({ children }: ScriptProps) {
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  return (
    <InvoicePageContext.Provider value={{ invoice, setInvoice }}>
      {children}
    </InvoicePageContext.Provider>
  );
}

export default InvoicePageProvider;
