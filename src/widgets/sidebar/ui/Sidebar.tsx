import { Link } from "@tanstack/react-router";
import { ROUTES } from "@/shared/config";
import { useCommunities } from "@/shared/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";
import { Badge } from "@/shared/ui/badge";
import {
  Home,
  TrendingUp,
  Users,
  HelpCircle,
  FileText,
  Shield,
  Info,
  Briefcase,
  Newspaper,
  Crown,
  Search,
  Plus,
} from "lucide-react";

export const Sidebar = () => {
  const { communities, isLoading } = useCommunities();

  return (
    <aside className="space-y-4">
      <Accordion
        type="multiple"
        defaultValue={["navigation", "communities"]}
        className="w-full"
      >
        {/* Navigation Section */}
        <AccordionItem value="navigation">
          <AccordionTrigger className="text-base font-medium px-0">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Navigation
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-1 pb-2">
            <Link
              to={ROUTES.HOME}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              to="/r/$communityId"
              params={{ communityId: "react" }}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
            >
              <TrendingUp className="h-4 w-4" />
              Popular
            </Link>
          </AccordionContent>
        </AccordionItem>

        {/* Communities Section */}
        <AccordionItem value="communities">
          <AccordionTrigger className="text-base font-medium px-0">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Communities
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-2 pb-2">
            <div className="flex items-center gap-2 px-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search communities"
                className="flex-1 text-sm bg-transparent border-none outline-none placeholder:text-muted-foreground"
              />
            </div>
            <Link
              to="/communities"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
            >
              <Plus className="h-4 w-4" />
              Browse communities
            </Link>
            <div className="space-y-1">
              {isLoading ? (
                <div className="space-y-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-8 bg-muted animate-pulse rounded"
                    ></div>
                  ))}
                </div>
              ) : (
                communities.slice(0, 5).map((community) => (
                  <Link
                    key={community.id}
                    to="/r/$communityId"
                    params={{ communityId: community.id }}
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    <Badge variant="secondary" className="text-xs">
                      r/{community.name}
                    </Badge>
                  </Link>
                ))
              )}
            </div>
            <Link
              to="/communities"
              className="block text-sm text-muted-foreground hover:text-foreground px-3 py-1 transition-colors"
            >
              See more
            </Link>
          </AccordionContent>
        </AccordionItem>

        {/* Resources Section */}
        <AccordionItem value="resources">
          <AccordionTrigger className="text-base font-medium px-0">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Resources
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-1 pb-2">
            <Link
              to="/about"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
            >
              <Info className="h-4 w-4" />
              About
            </Link>
            <Link
              to="/ads"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
            >
              <FileText className="h-4 w-4" />
              Ads
            </Link>
            <Link
              to="/help"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
              Help
            </Link>
            <Link
              to="/blog"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
            >
              <Newspaper className="h-4 w-4" />
              Blog
            </Link>
            <Link
              to="/careers"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
            >
              <Briefcase className="h-4 w-4" />
              Careers
            </Link>
            <Link
              to="/press"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
            >
              <FileText className="h-4 w-4" />
              Press
            </Link>
            <div className="flex items-center gap-2 rounded-md px-3 py-2 text-sm">
              <Crown className="h-4 w-4 text-orange-500" />
              <span>Reddit Pro</span>
              <Badge variant="secondary" className="text-xs ml-auto">
                BETA
              </Badge>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Rules & Policies Section */}
        <AccordionItem value="rules">
          <AccordionTrigger className="text-base font-medium px-0">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Rules & Policies
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-1 pb-2">
            <Link
              to="/rules"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
            >
              <Shield className="h-4 w-4" />
              Reddit Rules
            </Link>
            <Link
              to="/privacy"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
            >
              <FileText className="h-4 w-4" />
              Privacy Policy
            </Link>
            <Link
              to="/user-agreement"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
            >
              <FileText className="h-4 w-4" />
              User Agreement
            </Link>
            <Link
              to="/accessibility"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
            >
              <HelpCircle className="h-4 w-4" />
              Accessibility
            </Link>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
};
