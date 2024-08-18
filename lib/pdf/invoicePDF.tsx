import type React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import type { Invoice } from "../models/invoice";

// Create styles
const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { margin: 10, padding: 10 },
  heading: { fontSize: 18, marginBottom: 18 },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 5,
    marginBottom: 5,
  },
  column: { flex: 1 },
  label: { fontSize: 10, color: "#666" },
  value: { fontSize: 12 },
});

type InvoicePDFProps = {
  invoice: Invoice | null;
};

// Create Document Component
const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice }) => {
  if (!invoice) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text>No invoice data available.</Text>
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>Invoice</Text>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Billing From:</Text>
              <Text style={styles.value}>
                {/* {invoiceData.billingFrom.name} */}
                FRENZTALK
              </Text>
              <Text style={styles.value}>
                {/* {invoiceData.billingFrom.email} */}
                frenztalk@gmail.com
              </Text>
              <Text style={styles.value}>
                No. 8, Jalan Abdul Rahman, Bandar Sungai Long, 43000 Kajang,
                Selangor.
                {/* {invoiceData.billingFrom.address} */}
              </Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Billing To:</Text>
              <Text style={styles.value}>
                {/* {invoiceData.billingTo.name} */}
                ANG ZHI HENG
              </Text>
              <Text style={styles.value}>
                {/* {invoiceData.billingTo.email} */}
                zhiheng426@gmail.com
              </Text>
              <Text style={styles.value}>
                {/* {invoiceData.billingTo.address} */}
                No. 8, Jalan Abdul Rahman, Bandar Sungai Long, 43000 Kajang,
                Selangor.
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Invoice ID:</Text>
              <Text style={styles.value}>{invoice.id}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Date Issued:</Text>
              <Text style={styles.value}>
                {/* {invoiceData.dateIssued} */}
                12 Aug 2024
              </Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Due Date:</Text>
              <Text style={styles.value}>
                {/* {invoiceData.dueDate} */}
                12 Sep 2024
              </Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Due Amount:</Text>
              <Text style={styles.value}>
                ${/* {invoiceData.dueAmount} */}
                200.00
              </Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={[styles.column, styles.label]}>Brand name</Text>
            <Text style={[styles.column, styles.label]}>Description</Text>
            <Text style={[styles.column, styles.label]}>Quantity</Text>
            <Text style={[styles.column, styles.label]}>Price Per Unit</Text>
            <Text style={[styles.column, styles.label]}>Total</Text>
          </View>

          {/* {invoice.items.map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.column}>{item.brand}</Text>
              <Text style={styles.column}>{item.description}</Text>
              <Text style={styles.column}>{item.quantity}</Text>
              <Text style={styles.column}>${item.pricePerUnit}</Text>
              <Text style={styles.column}>${item.total}</Text>
            </View>
          ))} */}
          <View style={styles.row}>
            <Text style={styles.column}>Samsung</Text>
            <Text style={styles.column}>Build your dream</Text>
            <Text style={styles.column}>1</Text>
            <Text style={styles.column}>$200.00</Text>
            <Text style={styles.column}>$200.00</Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.column, { textAlign: "right" }]}>
              Subtotal:
            </Text>
            <Text style={styles.column}>
              ${/* {invoiceData.subtotal} */}
              200.00
            </Text>
          </View>
          {/* <View style={styles.row}>
            <Text style={[styles.column, { textAlign: "right" }]}>
              Shipping Cost:
            </Text>
            <Text style={styles.column}>${invoiceData.shippingCost}</Text>
          </View> */}
          <View style={styles.row}>
            <Text style={[styles.column, { textAlign: "right" }]}>
              Coupon Discount:
            </Text>
            <Text style={styles.column}>
              -$
              {/* {invoiceData.couponDiscount} */}
              0.00
            </Text>
          </View>
          {/* <View style={styles.row}>
            <Text style={[styles.column, { textAlign: "right" }]}>VAT:</Text>
            <Text style={styles.column}>${invoiceData.vat}</Text>
          </View> */}
          <View style={styles.row}>
            <Text
              style={[
                styles.column,
                { textAlign: "right", fontWeight: "bold" },
              ]}
            >
              Total:
            </Text>
            <Text style={[styles.column, { fontWeight: "bold" }]}>
              {/* ${invoiceData.total} */}$ 200.00
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
