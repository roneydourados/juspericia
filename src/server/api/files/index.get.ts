// import { list } from "./repository/fileRepository";

// export default defineEventHandler(async (event) => {
//   const { ownerId, fileCategory } = getQuery(event);

//   const { userLogged } = useAuthUser();
//   const user = userLogged(event);

//   setResponseStatus(event, 200);

//   return list({
//     ownerId: Number(ownerId),
//     fileCategory: String(fileCategory),
//     companyId: Number(user.companyId),
//   });
// });
