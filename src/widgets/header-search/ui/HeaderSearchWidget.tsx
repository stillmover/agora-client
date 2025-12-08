import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Input } from "@/shared/ui/input";

export const HeaderSearchWidget = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({
        to: "/search",
        search: { q: searchQuery.trim(), type: "posts" },
      });
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
      <div className="relative">
        <Search className="absolute rounded-lg left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search Reddit"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 rounded-full"
        />
      </div>
    </form>
  );
};
