
import { AppProps } from "next/app";
import { ScriptProps } from "next/script";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Invoice } from "../../models/invoice";
import { invoicesStream } from "../../firebase/invoice";

type InvoicesContextType = {
  invoices: Invoice[];
};

const initialContext: InvoicesContextType = {
  invoices: [],
};
// Create a context to hold the data
const InvoicesContext = createContext<InvoicesContextType>(initialContext);

export const useInvoices = () => useContext(InvoicesContext);

function InvoicesProvider({ children }: ScriptProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Fetch data from Firebase and set up listeners
  useEffect(() => {
    const onUpdate = (invoices: Invoice[]) => {
      console.log(invoices)
      setInvoices(invoices)
    }
    const unsubscribe = invoicesStream(onUpdate)

    return () => unsubscribe();
  }, []);

  return (
    <InvoicesContext.Provider value={{ invoices }}>
      {children}
    </InvoicesContext.Provider>
  );
}

export default InvoicesProvider;