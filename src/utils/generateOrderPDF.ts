import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface OrderItem {
  product: {
    name: string;
    price: number;
  };
  quantity: number;
}

interface ShippingDetails {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phoneNumber: string;
}

export const generateOrderPDF = (
  orderId: string,
  items: OrderItem[],
  shippingDetails: ShippingDetails,
  total: number
) => {
  const doc = new jsPDF();

  // Add header
  doc.setFontSize(20);
  doc.text('Order Summary', 14, 20);

  // Add order ID
  doc.setFontSize(12);
  doc.text(`Order ID: ${orderId}`, 14, 30);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 37);

  // Add shipping details
  doc.setFontSize(14);
  doc.text('Shipping Details', 14, 47);
  doc.setFontSize(10);
  doc.text([
    `${shippingDetails.firstName} ${shippingDetails.lastName}`,
    shippingDetails.address,
    `${shippingDetails.city}, ${shippingDetails.country} ${shippingDetails.postalCode}`,
    `Phone: ${shippingDetails.phoneNumber}`,
    `Email: ${shippingDetails.email}`,
  ], 14, 57);

  // Add items table
  const tableData = items.map(item => [
    item.product.name,
    item.quantity.toString(),
    `$${Number(item.product.price).toFixed(2)}`,
    `$${(Number(item.product.price) * item.quantity).toFixed(2)}`
  ]);

  autoTable(doc, {
    startY: 85,
    head: [['Product', 'Quantity', 'Price', 'Total']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [66, 139, 202] },
  });

  // Add total
  const finalY = (doc as any).lastAutoTable.finalY || 120;
  doc.setFontSize(12);
  doc.text('Subtotal:', 140, finalY + 10);
  doc.text(`$${Number(total).toFixed(2)}`, 170, finalY + 10);
  doc.text('Shipping:', 140, finalY + 17);
  doc.text('Free', 170, finalY + 17);
  doc.setFontSize(14);
  doc.text('Total:', 140, finalY + 25);
  doc.text(`$${Number(total).toFixed(2)}`, 170, finalY + 25);

  // Add footer
  doc.setFontSize(10);
  doc.text('Thank you for shopping with Astro E-commerce!', 14, finalY + 35);

  // Save the PDF
  doc.save(`order-${orderId}.pdf`);
}; 