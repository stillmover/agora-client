import {
  getApiMe,
  postApiLogin,
  postApiRegister,
  postApiLogout,
} from "@/shared/api/endpoints/authentication/authentication";
import type {
  PostApiLoginBodyOne,
  PostApiRegisterBodyOne,
} from "@/shared/api/models";

export const sessionApi = {
  getCurrentUser: () => getApiMe(),
  login: (credentials: PostApiLoginBodyOne) => postApiLogin(credentials),
  register: (data: PostApiRegisterBodyOne) => postApiRegister(data),
  logout: () => postApiLogout(),
} as const;
