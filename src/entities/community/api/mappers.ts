import type { Community as GraphQLCommunity } from "@/shared/api/gql";
import type { Community } from "../model/types";

export const mapCommunity = (community: GraphQLCommunity): Community => {
  return {
    id: community.id,
    name: community.name,
    iconUrl: community.iconUrl ?? undefined,
    members: community.memberCount,
    isJoined: community.isJoined ?? false,
    description: community.description ?? undefined,
  };
};
