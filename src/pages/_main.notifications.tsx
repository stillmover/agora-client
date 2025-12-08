import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  MessageSquare,
  ArrowBigUp,
  UserPlus,
  AtSign,
  Award,
  Settings,
  Check,
  CheckCheck,
  Trash2,
} from "lucide-react";
import { useIsAuthenticated } from "@/entities/session";
import {
  Card,
  CardContent,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
} from "@/shared/ui";
import { cn } from "@/shared/lib/utils";

export const Route = createFileRoute("/_main/notifications")({
  component: NotificationsPage,
});

type NotificationType =
  | "comment"
  | "reply"
  | "upvote"
  | "mention"
  | "follow"
  | "award";

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  from: {
    username: string;
    avatarUrl?: string;
  };
  link: string;
  createdAt: string;
  read: boolean;
};

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "comment",
    title: "New comment on your post",
    message: 'Someone commented on "Best practices for React in 2025"',
    from: { username: "johndoe" },
    link: "/post/1",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    read: false,
  },
  {
    id: "2",
    type: "upvote",
    title: "Your post is trending!",
    message: "Your post received 100 upvotes",
    from: { username: "system" },
    link: "/post/2",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
  },
  {
    id: "3",
    type: "mention",
    title: "You were mentioned",
    message: "@jane mentioned you in a comment",
    from: { username: "jane" },
    link: "/post/3",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: true,
  },
  {
    id: "4",
    type: "follow",
    title: "New follower",
    message: "mike started following you",
    from: { username: "mike" },
    link: "/u/mike",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
  },
  {
    id: "5",
    type: "award",
    title: "You received an award!",
    message: "Someone gave you a Gold award",
    from: { username: "anonymous" },
    link: "/post/5",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    read: true,
  },
];

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "comment":
    case "reply":
      return MessageSquare;
    case "upvote":
      return ArrowBigUp;
    case "mention":
      return AtSign;
    case "follow":
      return UserPlus;
    case "award":
      return Award;
    default:
      return Bell;
  }
};

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case "comment":
    case "reply":
      return "text-blue-500 bg-blue-500/10";
    case "upvote":
      return "text-brand bg-brand/10";
    case "mention":
      return "text-purple-500 bg-purple-500/10";
    case "follow":
      return "text-green-500 bg-green-500/10";
    case "award":
      return "text-amber-500 bg-amber-500/10";
    default:
      return "text-muted-foreground bg-muted";
  }
};

function NotificationItem({
  notification,
  onMarkRead,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
}) {
  const Icon = getNotificationIcon(notification.type);
  const colorClass = getNotificationColor(notification.type);

  return (
    <Link
      to={notification.link}
      className={cn(
        "flex items-start gap-4 p-4 rounded-xl transition-all duration-150",
        "hover:bg-accent",
        !notification.read && "bg-accent/50",
      )}
      onClick={() => !notification.read && onMarkRead(notification.id)}
    >
      <div className={cn("flex-shrink-0 p-2.5 rounded-full", colorClass)}>
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p
              className={cn(
                "text-sm",
                !notification.read ? "font-semibold" : "font-medium",
              )}
            >
              {notification.title}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {notification.message}
            </p>
          </div>
          {!notification.read && (
            <span className="flex-shrink-0 h-2 w-2 rounded-full bg-brand" />
          )}
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <Avatar className="h-4 w-4">
            <AvatarImage src={notification.from.avatarUrl} />
            <AvatarFallback className="text-[8px]">
              {notification.from.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span>u/{notification.from.username}</span>
          <span>•</span>
          <span>
            {formatDistanceToNow(new Date(notification.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>
    </Link>
  );
}

function NotificationsPage() {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  if (!isAuthenticated) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Bell className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            Sign in to view notifications
          </h2>
          <p className="text-muted-foreground mb-6">
            You need to be logged in to see your notifications.
          </p>
          <Button variant="brand" onClick={() => navigate({ to: "/" })}>
            Go to Home
          </Button>
        </CardContent>
      </Card>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications =
    activeTab === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "You're all caught up!"}
          </p>
        </div>
        <Button variant="ghost" size="icon-sm" asChild>
          <Link to="/settings/notifications">
            <Settings className="h-5 w-5" />
          </Link>
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "all" | "unread")}
      >
        <div className="flex items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="all" className="gap-2">
              All
              {notifications.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {notifications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread" className="gap-2">
              Unread
              {unreadCount > 0 && (
                <Badge className="ml-1 bg-brand text-white">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear all
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="all" className="mt-4">
          <NotificationsList
            notifications={filteredNotifications}
            onMarkRead={handleMarkRead}
          />
        </TabsContent>

        <TabsContent value="unread" className="mt-4">
          <NotificationsList
            notifications={filteredNotifications}
            onMarkRead={handleMarkRead}
            emptyMessage="No unread notifications"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NotificationsList({
  notifications,
  onMarkRead,
  emptyMessage = "No notifications yet",
}: {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  emptyMessage?: string;
}) {
  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{emptyMessage}</h3>
          <p className="text-sm text-muted-foreground">
            When you get notifications, they'll show up here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-2 divide-y divide-border">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkRead={onMarkRead}
          />
        ))}
      </CardContent>
    </Card>
  );
}
