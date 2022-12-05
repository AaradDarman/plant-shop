import dayjs from "dayjs";
import moment from "moment-jalaali";
moment.loadPersian({ dialect: "persian-modern" });

export const fromNow = (date) => {
  let d = moment(date);
  return d.fromNow();
};

export const getTimeOnly = (date) => {
  let inputDate = dayjs(date);
  return inputDate.format("HH:mm");
};

export const getPersianDate = (date) => {
  let time = dayjs(date);
  let m = moment(time.format("YYYY/MM/DD"), "YYYY/MM/DD");
  let dateString = m.format("jYYYY/jMM/jDD");
  return dateString;
};

export const getPersianDateWithMonthInLetters = (date) => {
  let time = dayjs(date);
  let td = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(time);
  return td;
};

export const addHoursToDate = (date, hours) => {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + hours);
  return newDate;
};

export const calculateExpireTime = (date) => {
  const expireDate = dayjs(date).add(1, "h");
  return expireDate.diff(dayjs(), "m");
};

export const getPersianDateWithTime = (date) => {
  let time = dayjs(date);
  let m = moment(time.format("YYYY/MM/DD HH:mm"), "YYYY/MM/DD HH:mm");
  let dateString = m.format("jYYYY/jMM/jDD HH:mm");
  return dateString;
};

export const getDateOnly = (date) => {
  let time = dayjs(date);
  let dateString = time.format("YYYY/MM/DD");
  return dateString;
};
