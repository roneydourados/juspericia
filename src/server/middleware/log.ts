import dayjs from "dayjs";

export default defineEventHandler((event) => {
  console.log("Date: " + dayjs().format("DD/MM/YYYY HH:mm:ss"));
  console.log("route: " + getRequestURL(event));
  console.log("Method: " + event.method);
});
