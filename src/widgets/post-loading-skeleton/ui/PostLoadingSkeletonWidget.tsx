import { Card, CardContent, CardHeader } from "@/shared/ui/card";

export const PostLoadingSkeletonWidget = () => (
  <div className="container mx-auto max-w-4xl p-4">
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="h-8 bg-muted animate-pulse rounded w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="h-4 bg-muted animate-pulse rounded w-full mb-2" />
          <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
        </CardContent>
      </Card>
    </div>
  </div>
);
