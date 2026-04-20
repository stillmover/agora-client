import type { Community as GraphQLCommunity } from "@/shared/api/gql";
import type { Community } from "../model/types";

export const mapCommunity = (community: GraphQLCommunity): Community => ({
  bannerUrl: community.bannerUrl ?? undefined,
  createdAt: community.createdAt ?? undefined,
  description: community.description ?? undefined,
  iconUrl: community.iconUrl ?? undefined,
  id: community.id,
  isJoined: community.isJoined ?? false,
  members: community.memberCount ?? 0,
  name: community.name,
});
