class Invoice {
    async generateHeader(doc) {
        doc.image('logo.png', 50, 45, { width: 50 })
            .fillColor('#444444')
            .fontSize(20)
            .text('ACME Inc.', 110, 57)
            .fontSize(10)
            .text('123 Main Street', 200, 65, { align: 'right' })
            .text('New York, NY, 10025', 200, 80, { align: 'right' })
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
	const shipping = invoice.shipping;

	doc.text(`Invoice Number: ${invoice.invoice_nr}`, 50, 200)
		.text(`Invoice Date: ${new Date()}`, 50, 215)
		.text(`Balance Due: ${invoice.subtotal - invoice.paid}`, 50, 130)

		.text(shipping.name, 300, 200)
		.text(shipping.address, 300, 215)
		.text(
			`${shipping.city}, ${shipping.state}, ${shipping.country}`,
			300,
			130,
		)
		.moveDown();
}
}