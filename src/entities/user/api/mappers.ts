import type { User as GraphQLUser } from "@/shared/api/gql";
import type { User } from "../model/types";

export const mapUser = (data: GraphQLUser): User => ({
  id: data.id,
  username: data.username,
  name: data.name ?? undefined,
  bio: data.bio ?? undefined,
  avatarUrl: data.avatarUrl ?? undefined,
  karma: 0, // Karma is not in the current GraphQL schema
  createdAt: data.createdAt,
});
