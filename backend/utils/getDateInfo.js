

export const getDateDetails = (date) => {
  if (!date) {
    console.error("Invalid date: No date provided.");
    return null;
  }

  if (!/^\d{2}-\d{2}-\d{4}$/.test(date)) {
    console.error("Invalid date format: Expected DD-MM-YYYY.");
    return null;
  }

  const [day, month, year] = date.split("-").map(Number);

  const givenDateUTC = new Date(Date.UTC(year, month - 1, day));
  const givenDateIST = new Date(givenDateUTC.getTime() + 5.5 * 60 * 60 * 1000); 
  givenDateIST.setHours(0, 0, 0, 0);

  const nowUTC = new Date();
  const nowIST = new Date(nowUTC.getTime() + 5.5 * 60 * 60 * 1000); 
  nowIST.setHours(0, 0, 0, 0); 

  const differenceInDays = (nowIST - givenDateIST) / (24 * 60 * 60 * 1000);

  if (differenceInDays === 0) return 0;
  if (differenceInDays === 1) return 1; 
  if (differenceInDays === 2) return 2;

  if (differenceInDays > 2) {
    console.warn("Date is too old.");
    return null;
  }
  if (differenceInDays < 0) {
    console.warn("Date is in the future.");
    return null;
  }

  return null; 
};
