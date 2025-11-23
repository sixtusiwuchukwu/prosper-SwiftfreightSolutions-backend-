import * as fs from "fs";
import PDFDocument from "pdfkit";

class Invoice {
    async generateHeader(doc) {
        doc.image('logo.png', 50, 45, { width: 50 })
            .fillColor('#444444')
            .fontSize(20) 
            .text('6225 Lakeside Ave.', 200, 65, { align: 'right' })
            .text('Richmond, VA 23228', 200, 80, { align: 'right' })
            .moveDown();
    }
    
    async generateFooter(doc) {
        doc.fontSize(
            10,
        ).text(
            'copyright@swiftDistribution.delivery',
            50,
            780,
            { align: 'center', width: 500 },
        );
    }
 async generateCustomerInformation(doc, invoice) {

	doc.text(`Quote ID: ${invoice.trackId}`, 50, 200)
		.text(`Invoice Date: ${new Date()}`, 50, 215)
		.text(`Cargo Type: ${invoice.cargoType}`, 50, 130)

		.text(invoice.user, 300, 200)
		.text(invoice.pickUp, 300, 215)
		.text(invoice.dropOff, 300, 215)
		.moveDown();
}
async createInvoice(invoice, path) {
    let doc = new PDFDocument({ size: "A4", margin: 50 });
  
      this.generateHeader(doc);
    this.generateCustomerInformation(doc, invoice);
    // generateInvoiceTable(doc, invoice);
    this.generateFooter(doc);
  
    doc.end();
    doc.pipe(fs.createWriteStream("invoice.pdf"));
  }
}
export default new Invoice()