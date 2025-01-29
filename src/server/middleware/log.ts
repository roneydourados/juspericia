import moment from "moment";

export default defineEventHandler((event) => {
  console.log("Date: " + moment().format("DD/MM/YYYY HH:mm:ss"));
  console.log("route: " + getRequestURL(event));
  console.log("Method: " + event.method);
});
