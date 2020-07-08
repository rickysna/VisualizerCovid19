import { DateDiffer } from "../models/Date";

export function formatNumber(num: number) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function dateDiffer(previous: Date):DateDiffer {
  const current = new Date();

  // @ts-ignore
  const totalSeconds = (current - previous) / 1000;
  const days = Math.floor(totalSeconds / 3600 / 24);
  let restSeconds = totalSeconds - days * 24 * 3600;
  const hours = Math.floor(restSeconds / 3600);
  restSeconds -= hours * 3600;
  const minutes = Math.floor(restSeconds / 60);
  const seconds = Math.floor(restSeconds - minutes * 60);

  return {
    days, hours, minutes, seconds,
  };
}

export function convertDateToString(date: DateDiffer):string {
  if (date.days > 0) {
    const unit = date.days > 1 ? "days" : "day";
    return `${date.days} ${unit} ago`;
  } if (date.hours > 0) {
    const unit = date.hours > 1 ? "hours" : "hour";
    return `${date.hours} ${unit} ago`;
  } if (date.seconds > 0) {
    const unit = date.seconds > 1 ? "seconds" : "second";
    return `just ${date.seconds} ${unit} ago`;
  }
  return "";
}
