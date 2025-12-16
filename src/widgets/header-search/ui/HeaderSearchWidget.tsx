import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Input } from "@/shared/ui/input";

export const HeaderSearchWidget = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate({
        // eslint-disable-next-line id-length
        search: { q: searchQuery.trim(), type: "posts" },
        to: "/search",
      });
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="relative">
        <Search className="absolute rounded-lg left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="search"
          inputMode="search"
          aria-label="Search posts and communities"
          placeholder="Search Reddit"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="pl-10 pr-4 rounded-full"
          autoComplete="off"
        />
      </div>
    </form>
  );
};
