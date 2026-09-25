import API from "@/services/api";
import { handleError } from "@/utilities/errorHandler";
import {
  type UsernamePayload,
  type UsernameResponse,
  usernamePayloadScheme,
  usernameResponseSchema,
} from "@/types/usernameType";

class usernameService {
  setUsername = async (payload: UsernamePayload, onBoardingToken: string) => {
    try {
      const validated = usernamePayloadScheme.parse(payload);
      const res = await API.post<UsernameResponse>(
        "/auth/username",
        validated,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${onBoardingToken}`,
          },
        },
      );
      return usernameResponseSchema.parse(res.data);
    } catch (error) {
      throw new Error(handleError(error));
    }
  };
}

export default usernameService;
