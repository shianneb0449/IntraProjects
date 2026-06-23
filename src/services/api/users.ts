import { apiClient } from "./client";
import type { AppUserDto, CurrentUserDto } from "../../types/user";

export const usersApi = {
  getMe: () =>
    apiClient.get<CurrentUserDto>("/api/users/me").then((r) => r.data),

  search: (query: string) =>
    apiClient
      .get<AppUserDto[]>("/api/users", { params: { search: query } })
      .then((r) => r.data),
};
