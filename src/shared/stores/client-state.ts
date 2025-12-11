import { Store } from "@tanstack/store";
import { useStore } from "@tanstack/react-store";

import type { Region } from "@/shared/api/gql";

export interface ClientState {
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
}

const initialState: ClientState = {
  optimistic: {
    joinedCommunities: new Set(),
    postVotes: new Map(),
    savedPosts: new Set(),
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
    clientStateStore.setState((prev) => {
      if (prev.optimistic.joinedCommunities.has(communityId)) {
        return prev;
      }

      return {
        ...prev,
        optimistic: {
          ...prev.optimistic,
          joinedCommunities: new Set([...prev.optimistic.joinedCommunities, communityId]),
        },
      };
    });
  },

  leaveCommunity: (communityId: string) => {
    clientStateStore.setState((prev) => {
      const newJoined = new Set(prev.optimistic.joinedCommunities);
      newJoined.delete(communityId);
      if (newJoined.size === prev.optimistic.joinedCommunities.size) {
        return prev;
      }
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
    clientStateStore.setState((prev) => {
      if (prev.optimistic.savedPosts.has(postId)) {
        return prev;
      }

      return {
        ...prev,
        optimistic: {
          ...prev.optimistic,
          savedPosts: new Set([...prev.optimistic.savedPosts, postId]),
        },
      };
    });
  },

  setSidebarCollapsed: (collapsed: boolean) => {
    clientStateStore.setState((prev) => {
      if (prev.ui.sidebarCollapsed === collapsed) {
        return prev;
      }

      return {
        ...prev,
        ui: {
          ...prev.ui,
          sidebarCollapsed: collapsed,
        },
      };
    });
  },

  setTheme: (theme: "light" | "dark" | "system") => {
    clientStateStore.setState((prev) => {
      if (prev.ui.theme === theme) {
        return prev;
      }

      return {
        ...prev,
        ui: {
          ...prev.ui,
          theme,
        },
      };
    });
  },

  setUserRegion: (region: Region | null) => {
    clientStateStore.setState((prev) => {
      if (prev.ui.userRegion === region) {
        return prev;
      }

      return {
        ...prev,
        ui: {
          ...prev.ui,
          userRegion: region,
        },
      };
    });
  },

  unsavePost: (postId: string) => {
    clientStateStore.setState((prev) => {
      const newSaved = new Set(prev.optimistic.savedPosts);
      newSaved.delete(postId);
      if (newSaved.size === prev.optimistic.savedPosts.size) {
        return prev;
      }
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
    clientStateStore.setState((prev) => {
      const current = prev.optimistic.postVotes.get(postId);
      if (current === vote) {
        return prev;
      }

      return {
        ...prev,
        optimistic: {
          ...prev.optimistic,
          postVotes: new Map(prev.optimistic.postVotes).set(postId, vote),
        },
      };
    });
  },
} as const;

export const useClientState = () => useStore(clientStateStore);

export const useIsCommunityJoined = (communityId: string) => {
  return useStore(clientStateStore, (state) => state.optimistic.joinedCommunities.has(communityId));
};

export const useIsPostSaved = (postId: string) => {
  return useStore(clientStateStore, (state) => state.optimistic.savedPosts.has(postId));
};

export const usePostVote = (postId: string) => {
  return useStore(clientStateStore, (state) => state.optimistic.postVotes.get(postId));
};

export const useSidebarCollapsed = () => {
  return useStore(clientStateStore, (state) => state.ui.sidebarCollapsed);
};

export const useTheme = () => {
  return useStore(clientStateStore, (state) => state.ui.theme);
};

export const useUserRegion = () => {
  return useStore(clientStateStore, (state) => state.ui.userRegion);
};
