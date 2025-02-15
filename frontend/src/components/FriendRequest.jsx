import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import avatar_img from "../assets/avatar.png";

const FriendRequest = ({ request }) => {
  const queryClient = useQueryClient();

  const { mutate: acceptConnectionRequest, isPending: acceptLoad } =
    useMutation({
      mutationFn: (requestId) =>
        axiosInstance.put(`/connections/accept/${requestId}`),
      onSuccess: () => {
        toast.success("Connection request accepted !");
        queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
      },
      onError: (error) => {
        toast.error(error.response.data.error);
      },
    });

  const { mutate: rejectConnectionRequest, isPending: rejectLoad } =
    useMutation({
      mutationFn: (requestId) =>
        axiosInstance.put(`/connections/reject/${requestId}`),
      onSuccess: () => {
        toast.success("Connection request rejected !");
        queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
      },
      onError: (error) => {
        toast.error(error.response.data.error);
      },
    });

  return (
    <div className="bg-base-100 rounded-lg shadow p-10 sm:p-4 flex flex-col gap-4 sm:flex-row items-center justify-between transition-all hover:shadow-md">
      <div className="flex items-center gap-4">
        <Link to={`/profile/${request.sender.username}`}>
          <img
            src={request.sender.profilePicture || avatar_img}
            alt={request.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        </Link>

        <div>
          <Link
            to={`/profile/${request.sender.username}`}
            className="font-semibold text-lg"
          >
            {request.sender.name}
          </Link>
          <p className="text-gray-600">{request.sender.headline}</p>
        </div>
      </div>

      <div className="space-x-3 sm:space-x-2">
        <button
          className="bg-primary text-white px-4 py-1.5 rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50"
          onClick={() => acceptConnectionRequest(request._id)}
          disabled={acceptLoad || rejectLoad}
        >
          Accept
        </button>
        <button
          className="bg-red-600 text-white px-4 py-1.5 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
          onClick={() => rejectConnectionRequest(request._id)}
          disabled={acceptLoad || rejectLoad}
        >
          Reject
        </button>
      </div>
    </div>
  );
};
export default FriendRequest;
