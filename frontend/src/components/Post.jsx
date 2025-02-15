import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import {
  Loader,
  MessageCircle,
  Send,
  Share2,
  ThumbsUp,
  Trash2,
  Dot,
  SmilePlus,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import PostAction from "./PostAction";
import avatar_img from "../assets/avatar.png";
import { motion } from "framer-motion";
import EmojiPicker from "emoji-picker-react";
import { ShareButton } from "./ShareButton";

const Post = ({ post }) => {
  const { postId } = useParams();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleEmojiClick = (emojiData) => {
    setNewComment((prevInput) => prevInput + emojiData.emoji);
  };
  const [isOpen, setIsOpen] = useState(false);

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const isOwner = authUser._id === post.author._id;
  const isLiked = post.likes.includes(authUser._id);

  const queryClient = useQueryClient();

  const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/posts/delete/${post._id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: createComment, isPending: isAddingComment } = useMutation({
    mutationFn: async (newComment) => {
      await axiosInstance.post(`/posts/${post._id}/comment`, {
        content: newComment,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Comment added successfully");
    },
    onError: (err) => {
      toast.error(err.response.data.message || "Failed to add comment");
    },
  });

  const { mutate: likePost, isPending: isLikingPost } = useMutation({
    mutationFn: async () => {
      await axiosInstance.post(`/posts/${post._id}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  const handleDeletePost = () => {
    if (!window.confirm("Are you sure you want to delete this post ?")) return;
    deletePost();
  };

  const handleLikePost = async () => {
    if (isLikingPost) return;
    likePost();
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      createComment(newComment);
      setNewComment("");
      setComments([
        ...comments,
        {
          content: newComment,
          user: {
            _id: authUser._id,
            name: authUser.name,
            profilePicture: authUser.profilePicture,
          },
          createdAt: new Date(),
        },
      ]);
    }
  };

  return (
    <div className="bg-base-100 rounded-lg shadow mb-4 border border-base-200">
      {isOpen && (
        <ShareButton
          url={`http://localhost:5173/post/${post._id}`}
          setIsOpen={setIsOpen}
        />
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center justify-start">
            <Link to={`/profile/${post?.author?.username}`}>
              <img
                src={post.author.profilePicture || avatar_img}
                alt={post.author.name}
                className="size-10 rounded-full mr-3"
              />
            </Link>

            <div>
              <Link to={`/profile/${post?.author?.username}`}>
                <h3 className="font-semibold">{post.author.name}</h3>
              </Link>
              <div className="flex items-center">
                <p className="text-xs text-gray-400">{post.author.headline}</p>
                <Dot size={15} className="text-gray-500" />
                <p className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          </div>
          {isOwner && (
            <button
              onClick={handleDeletePost}
              className="text-red-500 hover:text-red-700"
            >
              {isDeletingPost ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Trash2 size={18} />
              )}
            </button>
          )}
        </div>
        <p className="mb-4 whitespace-pre-wrap">{post.content}</p>
        {post.image && (
          <img
            src={post.image}
            alt="Post content"
            className="rounded-lg w-full mb-4"
          />
        )}

        <div className="flex justify-between text-info">
          <PostAction
            icon={
              <ThumbsUp
                size={18}
                className={isLiked ? "text-gray-400  fill-gray-300" : ""}
              />
            }
            text={`Like (${post.likes.length})`}
            onClick={handleLikePost}
          />

          <PostAction
            icon={<MessageCircle size={18} />}
            text={`Comment (${comments.length})`}
            onClick={() => setShowComments(!showComments)}
          />
          <PostAction
            icon={<Share2 size={18} />}
            text="Share"
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
      </div>

      {showComments && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="px-4 pb-4"
        >
          <div className="mb-4 max-h-60 overflow-y-auto">
            {comments.map((comment) => (
              <Link
                to={comment.user ? `/profile/${comment.user?.username}` : "#"}
                key={comment._id}
                className="mb-2 bg-base-200 p-3 rounded-lg flex items-start"
                onClick={(e) => {
                  if (!comment.user) {
                    e.preventDefault();
                    alert("This account was deleted !");
                  }
                }}
              >
                <img
                  src={comment.user?.profilePicture || avatar_img}
                  alt={comment.user?.name || "Connekt User"}
                  className="w-8 h-8 rounded-full mr-2 flex-shrink-0"
                />
                <div className="flex-grow">
                  <div className="flex items-center mb-1">
                    <span className="font-semibold">
                      {comment.user?.name || "Connekt User"}
                    </span>
                    <Dot size={15} />
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <div className="text-sm">{comment.content}</div>
                </div>
              </Link>
            ))}
          </div>

          <form
            onSubmit={handleAddComment}
            className="flex items-center relative"
          >
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
              placeholder="Add a comment..."
              className="flex-grow pl-5 pr-[2.2rem] py-2 rounded-l-full bg-base-100 ring-1 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <span
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className="absolute right-[3.1rem] flex items-center justify-center cursor-pointe mr-1 cursor-pointer"
            >
              <SmilePlus />
            </span>

            <button
              type="submit"
              className="bg-primary text-white p-[0.75rem] rounded-r-full hover:bg-primary-dark transition duration-300"
              disabled={isAddingComment}
            >
              {isAddingComment ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Send size={18} className="mr-1" />
              )}
            </button>

            {showEmojiPicker && (
              <div className="absolute top-[4.2rem] left-1/2 transform -translate-x-1/2 z-5">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  height={320}
                  width={300}
                  theme="light"
                  emojiStyle="google"
                />
              </div>
            )}
          </form>
        </motion.div>
      )}
    </div>
  );
};
export default Post;
