import {
  format,
  parseISO,
  isValid,
  differenceInMonths,
  differenceInYears,
  differenceInDays,
} from "date-fns";

export const formatDate = (dateString) => {
  const date = parseISO(dateString);
  return isValid(date) ? format(date, "MMM yyyy") : "Present";
};

export function formatDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const years = differenceInYears(end, start);
  const months = differenceInMonths(end, start) % 12;
  const days = differenceInDays(end, start) % 30;

  let result = "";
  if (years > 0) result += `${years} year${years > 1 ? "s" : ""} `;
  if (months > 0)
    result += ` ${days >= 25 ? months + 1 : months} mo${months > 1 ? "s" : ""}`;

  return result.trim();
}
