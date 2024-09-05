export const timeString = (timestamp) => {
  if (typeof timestamp === 'string') timestamp = Number.parseInt(timestamp);
  const date = new Date(timestamp);

  // Get the year, month, day, hours, minutes, and seconds
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Construct the formatted date and time string
  const dateTimeString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  return dateTimeString;
};

export const datetime = (timestamp) => {
  if (typeof timestamp === 'string') timestamp = Number.parseInt(timestamp);
  const date = new Date(timestamp);

  // Get the year, month, day, hours, minutes, and seconds
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // Construct the formatted date and time string
  const dateString = `${day}/${month}/${year}`;
  const timeString = `${hours}:${minutes}`;
  return [dateString, timeString];
};

export const formatDate = (date) => {
  let dobYear = date.getFullYear();
  let dobMonth = date.getMonth() + 1;
  let dobDate = date.getDate();
  if (dobMonth < 10) dobMonth = '0' + dobMonth;
  if (dobDate < 10) dobDate = '0' + dobDate;
  return `${dobDate}-${dobMonth}-${dobYear}`;
};
export const formatDate2Object = (date) => {
  let dateArray = date.split('-');
  let dobYear = dateArray[2];
  let dobMonth = dateArray[1] - 1;
  let dobDate = dateArray[0];
  return new Date(dobYear, dobMonth, dobDate);
};
