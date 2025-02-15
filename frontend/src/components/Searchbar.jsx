import { Search, UserSearch, Feather } from "lucide-react";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SearchBarSkeletton from "../skeletons/SearchbarSkeletons";
import { useState, useCallback } from "react";
import avatar_image from "../assets/avatar.png";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { Link } from "react-router-dom";

const SearchBar = ({ searchBarRef }) => {
  const [query, setQuery] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [isEmpty, setIsEmpty] = useState(false);

  const fetchSearchResults = async (searchTerm) => {
    if (!searchTerm) return [];
    const response = await axiosInstance.get(
      `/users/search-users/?q=${searchTerm}`
    );
    return response.data;
  };

  const {
    data: searchResults,
    refetch,
    isPending: searchLoading,
  } = useQuery({
    queryKey: ["search", query],
    queryFn: () => fetchSearchResults(query),
    enabled: false,
  });

  // Debounce function memoized using useCallback
  const debounce = useCallback((func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  }, []);

  const fetchSuggestions = useCallback(
    async (queryValue) => {
      if (queryValue.length > 0) {
        const { data } = await refetch();
        setSearchedUsers(data);
        if (searchedUsers.length === 0) {
          setIsEmpty(true);
        }
      }
    },
    [refetch]
  );

  const handleSearch = useCallback(
    debounce((value) => fetchSuggestions(value), 1000),
    [debounce, fetchSuggestions]
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchedUsers([]);
    setIsEmpty(false);
    setQuery(value);
    handleSearch(value);
  };

  return (
    <div ref={searchBarRef}>
      <form
        className="flex items-center w-[20rem] sm:w-[22rem] mx-auto fixed top-[6.5rem] left-1/2 z-20 transform -translate-x-1/2 -translate-y-1/2 animate-fadeIn"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(query);
        }}
      >
        <div className="relative w-full">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <UserSearch className="w-5 h-5 text-base-content" />
          </div>
          <input
            type="text"
            id="simple-search"
            className="bg-base-100 font-semibold text-base-content text-sm rounded-lg block w-full ps-10 p-2.5 focus:outline-none"
            placeholder="Search"
            required
            onChange={handleInputChange}
            value={query}
          />
          <button
            type="submit"
            className="absolute top-[0.03rem] right-0 p-[0.55rem] ms-2 text-sm font-medium text-white bg-blue-700 rounded-br-lg rounded-tr-lg border border-blue-700 hover:bg-blue-800"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </form>
      <SkeletonTheme baseColor="#808080" highlightColor="#444">
        {query.length > 0 && (
          <div className="flex items-start flex-col w-[18rem] sm:w-[18rem] mx-auto top-[14.2rem] fixed left-1/2 z-40 transform -translate-x-1/2 -translate-y-1/2 animate-fadeIn bg-base-200 rounded-md shadow-lg px-4 pt-4 h-[11.05rem] overflow-y-auto overflow-x-hidden">
            {searchedUsers.length > 0 ? (
              <>
                {searchedUsers.map((user) => (
                  <Link
                    key={user._id}
                    to={`/profile/${user.username}`}
                    className="flex items-center justify-between mb-4 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3 bg-base-100 pl-3 w-[15.5rem] py-3 rounded-md hover:bg-base-300 transition-all ease-in duration-200">
                      <img
                        src={user.profilePicture || avatar_image}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <h3 className="text-sm font-semibold text-base-content">
                        {user.name}
                      </h3>
                    </div>
                  </Link>
                ))}
                <div className="mx-auto flex flex-col items-center justify-center gap-1 mt-1.5 mb-4 opacity-40">
                  <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Feather className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-sm font-semibold text-base-content">
                    Connekt
                  </div>
                </div>
              </>
            ) : isEmpty && searchedUsers.length === 0 ? (
              <>
                <div className="text-base-content mx-auto text-center text-sm font-semibold mt-4 opacity-70">
                  Alas ! They haven&apos;t joined :&#40;
                </div>
                <div className="mx-auto flex flex-col items-center justify-center gap-1 mt-7 scale-95 opacity-40">
                  <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Feather className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-sm font-semibold text-base-content">
                    Connekt
                  </div>
                </div>
              </>
            ) : (
              (query.length > 0 || searchLoading) && <SearchBarSkeletton />
            )}
          </div>
        )}
      </SkeletonTheme>
    </div>
  );
};

export default SearchBar;
