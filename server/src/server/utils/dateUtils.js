const compareToCurrentToHours = (str) => {
  let now = new Date();
  let utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  let myDateUtc = new Date(str);
  let diff = utcNow - myDateUtc;// in milliseconds
  let totalHours = diff / 1000 / 60 / 60;

  return totalHours;
}

module.exports = {
  compareToCurrentToHours
}