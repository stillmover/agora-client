import { useMemo } from "react";
import {
  useCommentsQuery as useCommentsGql,
  useCommentQuery as useCommentGql,
  useUserCommentsQuery as useUserCommentsGql,
} from "@/shared/api/gql/query-hooks";
import { mapComment } from "../api/mappers";

export const useComments = (postId: string, limit = 50, offset = 0) => {
  const { data, isLoading, error, refetch } = useCommentsGql(
    postId,
    { limit, offset },
    { enabled: Boolean(postId) }
  );

  const comments = useMemo(() => (data ?? []).map(mapComment), [data]);

  return {
    comments,
    error,
    isLoading,
    refetch,
  };
};

export const useComment = (commentId: string) => {
  const { data, isLoading, error, refetch } = useCommentGql(commentId, {
    enabled: Boolean(commentId),
  });

  const comment = useMemo(() => (data ? mapComment(data) : undefined), [data]);

  return {
    comment,
    error,
    isLoading,
    refetch,
  };
};

export const useUserComments = (userId: string, limit = 20, offset = 0) => {
  const {
    data = [],
    isLoading,
    error,
    refetch,
  } = useUserCommentsGql(userId, { limit, offset }, { enabled: Boolean(userId) });

  const comments = useMemo(() => data.map(mapComment), [data]);

  return {
    comments,
    error,
    isLoading,
    refetch,
  };
};
