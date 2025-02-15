import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import PostCreation from "../components/PostCreation";
import Post from "../components/Post";
import { CircleFadingPlus, UserRoundX, Feather } from "lucide-react";
import RecommendedUser from "../components/RecommendedUser";
import SearchBar from "../components/Searchbar";
import { Helmet } from "react-helmet-async";

const HomePage = ({ searchBar, searchBarRef }) => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { data: recommendedUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/suggestions");
      return res.data;
    },
  });

  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/posts");
      return res.data;
    },
  });

  return (
    <>
      <Helmet>
        <title>Connekt | Feed</title>
      </Helmet>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {searchBar && (
          <>
            <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10 animate-fadeIn">
              <SearchBar searchBarRef={searchBarRef} />
            </div>
          </>
        )}
        <div className="hidden lg:block lg:col-span-1">
          <Sidebar user={authUser} />
        </div>

        <div className="col-span-1 lg:col-span-2 order-first lg:order-none relative">
          <PostCreation user={authUser} />

          {posts === undefined && (
            <div className="flex flex-col gap-1.5 items-center justify-center h-screen">
              <span className="loading loading-spinner loading-lg"></span>
              <div className="text-md font-base text-lg animate-pulse">
                Loading
              </div>
            </div>
          )}

          {posts?.map((post) => (
            <Post key={post._id} post={post} />
          ))}

          {posts?.length === 0 && (
            <div className="bg-base rounded-lg shadow px-8 py-16 text-center">
              <div className="mb-6">
                <CircleFadingPlus size={54} className="mx-auto text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-4 text-base-content">
                No Posts Yet
              </h2>
              <p className="text-base-content mb-6 font-medium">
                Connect with others to start seeing posts in your feed !
              </p>
            </div>
          )}
        </div>

        <div className="col-span-1 lg:col-span-1 hidden lg:block relative">
          <div className="bg-base rounded-lg shadow p-5 mb-4 border border-base-200">
            <h2 className="font-semibold mb-4">People you may know</h2>
            {recommendedUsers === undefined && (
              <div className="flex flex-col py-10 gap-1.5 items-center justify-center">
                <span className="loading loading-spinner loading-md"></span>
                <div className="text-md font-base text-sm animate-pulse">
                  Loading
                </div>
              </div>
            )}

            {recommendedUsers?.length === 0 && (
              <div className="py-5">
                <div className="mb-4">
                  <UserRoundX size={34} className="mx-auto text-primary" />
                </div>
                <p className="text-base-content text-xs mb-6 text-center font-medium">
                  No users to show at the moment !
                </p>
              </div>
            )}

            {recommendedUsers?.map((user) => (
              <RecommendedUser key={user._id} user={user} />
            ))}
          </div>

          <div className="col-span-1 lg:col-span-1 hidden lg:block sticky top-[5.75rem]">
            <div className="bg-base-100 rounded-lg shadow px-5 pt-8 pb-10 flex flex-col justify-center items-center border border-base-200">
              <Feather className="mx-auto text-primary" size={60} />
              <h2 className="text-center text-xl font-bold py-5">
                Connekt. Grow. Succeed.
              </h2>
              <div className="text-xs text-gray-400">
                &copy; {new Date().getFullYear()} Connekt. All Rights Reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default HomePage;
