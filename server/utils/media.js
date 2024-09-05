exports.genQRCode = async (string) => {
  const QRCode = require('qrcode');
  const timestamp = Date.now();
  const filename = `media/${timestamp}.png`;
  await QRCode.toFile(filename, !string ? 'Demo text' : string, {
    errorCorrectionLevel: 'H'
  });
  return filename;
}

exports.createPdf = async (data, filename=null) => {
  const pdf = require("pdf-creator-node");
  const fs = require("fs");

  // Read HTML Template
  const html = fs.readFileSync("media/template.html", "utf8");
  const pdfOptions = {
    format: "A4",
    orientation: "portrait",
    border: "10mm",
    childProcessOptions: { env: { OPENSSL_CONF: '/dev/null' } }
  };
  const timestamp = Date.now();
  if (filename === null)
    filename = `media/${timestamp}.pdf`;
  const document = {
    html: html,
    data: data,
    path: filename,
    type: "",
    childProcessOptions: {
      env: {
        OPENSSL_CONF: '/dev/null',
      },
    }
  };

  await pdf.create(document, pdfOptions);
  return filename;
}

exports.genSmsMessage = ({ rid, created, patientName, patientBirthday }) => {
  let message = `Hi, ${patientName}. Your prescription is ready now.\n`;
  message += `Created: ${created}\n`;
  message += `Prescription ID: ${rid}\n`;
  message += `Display prescription at rx-link.co.uk/verify/${rid}/${patientBirthday} to your pharmacist.`;
  return message;
}