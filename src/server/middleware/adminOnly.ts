export default defineEventHandler((event) => {
  const clientSideRoutes = !event.path.includes("/api");

  // se for um endpoint liberado então passar
  if (clientSideRoutes) {
    return;
  }

  //verificar rotas protegidas
  const protectedRoutes = ["/api/medic", "/api/user-admin"];

  const isProtected = protectedRoutes.some((route) =>
    event.path.includes(route)
  );

  // se a rota não é protegida por admin então passar
  if (!isProtected) {
    return;
  }

  const { userLogged } = useAuthUser();

  const user = userLogged(event);

  try {
    if (user.Profile!.type !== "ADMIN") {
      return sendError(
        event,
        createError({ statusCode: 403, statusMessage: "Forbidden" })
      );
    }
  } catch {
    return sendError(
      event,
      createError({ statusCode: 401, statusMessage: "Unauthorized" })
    );
  }
});
