import * as fs from "fs";
import PDFDocument from "pdfkit";
import nodeMailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
class Invoice {
  async generateHeader(doc) {
    
    doc
      .image("logo.png", 50, 45, { width: 170 })
      .fillColor("#444444")
      .fontSize(20)
      .text("6225 Lakeside Ave.", 200, 100, { align: "right" })
      .text("Richmond, VA 23228", 200, 80, { align: "right" })
      .moveDown();
  }

  async generateFooter(doc) {
    doc
      .fontSize(10)
      .text("copyright@swiftDistribution.delivery", 50, 780, {
        align: "center",
        width: 500,
      });
  }
  async generateCustomerInformation(doc, invoice) {
    doc
      .text(`Quote ID: ${invoice.trackId}`, 50, 180)
      .text(
        `Invoice Date: ${new Date().toLocaleString().slice(0, 10)}`,
        50,
        215
      )
      .text(`Cargo Type: ${invoice.cargoType}`, 50, 250)

      .text(invoice.email.split("@")[0], 300, 180)
      .text(invoice.pickUp, 300, 215)
      .text(invoice.dropOff, 300, 250)
      .moveDown();
  }
  async createInvoice(invoice, template) {
    let doc = new PDFDocument({ size: "A4", margin: 50 });

    this.generateHeader(doc);
    this.generateCustomerInformation(doc, invoice);
    // generateInvoiceTable(doc, invoice);
    this.generateFooter(doc);

    doc.end();
    doc.pipe(fs.createWriteStream("invoice.pdf"));
    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    // doc.on("end", async () => {
    //   let pdfData = Buffer.concat(buffers);
    //   let transporter = nodeMailer.createTransport(
    //     smtpTransport({
    //       host: process.env.MAIL_HOST,
    //       secureConnection: false,
    //       tls: {
    //         rejectUnauthorized: false,
    //       },
    //       port: 465,
    //       auth: {
    //         user: process.env.MAIL_EMAIL,
    //         pass: process.env.MAIL_PASSWORD,
    //       },
    //     })
    //   );
    //   await new Promise((resolve, reject) => {
    //     // verify connection configuration
    //     transporter.verify(function (error, success) {
    //       if (error) {
    //         console.log(error);
    //         reject(error);
    //       } else {
    //         console.log("Server is ready to take our messages");
    //         resolve(success);
    //       }
    //     });
    //   });

    //   await new Promise((resolve, reject) => {
    //     // send mail with defined transport object
    //     transporter.sendMail(
    //       {
    //         from: `SWIFT DISTRIBUTION<${"quote@swiftdistribution.delivery"}>`, // sender address
    //         to: invoice.email, // list of receivers
    //         subject: "NEW ORDER", // Subject line
    //         html: template,
    //         attachments: [
    //           {
    //             filename: "quote.pdf",
    //             content: pdfData,
    //           },
    //         ],
    //       },
    //       function (error, info) {
    //         if (error) {
    //           console.error(error);
    //           reject(err);
    //         } else {
    //           console.log(`Sent -> ${info.response}`);
    //           resolve(info);
    //         }

    //         //   res.send("sucess");
    //         //   return `${info} Email sent successfully`;
    //       }
    //     );
    //   });
    // });

    //Finalize document and convert to buffer array
  }
}
export default new Invoice();
