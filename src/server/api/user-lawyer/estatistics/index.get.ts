import {
  index,
  UserLawyerEstatisticsFilterProps,
} from "@/server/repositories/userLawyerEstatisticsRepository";

export default defineEventHandler(async (event) => {
  const { userLogged } = useAuthUser();

  const user = userLogged(event);
  let userId = user.id!;

  const { initialDate, finalDate } =
    getQuery<UserLawyerEstatisticsFilterProps>(event);

  setResponseStatus(event, 200);

  return index({
    userId,
    initialDate,
    finalDate,
  });
});
