export const QuoteTemplate = (userName, trackId, pickUp, dropOff,cargoType,senderfullName) => {
  return   `
 <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice 1  - [Track ID]</title>
  <style>
    body {
      font-family: sans-serif;
      margin: 0;
      padding: 0;
      
    }
    .container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }
    
    .logo-text{
        font-size: 30px;
      } 
      .trackId{
        font-size: 30px;
      }
   
    .logo {
      height: 50px;
    }
    .invoice-details {
      border-collapse: collapse;
      width: 100%;
    }
    .invoice-details th,
    .invoice-details td {
      padding: 10px;
      border: 1px solid #ddd;
    }
    @media screen  and (max-width:700px) {
      header{
        // flex-direction: column;
      }
     .trackId{
        font-size: 20px;
      }
      .logo-text{
        font-size: 30px;
      }
    }
  </style>
</head>
<body style="
    height: 100vh;
    background: white-smoke;
">
  <div class="container">
    <header class="header" style="width:100%;background:black;padding:7px;height:">
     <div style="display:flex;align-items:center;justify-content:center;width:100%"> 
     <img  src="https://res.cloudinary.com/defbw7rt6/image/upload/v1763884844/logo5_lxyq7z.png" alt="Company Logo" class="logo">
     <!-- <span style="color:black" class="logo-text"><strong>Swiftfreight Solutions</strong></span> -->
     </div>
    </header>
    <h1 class="trackId">Invoice # [${trackId}]</h1>
    <p>This invoice is sent to: ${userName}</p>
    <p>From: ${senderfullName}</p>
    <h2>Delivery Details</h2>
    <table class="invoice-details">
      <tbody>
        <tr>
          <th>Pick Up Location</th>
          <td>${pickUp}</td>
        </tr>
        <tr>
          <th>Drop Off Location</th>
          <td>${dropOff}</td>
        </tr>
        <tr>
          <th>Cargo Type</th>
          <td>${cargoType}</td>
        </tr>
      </tbody>
    </table>
    <p>**Please note:** This is a computer-generated invoice and does not require a signature.</p>
  </div>
</body>
</html>
  `
 
};
