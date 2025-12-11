import type { Community as GraphQLCommunity } from "@/shared/api/gql";
import type { Community } from "../model/types";

export const mapCommunity = (community: GraphQLCommunity): Community => ({
  description: community.description ?? undefined,
  iconUrl: community.iconUrl ?? undefined,
  bannerUrl: community.bannerUrl ?? undefined,
  id: community.id,
  isJoined: community.isJoined ?? false,
  members: community.memberCount ?? 0,
  name: community.name,
  createdAt: community.createdAt ?? undefined,
});
