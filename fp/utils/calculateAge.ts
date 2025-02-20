export function calculateAge(DOB: string) {
  const [month, day, year] = DOB.split("/");
  const isoDate: string = `${year}-${month.padStart(2, "0")}-${day.padStart(
    2,
    "0"
  )}`;
  const birthday: Date = new Date(isoDate);
  const today: Date = new Date();

  const msDifference: number = today.getTime() - birthday.getTime();
  const age: number = Math.floor(msDifference / 31557600000);
  return age;
}
