import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";
import {
  ExternalLink,
  Eye,
  MessageSquare,
  ThumbsUp,
  Trash2,
  UserPlus,
  BellOff,
} from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { formatDistanceToNow } from "date-fns";
import avatar_image from "../assets/avatar.png";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const NotificationsPage = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => axiosInstance.get("/notifications"),
  });

  const { mutate: markAsReadMutation } = useMutation({
    mutationFn: () => axiosInstance.put(`/notifications/read`),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  const { mutate: deleteNotificationMutation } = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/notifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      toast.success("Notification deleted !");
    },
  });

  const renderNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <ThumbsUp className="text-blue-500 " size={20} />;

      case "comment":
        return <MessageSquare className="text-green-500" size={20} />;
      case "connectionAccepted":
        return <UserPlus className="text-purple-500" size={20} />;
      default:
        return null;
    }
  };

  const renderNotificationContent = (notification) => {
    switch (notification.type) {
      case "like":
        return (
          <span className="mr-2">
            <Link
              to={
                notification.relatedUser
                  ? `/profile/${notification.relatedUser?.username}`
                  : "#"
              }
              className="font-bold"
              onClick={(e) => {
                if (!notification.relatedUser) {
                  e.preventDefault();
                  alert("This account was deleted !");
                }
              }}
            >
              {notification.relatedUser?.name || "Connekt User"}
            </Link>{" "}
            liked your post
          </span>
        );
      case "comment":
        return (
          <span className="mr-2">
            <Link
              to={
                notification.relatedUser
                  ? `/profile/${notification.relatedUser?.username}`
                  : "#"
              }
              className="font-bold"
              onClick={(e) => {
                if (!notification.relatedUser) {
                  e.preventDefault();
                  alert("This account was deleted !");
                }
              }}
            >
              {notification.relatedUser?.name || "Connekt User"}
            </Link>{" "}
            commented on your post
          </span>
        );
      case "connectionAccepted":
        return (
          <span className="mr-2">
            <Link
              to={
                notification.relatedUser
                  ? `/profile/${notification.relatedUser?.username}`
                  : "#"
              }
              className="font-bold"
              onClick={(e) => {
                if (!notification.relatedUser) {
                  e.preventDefault();
                  alert("This account was deleted !");
                }
              }}
            >
              {notification.relatedUser?.name || "Connekt User"}
            </Link>{" "}
            accepted your connection request
          </span>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    markAsReadMutation();
  }, []);

  const renderRelatedPost = (relatedPost) => {
    if (!relatedPost) return null;

    return (
      <Link
        to={`/post/${relatedPost._id}`}
        className="mt-2 p-2 bg-base-200 rounded-md flex items-center space-x-2 hover:bg-base-300 transition-colors"
      >
        {relatedPost.image && (
          <img
            src={relatedPost.image}
            alt="Post preview"
            className="w-10 h-10 object-cover rounded"
          />
        )}
        <div className="flex-1 overflow-hidden">
          <p className="text-sm text-gray-600 text-ellipsis">
            {relatedPost.content}
          </p>
        </div>
        <ExternalLink size={14} className="text-gray-400" />
      </Link>
    );
  };

  return (
    <>
      <Helmet>
        <title>Connekt | Notifications</title>
      </Helmet>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="col-span-1 lg:col-span-1">
          <Sidebar user={authUser} />
        </div>
        <div className="col-span-1 lg:col-span-3">
          <div className="bg-base-100 rounded-lg shadow p-2 sm:p-6 border border-base-200">
            <h1 className="text-xl sm:text-2xl font-bold mb-6">
              Notifications
            </h1>

            {isLoading ? (
              <div className="flex flex-col gap-1.5 items-center justify-center py-20">
                <span className="loading loading-spinner loading-lg"></span>
                <div className="text-md font-base text-lg animate-pulse">
                  Loading
                </div>
              </div>
            ) : notifications && notifications.data.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ul>
                  {notifications.data.map((notification) => (
                    <li
                      key={notification._id}
                      className={`bg-base-100 border rounded-lg p-4 my-4 transition-all hover:shadow-md ${
                        !notification.read
                          ? "border-blue-500"
                          : "border-base-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <Link
                            to={
                              notification.relatedUser
                                ? `/profile/${notification.relatedUser?.username}`
                                : "#"
                            }
                            onClick={(e) => {
                              if (!notification.relatedUser) {
                                e.preventDefault();
                                alert("This account was deleted !");
                              }
                            }}
                          >
                            <img
                              src={
                                notification.relatedUser?.profilePicture ||
                                avatar_image
                              }
                              alt={notification.relatedUser?.name}
                              className="w-12 h-12 rounded-full object-cover hidden md:block"
                            />
                          </Link>

                          <div>
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-gray-100 rounded-full">
                                {renderNotificationIcon(notification.type)}
                              </div>
                              <p className="text-sm">
                                {renderNotificationContent(notification)}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDistanceToNow(
                                new Date(notification.createdAt),
                                {
                                  addSuffix: true,
                                }
                              )}
                            </p>
                            {renderRelatedPost(notification.relatedPost)}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {!notification.read && (
                            <div
                              className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                              aria-label="Mark as read"
                            >
                              <Eye size={16} />
                            </div>
                          )}

                          <button
                            onClick={() => {
                              if (
                                !window.confirm(
                                  "Are you sure you want to delete the notification ?"
                                )
                              )
                                return;
                              deleteNotificationMutation(notification._id);
                            }}
                            className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                            aria-label="Delete notification"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ) : (
              <div className="py-10 border border-base-200">
                <div className="mb-4">
                  <BellOff size={54} className="mx-auto text-primary" />
                </div>
                <p className="text-base-content mb-6 text-center font-medium">
                  No notifications to show at the moment !
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default NotificationsPage;
