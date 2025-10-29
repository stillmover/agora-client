import type { User } from "@/entities/user";

export const UserAvatar = ({
  user,
  size = 32,
}: {
  user: User;
  size?: number;
}) => (
  <div
    className="flex items-center justify-center rounded-full bg-muted text-foreground"
    style={{ width: size, height: size }}
    title={user.name}
  >
    {user.avatarUrl ? (
      <img
        src={user.avatarUrl}
        alt={user.name}
        className="rounded-full w-full h-full object-cover"
      />
    ) : (
      <span className="text-xs font-medium">
        {user.name?.[0]?.toUpperCase()}
      </span>
    )}
  </div>
);
