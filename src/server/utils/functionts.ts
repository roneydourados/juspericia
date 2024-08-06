import moment from "moment";

export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export const difDaysDelay = (initialDate: string, finalDate: string) => {
  const initDate = moment(initialDate);
  const endDate = moment(finalDate);

  const days = endDate.diff(initDate, "days");
  return days < 0 ? 0 : days;
};
