import {
  getAuthMe,
  postAuthLogin,
  postAuthRegister,
  postAuthLogout,
} from "@/shared/api/endpoints/authentication/authentication";
import type {
  PostApiLoginBodyOne,
  PostApiRegisterBodyOne,
} from "@/shared/api/models";

export const sessionApi = {
  getCurrentUser: () => getAuthMe(),
  login: (credentials: PostApiLoginBodyOne) => postAuthLogin(credentials),
  register: (data: PostApiRegisterBodyOne) => postAuthRegister(data),
  logout: () => postAuthLogout(),
} as const;
