import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import Post from "../components/Post";
import { Feather } from "lucide-react";
import { Helmet } from "react-helmet-async";

const PostPage = () => {
  const { postId } = useParams();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => axiosInstance.get(`/posts/${postId}`),
  });

  return (
    <>
      <Helmet>
        <title>Connekt | Post</title>
      </Helmet>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="hidden lg:block lg:col-span-1">
          <Sidebar user={authUser} />
        </div>

        {isLoading || !post?.data ? (
          <div className="col-span-1 lg:col-span-2 bg-base-100 shadow">
            <div className="flex flex-col gap-1.5 items-center justify-center h-screen">
              <span className="loading loading-spinner loading-lg"></span>
              <div className="text-md font-base text-lg animate-pulse">
                Loading
              </div>
            </div>
          </div>
        ) : (
          <div className="col-span-1 lg:col-span-2">
            <Post post={post.data} />
          </div>
        )}

        <div className="col-span-1 lg:col-span-1 hidden lg:block">
          <div className="bg-base-100 rounded-lg shadow px-5 py-10 flex flex-col justify-center items-center">
            <Feather className="mx-auto text-primary" size={60} />
            <h2 className="text-center text-xl font-bold py-5">
              Connekt. Grow. Succeed.
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};
export default PostPage;
