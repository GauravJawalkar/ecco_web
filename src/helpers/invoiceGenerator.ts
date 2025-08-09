import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateInvoice(orderItem: any, sellerName: string) {
    // Create new PDF with measurements in mm (default)
    const doc: any = new jsPDF();

    // Set default font
    doc.setFont("helvetica");

    // Add logo/text at top left
    doc.setFontSize(18);
    doc.setTextColor(41, 128, 185); // Nice blue color
    doc.setFont("helvetica", "bold");
    doc.text("ECCO_WEB_INVOICE", 14, 20);
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(0.5);
    doc.line(14, 22, 60, 22); // Underline the logo

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Invoice title at top right
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 160, 20, { align: "right" });

    // Left Column - Seller Details
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Seller Details", 14, 40);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${sellerName}`, 14, 46);
    // Add more seller details here if available

    // Right Column - Customer Details
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Customer Details", 160, 40, { align: "right" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${orderItem.customerName || "Customer"}`, 160, 46, { align: "right" });
    doc.text(`Address: ${orderItem.deliveryAddress}`, 160, 52, { align: "right" });
    doc.text(`Pincode: ${orderItem.pinCode}`, 160, 58, { align: "right" });
    doc.text(`Landmark: ${orderItem.landMark}`, 160, 64, { align: "right" });

    // Invoice Details Below Seller Details
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Invoice Details", 14, 80);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice #: ${orderItem._id}`, 14, 86);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 92);
    doc.text(`Payment Method: ${orderItem.paymentMethod}`, 14, 98);
    doc.text(`Payment Status: ${orderItem.paymentStatus}`, 14, 104);

    // Add line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 110, 196, 110);

    // Table with order items
    const tableColumn = [
        { header: "Product", dataKey: "product" },
        { header: "Qty", dataKey: "quantity" },
        { header: "Price Rs", dataKey: "price" },
        { header: "Discount Rs", dataKey: "discount" },
        { header: "Total Rs", dataKey: "total" }
    ];

    const priceAfterDiscount = orderItem.orderPrice - orderItem.orderDiscount;
    const total = priceAfterDiscount * orderItem.orderQuantity;

    const tableData = [{
        product: orderItem.orderName,
        quantity: orderItem.orderQuantity,
        price: orderItem.orderPrice.toFixed(2),
        discount: orderItem.orderDiscount.toFixed(2),
        total: total.toFixed(2)
    }];

    autoTable(doc, {
        head: [tableColumn.map(col => col.header)],
        body: tableData.map(item => tableColumn.map(col => item[col.dataKey])),
        startY: 115,
        theme: "grid",
        headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: "bold",
            halign: "center"
        },
        columnStyles: {
            0: { cellWidth: 'auto', halign: 'left' },
            1: { cellWidth: 20, halign: 'center' },
            2: { cellWidth: 30, halign: 'right' },
            3: { cellWidth: 30, halign: 'right' },
            4: { cellWidth: 30, halign: 'right' }
        },
        margin: { left: 14, right: 14 },
        styles: { fontSize: 10 }
    });

    // Calculate final Y position after table
    const finalY = (doc as any).lastAutoTable.finalY + 15;

    // Total section with proper spacing
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");

    // Amount Due label
    doc.text("Amount Due:", 140, finalY);

    // Amount value (right-aligned with proper spacing)
    const amountText = `Rs ${total.toFixed(2)}`;
    const amountWidth = doc.getStringUnitWidth(amountText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    doc.text(amountText, 190 - amountWidth, finalY);



    // Footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for your business!", 105, 280, { align: "center" });
    doc.text("ECCO Web Services", 105, 285, { align: "center" });

    // Save the PDF
    doc.save(`Invoice_${orderItem._id}.pdf`);
}