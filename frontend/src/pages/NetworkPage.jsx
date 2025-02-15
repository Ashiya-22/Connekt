import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import { UserPlus, UserRoundX } from "lucide-react";
import FriendRequest from "../components/FriendRequest";
import UserCard from "../components/UserCard";
import { Helmet } from "react-helmet-async";

const NetworkPage = () => {
  const { data: user } = useQuery({ queryKey: ["authUser"] });

  const { data: connectionRequests } = useQuery({
    queryKey: ["connectionRequests"],
    queryFn: () => axiosInstance.get("/connections/requests"),
  });

  const { data: connections } = useQuery({
    queryKey: ["connections"],
    queryFn: () => axiosInstance.get("/connections"),
  });

  return (
    <>
      <Helmet>
        <title>Connekt | Network</title>
      </Helmet>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="col-span-1 lg:col-span-1">
          <Sidebar user={user} />
        </div>
        <div className="col-span-1 lg:col-span-3">
          <div className="bg-base-100 rounded-lg shadow p-6 mb-6">
            <h1 className="text-xl font-bold mb-6">My Network</h1>

            {connectionRequests?.data?.length > 0 ? (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">
                  Connection Request
                </h2>
                <div className="space-y-4">
                  {connectionRequests.data.map((request) => (
                    <FriendRequest key={request.id} request={request} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-base-100 rounded-lg shadow px-6 py-16 text-center mb-6">
                <UserPlus size={48} className="mx-auto text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  No Connection Requests
                </h3>
                <p className="text-gray-500 text-sm">
                  You don&apos;t have any pending connection requests at the
                  moment.
                </p>
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-6">My Connections</h2>
              {connections === undefined ? (
                <div className="flex flex-col py-10 gap-1.5 items-center justify-center">
                  <span className="loading loading-spinner loading-lg"></span>
                  <div className="text-md font-base text-lg animate-pulse">
                    Loading
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {connections.data.length === 0 && (
                    <div className="col-span-3 w-full flex flex-col gap-2 justify-center items-center px-6 pt-10 pb-4">
                      <UserRoundX size={48} className="mx-auto text-primary" />
                      <h3 className="text-xl font-semibold">No Connections</h3>
                      <p className="text-gray-500 text-sm">
                        You don&apos;t have any connections yet.
                      </p>
                    </div>
                  )}
                  {connections.data.map((connection) => (
                    <UserCard
                      key={connection._id}
                      user={connection}
                      isConnection={true}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default NetworkPage;
