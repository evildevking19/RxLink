const crypto = require('crypto');

exports.genRID = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const randomString = Array.from(crypto.randomFillSync(new Uint8Array(8)))
    .map((byte) => characters[byte % characters.length])
    .join('');

  return 'RXL' + randomString;
}

exports.verifyCode = () => {
  const characters = '0123456789';
  const randomString = Array.from(crypto.randomFillSync(new Uint8Array(5)))
    .map((byte) => characters[byte % characters.length])
    .join('');

  return randomString;
}

exports.timeString = (timestamp) => {

  const date = new Date(Number.parseInt(timestamp));
  // Get the year, month, day, hours, minutes, and seconds
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
  const day = String(date.getDate()).padStart(2, '0');

  // Construct the formatted date and time string
  const dateTimeString = `${day}-${month}-${year}`;

  return dateTimeString;
}
