import type { Community as GraphQLCommunity } from "@/shared/api/gql";
import type { Community } from "../model/types";
import { clientStateActions, clientStateStore } from "@/shared/stores/client-state";

export const mapCommunity = (community: GraphQLCommunity): Community => ({
  description: community.description ?? undefined,
  iconUrl: community.iconUrl ?? undefined,
  id: community.id,
  isJoined: community.isJoined ?? false,
  members: community.memberCount,
  name: community.name,
});

export const hydrateJoinedCommunity = (community: GraphQLCommunity) => {
  if (community.isJoined && typeof window !== "undefined") {
    const current = clientStateStore.state.optimistic.joinedCommunities;
    if (!current.has(community.id)) {
      clientStateActions.joinCommunity(community.id);
    }
  }
};
