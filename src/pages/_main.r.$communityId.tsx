import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Suspense } from 'react';
import { useCommunityByName } from '@/entities/community';
import { Feed } from '@/widgets/feed';
import { useIsAuthenticated } from '@/entities/session';
import { useCommunityActions } from '@/features/community/model/useCommunityActions';
import { logger } from '@/shared/services/logger';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/shared/ui/card';
import { Button, Spinner } from '@/shared/ui';
import { Users, Loader2 } from 'lucide-react';
import { prefetchQueries } from '@/shared/api/gql/query-hooks';

export const Route = createFileRoute('/_main/r/$communityId')({
  component: CommunityPage,
  loader: async ({ context, params }) => {
    const { queryClient } = context;
    const { communityId: communityName } = params;

    await prefetchQueries.communityByName(queryClient, communityName);

    return { communityName };
  },
  staleTime: 5 * 60 * 1000,
});

function CommunityLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="h-8 bg-muted animate-pulse rounded w-1/3" />
          <div className="h-4 bg-muted animate-pulse rounded w-2/3 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">
              Loading community...
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CommunityPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <CommunityPageContent />
    </Suspense>
  );
}

function CommunityPageContent() {
  const { communityId: communityName } = Route.useParams();
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const { community, isLoading } = useCommunityByName(communityName);
  const [isHoveringLeave, setIsHoveringLeave] = useState(false);

  if (isLoading) {
    return <CommunityLoadingSkeleton />;
  }

  if (!community) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Community not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const joined = community?.isJoined ?? false;

  const {
    join,
    leave,
    isPending: isJoinPending,
  } = useCommunityActions(community?.id ?? '', joined);
  const handleMembershipToggle = async () => {
    if (!community) return;

    try {
      if (joined) {
        await leave();
      } else {
        await join();
      }
    } catch (error) {
      logger.error('Failed to update membership:', error);
    }
  };
  return (
    <div className="space-y-4">
      <Card className="overflow-hidden py-0 gap-0 [&>*:first-child]:p-0">
        <div className=" h-44 w-full bg-muted">
          {community.bannerUrl && (
            <img
              src={community.bannerUrl}
              alt={`${community.name} banner`}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <CardContent className="relative px-6 pb-6">
          <div className="-mt-12 mb-4">
            <div className="inline-flex rounded-full bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 p-1">
              <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-background bg-muted">
                {community.iconUrl ? (
                  <img
                    src={community.iconUrl}
                    alt={community.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-bold">
                    {community.name[0]?.toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                r/{community.name}
              </h1>

              {community.description && (
                <p className="mt-3 text-muted-foreground">
                  {community.description}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>
                {community.members.toLocaleString()}{' '}
                {community.members === 1 ? 'member' : 'members'}
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            {isAuthenticated && (
              <>
                <Button
                  variant={joined ? 'outline' : 'default'}
                  disabled={isJoinPending}
                  onClick={handleMembershipToggle}
                  onMouseEnter={() => setIsHoveringLeave(true)}
                  onMouseLeave={() => setIsHoveringLeave(false)}
                  className="w-full sm:w-auto min-w-[120px]"
                >
                  {isJoinPending
                    ? joined
                      ? 'Leaving...'
                      : 'Joining...'
                    : joined
                      ? isHoveringLeave
                        ? 'Leave'
                        : 'Joined'
                      : 'Join'}
                </Button>

                {joined && (
                  <Button
                    onClick={() =>
                      navigate({
                        search: { communityId: community.id },
                        to: '/submit',
                      })
                    }
                    className="w-full sm:w-auto"
                  >
                    Create Post
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Feed />
    </div>
  );
}
