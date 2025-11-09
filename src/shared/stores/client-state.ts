import { Store } from "@tanstack/store";
import { useStore } from "@tanstack/react-store";

import type { Region } from "@/shared/api/gql";

export type ClientState = {
  optimistic: {
    joinedCommunities: Set<string>;
    savedPosts: Set<string>;
    postVotes: Map<string, -1 | 0 | 1>;
  };

  ui: {
    sidebarCollapsed: boolean;
    theme: "light" | "dark" | "system";
    userRegion: Region | null;
  };
};

const initialState: ClientState = {
  optimistic: {
    joinedCommunities: new Set(),
    savedPosts: new Set(),
    postVotes: new Map(),
  },
  ui: {
    sidebarCollapsed: false,
    theme: "system",
    userRegion: null,
  },
};

export const clientStateStore = new Store<ClientState>(initialState);

export const clientStateActions = {
  joinCommunity: (communityId: string) => {
    clientStateStore.setState((prev) => ({
      ...prev,
      optimistic: {
        ...prev.optimistic,
        joinedCommunities: new Set([
          ...prev.optimistic.joinedCommunities,
          communityId,
        ]),
      },
    }));
  },

  leaveCommunity: (communityId: string) => {
    clientStateStore.setState((prev) => {
      const newJoined = new Set(prev.optimistic.joinedCommunities);
      newJoined.delete(communityId);
      return {
        ...prev,
        optimistic: {
          ...prev.optimistic,
          joinedCommunities: newJoined,
        },
      };
    });
  },

  savePost: (postId: string) => {
    clientStateStore.setState((prev) => ({
      ...prev,
      optimistic: {
        ...prev.optimistic,
        savedPosts: new Set([...prev.optimistic.savedPosts, postId]),
      },
    }));
  },

  unsavePost: (postId: string) => {
    clientStateStore.setState((prev) => {
      const newSaved = new Set(prev.optimistic.savedPosts);
      newSaved.delete(postId);
      return {
        ...prev,
        optimistic: {
          ...prev.optimistic,
          savedPosts: newSaved,
        },
      };
    });
  },

  votePost: (postId: string, vote: -1 | 0 | 1) => {
    clientStateStore.setState((prev) => ({
      ...prev,
      optimistic: {
        ...prev.optimistic,
        postVotes: new Map(prev.optimistic.postVotes).set(postId, vote),
      },
    }));
  },

  setSidebarCollapsed: (collapsed: boolean) => {
    clientStateStore.setState((prev) => ({
      ...prev,
      ui: {
        ...prev.ui,
        sidebarCollapsed: collapsed,
      },
    }));
  },

  setTheme: (theme: "light" | "dark" | "system") => {
    clientStateStore.setState((prev) => ({
      ...prev,
      ui: {
        ...prev.ui,
        theme,
      },
    }));
  },

  setUserRegion: (region: Region | null) => {
    clientStateStore.setState((prev) => ({
      ...prev,
      ui: {
        ...prev.ui,
        userRegion: region,
      },
    }));
  },
} as const;

export const useClientState = () => useStore(clientStateStore);

export const useIsCommunityJoined = (communityId: string) => {
  const state = useStore(clientStateStore);
  return state.optimistic.joinedCommunities.has(communityId);
};

export const useIsPostSaved = (postId: string) => {
  const state = useStore(clientStateStore);
  return state.optimistic.savedPosts.has(postId);
};

export const usePostVote = (postId: string) => {
  const state = useStore(clientStateStore);
  return state.optimistic.postVotes.get(postId) ?? 0;
};

export const useSidebarCollapsed = () => {
  const state = useStore(clientStateStore);
  return state.ui.sidebarCollapsed;
};

export const useTheme = () => {
  const state = useStore(clientStateStore);
  return state.ui.theme;
};

export const useUserRegion = () => {
  const state = useStore(clientStateStore);
  return state.ui.userRegion;
};
