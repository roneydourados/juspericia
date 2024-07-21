export default defineEventHandler(async (event) => {
  console.log("route: " + getRequestURL(event));
  console.log("Method: " + event.method);
});
