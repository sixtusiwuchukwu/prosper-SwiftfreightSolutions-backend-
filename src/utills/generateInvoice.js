// Function to load logo image data (call before creating invoice)

// ... other methods for customer information, footer, etc. (unchanged)

import * as fs from "fs";
import pdf from "html-pdf-node";
import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";

// Load logo image data asynchronously
async function loadLogo() {
  try {
    return await fs.promises.readFile("logo.png");
  } catch (error) {
    console.error("Error reading logo image:", error);
    return null;
  }
}

class Invoice {
  async generateHeader(doc) {
    const imageData = await loadLogo();
    if (imageData) {
      const { width, height } = await doc.getImageDimensions(imageData);
      const aspectRatio = width / height;

      // Adjust logo size and position
      const logoWidth = 150;
      const logoHeight = logoWidth / aspectRatio;
      const logoX = (doc.page.width - logoWidth) / 2;
      const logoY = 50;

      // Add logo as background watermark with reduced opacity
      doc.opacity(0.2);
      doc.image(imageData, logoX, logoY, {
        width: logoWidth,
        height: logoHeight,
      });
      doc.opacity(1);
    }

    // Add other header elements, e.g., company name, address, etc.
    doc
      .fillColor("#444444")
      .fontSize(20)
      .text("Your Company Name", 50, 50)
      .text("Your Company Address", 50, 70)
      .text("Your Company Phone", 50, 90)
      .text("Your Company Email", 50, 110)
      .moveDown();
  }

  async generateCustomerInformation(doc, invoice) {
    doc
      .fontSize(12)
      .text(`Invoice ID: ${invoice.id}`, 50, 150)
      .text(`Invoice Date: ${new Date().toLocaleDateString()}`, 50, 170)
      .text(`Customer Name: ${invoice.customerName}`, 50, 190)
      .text(`Customer Address: ${invoice.customerAddress}`, 50, 210)
      .moveDown();
  }

  async generateInvoiceTable(doc, invoice) {
    // ... generate invoice table with items, quantities, prices, and total
    doc.fontSize(10);
    doc.text("Track ID", 50, 250);
    doc.text("Pick Up", 200, 250);
    doc.text("Drop Off", 350, 250);
    doc.text("Cargo Type", 450, 250);

    invoice.items.forEach((item, index) => {
      doc.text(item.trackId, 50, 270 + index * 20);
      doc.text(item.pickUp, 200, 270 + index * 20);
      doc.text(item.dropOff, 350, 270 + index * 20);
      doc.text(item.cargoType, 450, 270 + index * 20);
    });

    // Calculate and display total
    // const total = invoice.items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    // doc.fontSize(12);
    // doc.text(`Total: $${total.toFixed(2)}`, 350, 350);
  }
  formatDate(dateString) {
    const date = new Date(dateString);

    const options = { month: "long", day: "numeric", year: "numeric" };
    let formattedDate = date.toLocaleDateString("en-US", options);
    return formattedDate;
  }

  async generateFooter(doc) {
    doc
      .fontSize(10)
      .text("Thank you for your business!", 50, 750, { align: "center" })
      .text("Copyright © Your Company", 50, 780, { align: "center" });
  }
  async createInvoice(data, trackId) {
    // const { userName, senderFullName, pickUp, dropOff, cargoType } = data;
    const {
      createdAt,
      senderfullName,
      arrivalDate,
      senderEmail,
      senderPhone,
      senderAddress,
      senderCity,
      senderState,
      senderCountry,
      senderZipCode,
      receiverfullName,
      receiverEmail,
      receiverPhone,
      receiverAddress,
      receiverCity,
      receiverState,
      receiverCountry,
      receiverZipCode,
      mode,
      description,
      pickUp,
      dropOff,
      quantity,
      weight,
    } = data;

   const image = "https://res.cloudinary.com/defbw7rt6/image/upload/v1763884844/logo5_lxyq7z.png";
    const html = 
    `<!DOCTYPE html>
<html>
<head>
<title>Cargo Receipt</title>
<style>
body {
font-family: sans-serif;
}

.container {
width: 800px;
margin: 0 auto;
border: 1px solid #ccc;
padding: 20px;
/* background-color: #f8f8f8;  */
background-color: #bcad8c25; 
/* background-color: #BCAD8C;  */
position: relative;
}

.header {
text-align: center;
margin-bottom: 20px;
}

.logo {
max-width: 200px;
}

.section {
margin-bottom: 20px;
padding: 15px; /* Add padding to sections */
border: 1px solid #ddd; /* Add a light border */
border-radius: 5px; 
}

.section-title {
font-weight: bold;
margin-bottom: 5px;
}

.details-container {
display: flex;
flex-wrap: wrap;
}

.details-container > div {
flex: 1;
margin-right: 20px; 
}

.stamp {
position: absolute;
font-size: 18px;
color: #fff;
padding: 5px 10px;
border-radius: 5px;
}

.stamp.paid {
background-color: #28a745; /* Green */
}

.stamp.received {
background-color: #007bff; /* Blue */
}

.stamp.delivered {
background-color: #ffc107; /* Yellow */
}

.stamp.rejected {
background-color: #dc3545; /* Red */
}

.signature-row {
margin-top: 20px;
display: flex;
justify-content: flex-end; 
}

.signature-row p {
margin-bottom: 5px;
margin-right: 10px; /* Add margin to the right of the label */
}


/* .watermark {
position: absolute;
top: 20%;
left: 30%;
bottom: 100px;
width: 100%;
height: 70%;
background-image: url(${image}); 
background-repeat: no-repeat;
background-size: 70%; 
opacity: 0.2;
transform: rotate(-45deg); 
} */
.footer {
text-align: center;
margin-top: 20px;
border-top: 1px solid #ccc;
padding-top: 10px;
}
</style>
</head>
<body>

<div class="container">
 
<div class="header" style="background-color: grey;padding-top: 10px;">
    <h1>Cargo Receipt</h1>
    <img src=${image} alt="Company Logo" class="logo"> 
  </div>
  


<div class="section"> 
<div class="section-title">Receipt Details:</div>
<div class="details-container">
  <div>
    <p><strong>Receipt No:</strong> ${trackId}</p>
    <p><strong>Date of issue:</strong>${this.formatDate(createdAt)}</p>

  </div>
  <div>
    <p><strong>Arrival Date:</strong>${this.formatDate(arrivalDate)}</p>  
  </div>
</div>
</div>

<div class="section"> 
<div class="section-title">From (<i>Sender Information</i>):</div>
<div class="details-container">
  <div>
    <p><strong>Name:</strong> ${senderfullName}</p>
    <p><strong>Address:</strong> ${senderAddress}</p>
    <p><strong>City:</strong> ${senderCity}</p>
    <p><strong>Email:</strong> ${senderEmail}</p>
  </div>
  <div>
    <p><strong>Phone:</strong> ${senderPhone}</p>
    <p><strong>state/province:</strong> ${senderState}</p>
    <p><strong>country:</strong> ${senderCountry}</p>
    <p><strong>ZipCode:</strong> ${senderZipCode}</p>
  </div>
</div>
</div>

<div class="section"> 
<div class="section-title">To (<i>Receiver Information</i>):</div>
<div class="details-container">
  <div>
    <p><strong>Name:</strong> ${receiverfullName}</p>
    <p><strong>Address:</strong> ${receiverAddress}</p>
    <p><strong>City:</strong> ${receiverCity}</p>
    <p><strong>Email:</strong> ${receiverEmail}</p>

  </div>
  <div>
    <p><strong>Phone:</strong> ${receiverPhone}</p>
    <p><strong>state/province:</strong> ${receiverState}</p>
    <p><strong>country:</strong> ${receiverCountry}</p>
    <p><strong>ZipCode:</strong> ${receiverZipCode}</p>
  </div>
</div>
</div>

<div class="section"> 
<div class="section-title">Cargo Details</div>
<div class="details-container">
  <div>
    <p><strong>Cargo Type:</strong> ${mode}</p>
    <p><strong>Description:</strong> ${description}</p>
    <p><strong>Quantity:</strong> ${quantity}</p>
  </div>
  <div>
    <p><strong>Weight:</strong> ${weight} kg</p>
    <p><strong>Drop-off:</strong> ${dropOff}</p>
    <p><strong>Pick-up:</strong> ${pickUp}</p>
  </div>
</div>
</div>



<div class="signature-row">
<p><strong>MGT:</strong></p>
<img src=${image} alt="Sender Signature" style="width: 150px;"> 
</div>
<div class="footer">
<p>© ${new Date().getFullYear()} SwiftfreightSolutions. All rights reserved.</p>

</div>
</div>

</body>
</html>`;

    let file = { content: html };

    const options = {
      format: "A4",
      orientation: "portrait",
       printBackground: true,
       timeout: 0,
      waitUntil: "domcontentloaded" 

    };

    let pdfData = await pdf.generatePdf(file, options);
    return pdfData;
  }

  async sendInvoiceByEmail(template, invoice) {
    // console.log("from line 30 genInvoice:", invoice);
    const pdfData = await this.createInvoice({ ...invoice }, invoice.trackId);
      console.log(
        "env",
        process.env.MAIL_HOST,
        process.env.MAIL_EMAIL,
        process.env.MAIL_PASSWORD
      );

    // fs.writeFileSync(`invoice_test_${invoice.trackId}.pdf`, pdfData);

   let transporter = nodemailer.createTransport({
   host: "smtp.hostinger.com",
  port: 465,
  secure: true, 
  auth: {
    user: process.env.MAIL_EMAIL,
    pass: "Ceceluv1$",
  },
  tls: {
    rejectUnauthorized: true
  }
});

    await new Promise((resolve, reject) => {
      // verify connection configuration
      transporter.verify(function (error, success) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log("Server is ready to take our messages");
          resolve(success);
        }
      });
    });

    const mailOptions = {
      from: `SwiftFreightSolutions<${"quote@SwiftfreightSolutions.ltd"}>`,
      to: invoice?.receiverEmail,
      subject: `Invoice #${invoice.trackId}`,
      html: template,
      attachments: [
        {
          filename: `invoice_${invoice.trackId}.pdf`,
          content: pdfData,
          contentType: "application/pdf",
        },
      ],
    };
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          reject(error);
          // Handle error, e.g., retry, log, or notify the user
        } else {
          console.log("Email sent:", info.response);
          resolve(info);
        }
      });
    });
    // throw new error();
  }

  async sendEmail(body, email, subject) {
    let transporter = nodemailer.createTransport(
      smtpTransport({
        host: process.env.MAIL_HOST,
          port: 587,
          secure: false, 
        // port: 465,
        tls: {
          rejectUnauthorized: false,
        },
       
        auth: {
          user: process.env.MAIL_EMAIL,
          pass: process.env.MAIL_PASSWORD,
        },
      })
    );

    await new Promise((resolve, reject) => {
      // verify connection configuration
      transporter.verify(function (error, success) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log("Server is ready to take our messages");
          resolve(success);
        }
      });
    });

    const mailOptions = {
      from: `SwiftFreightSolutions<${"quote@SwiftfreightSolutions.ltd"}>`,
      to: email,
      subject,
      html: body,
      attachments: [
        {
          filename: 'invoice.pdf',
          content: pdfData
        }
      ]
    };
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          reject(error);
          // Handle error, e.g., retry, log, or notify the user
        } else {
          console.log("Email sent:", info.response);
          resolve(info);
        }
      });
    });
  }
}

// Usage:
const invoice = new Invoice();
export default invoice;
