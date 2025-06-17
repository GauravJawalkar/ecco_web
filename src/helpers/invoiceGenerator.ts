import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateInvoice(orderItem: any, sellerName: string) {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();

    doc.setFontSize(20);
    doc.text("INVOICE", 14, 20);

    doc.setFontSize(12);
    doc.text(`Order ID: ${orderItem._id}`, 14, 30);
    doc.text(`Date: ${date}`, 14, 36);
    doc.text(`Seller: ${sellerName}`, 14, 42);
    doc.text(`Delivery Address: ${orderItem.deliveryAddress}`, 14, 48);
    doc.text(`Pincode: ${orderItem.pinCode}`, 14, 54);
    doc.text(`Landmark: ${orderItem.landMark}`, 14, 60);
    doc.text(`Payment Mode: ${orderItem.paymentMethod}`, 14, 66);
    doc.text(`Payment Status: ${orderItem.paymentStatus}`, 14, 72);

    const tableColumn = ["Product", "Qty", "Price (RS)", "Discount (RS)", "Total (RS)"];
    const priceAfterDiscount = orderItem.orderPrice - orderItem.orderDiscount;
    const total = priceAfterDiscount * orderItem.orderQuantity;

    const tableRows = [[
        orderItem.orderName,
        orderItem.orderQuantity,
        orderItem.orderPrice.toFixed(2),
        orderItem.orderDiscount.toFixed(2),
        total.toFixed(2)
    ]];

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 80,
        theme: "striped",
        styles: { halign: "center" },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        columnStyles: { 0: { halign: "left" } }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text(`Grand Total: Rs ${total.toFixed(2)}`, 14, finalY);

    doc.save(`Invoice-${orderItem._id}.pdf`);
}
