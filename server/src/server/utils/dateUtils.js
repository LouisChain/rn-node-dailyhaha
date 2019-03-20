const compareToCurrentToHours = (str) => {
  let now = new Date();
  let utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  let myDate = new Date(str);
  let diff = now - myDate;// in milliseconds
  let totalHours = diff / 1000 / 60 / 60;

  return totalHours;
}

module.exports = {
  compareToCurrentToHours
}