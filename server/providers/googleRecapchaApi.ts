import axios from "axios";

const api = axios.create({});

const config = useRuntimeConfig();

export const useGoogleRecapchaApi = () => {
  const verifyTokenRespRecapcha = async (tokenRecapcha: string) => {
    try {
      const params = {
        secret: config.public.googleRecapchaSecretKey,
        response: tokenRecapcha,
      };

      const url = "https://www.google.com/recaptcha/api/siteverify";

      const { data } = await api.post(url, undefined, { params });

      return data;
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Internal server error: ${error}`,
      });
    }
  };

  return { verifyTokenRespRecapcha };
};
