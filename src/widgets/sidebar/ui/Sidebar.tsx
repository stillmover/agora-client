import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { ROUTES } from "@/shared/config";
import { useCommunities } from "@/entities/community";
import type { Community } from "@/entities/community";
import { useIsAuthenticated } from "@/entities/session";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Input,
} from "@/shared/ui";
import {
  Home,
  TrendingUp,
  Bookmark,
  Bell,
  Settings,
  Search,
  Plus,
  Flame,
  Sparkles,
} from "lucide-react";
import { CommunityInfoModal } from "@/widgets/community-info-modal";
import { CreateCommunityModal } from "@/widgets/create-community-modal";
import { cn } from "@/shared/lib/utils";

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  badge?: string | number;
  params?: Record<string, string>;
  search?: Record<string, unknown>;
}

const NavItem = ({ to, icon: Icon, label, badge, params, search }: NavItemProps) => {
  const location = useLocation();
  const isActive =
    location.pathname === to ||
    (params && location.pathname.startsWith(to.replaceAll(/\$\w+/g, "")));

  return (
    <Link
      to={to}
      params={params}
      search={search}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
        "transition-all duration-150",
        isActive
          ? "bg-accent text-foreground"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
      )}
    >
      <Icon className={cn("h-5 w-5", isActive && "text-brand")} />
      <span className="flex-1">{label}</span>
      {badge !== undefined && (
        <Badge variant="secondary" className="ml-auto">
          {badge}
        </Badge>
      )}
    </Link>
  );
};

export const Sidebar = () => {
  const { communities, isLoading } = useCommunities();
  const isAuthenticated = useIsAuthenticated();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCommunities = communities.filter((c: Community) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="space-y-6">
      <nav className="space-y-1">
        <NavItem to={ROUTES.HOME} icon={Home} label="Home" />
        <NavItem
          to="/r/$communityId"
          params={{ communityId: "popular" }}
          icon={TrendingUp}
          label="Popular"
        />
        <NavItem to="/r/$communityId" params={{ communityId: "all" }} icon={Flame} label="All" />
        {isAuthenticated && (
          <>
            <NavItem to={ROUTES.SAVED} icon={Bookmark} label="Saved" />
            <NavItem to={ROUTES.NOTIFICATIONS} icon={Bell} label="Notifications" badge={3} />
          </>
        )}
      </nav>

      <hr className="border-border" />

      <Accordion type="multiple" defaultValue={["communities"]} className="w-full">
        <AccordionItem value="communities" className="border-none">
          <AccordionTrigger className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 hover:no-underline">
            Communities
          </AccordionTrigger>
          <AccordionContent className="space-y-3 pt-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search communities"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="sm"
                variant="filled"
                className="pl-9"
              />
            </div>

            <CreateCommunityModal
              trigger={
                <button
                  className={cn(
                    "group flex items-center gap-3 w-full rounded-lg p-3",
                    "text-sm transition-all cursor-pointer",
                    "bg-gradient-to-r from-brand/5 to-orange-500/5",
                    "hover:from-brand/10 hover:to-orange-500/10",
                    "border border-brand/20 hover:border-brand/40"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full",
                      "bg-brand text-white shadow-sm",
                      "group-hover:scale-105 transition-transform"
                    )}
                  >
                    <Plus className="h-5 w-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">Create a community</p>
                    <p className="text-xs text-muted-foreground">Start your own space</p>
                  </div>
                </button>
              }
            />

            <div className="space-y-1">
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-2">
                      <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
                      <div className="flex-1">
                        <div className="h-4 bg-muted animate-pulse rounded w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                filteredCommunities.slice(0, 8).map((community: Community) => (
                  <CommunityInfoModal
                    key={community.id}
                    communityName={community.name}
                    trigger={
                      <button
                        className={cn(
                          "flex items-center gap-3 w-full rounded-lg px-2 py-2",
                          "text-sm transition-colors cursor-pointer",
                          "hover:bg-accent"
                        )}
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={community.iconUrl} alt={community.name} />
                          <AvatarFallback className="text-xs font-semibold bg-gradient-to-br from-brand to-orange-400 text-white">
                            {community.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left min-w-0">
                          <p className="font-medium text-foreground truncate">r/{community.name}</p>
                        </div>
                      </button>
                    }
                  />
                ))
              )}
            </div>

            {communities.length > 8 && (
              <Link
                to={ROUTES.SEARCH}
                search={{ q: "", type: "communities" }}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm",
                  "text-muted-foreground hover:text-foreground hover:bg-accent",
                  "transition-colors"
                )}
              >
                <Sparkles className="h-4 w-4" />
                See all communities
              </Link>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {isAuthenticated && (
        <>
          <hr className="border-border" />
          <nav className="space-y-1">
            <NavItem to={ROUTES.SETTINGS} icon={Settings} label="Settings" />
          </nav>
        </>
      )}

      <div className="pt-4 text-xs text-muted-foreground space-y-2">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <a href="https://www.redditinc.com/" className="hover:text-foreground transition-colors">
            About
          </a>
          <a
            href="https://support.reddithelp.com/hc/en-us"
            className="hover:text-foreground transition-colors"
          >
            Help
          </a>
          <a
            href="https://www.redditinc.com/policies/privacy-policy"
            className="hover:text-foreground transition-colors"
          >
            Privacy
          </a>
          <a
            href="https://www.redditinc.com/policies/user-agreement"
            className="hover:text-foreground transition-colors"
          >
            Terms
          </a>
        </div>
        <p>© 2025 Agora. All rights reserved.</p>
      </div>
    </aside>
  );
};
