import type { SortOption } from "@/shared/types";
import { SortType } from "@/shared/api/gql";

export const mapSortOptionToSortType = (option: SortOption): SortType => {
  const sortMap: Record<SortOption, SortType> = {
    best: SortType.Best,
    hot: SortType.Hot,
    new: SortType.New,
    rising: SortType.Rising,
    top: SortType.Top,
  };
  return sortMap[option];
};
