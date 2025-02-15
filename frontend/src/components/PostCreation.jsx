import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-toastify";
import { ImageUp, Loader2, SmilePlus } from "lucide-react";
import avatar_img from "../assets/avatar.png";
import EmojiPicker from "emoji-picker-react";

const PostCreation = ({ user }) => {
  const [content, setContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleEmojiClick = (emojiData) => {
    setContent((prevInput) => prevInput + emojiData.emoji);
  };

  const queryClient = useQueryClient();

  const { mutate: createPostMutation, isPending } = useMutation({
    mutationFn: async (postData) => {
      const res = await axiosInstance.post("/posts/create", postData, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },
    onSuccess: () => {
      resetForm();
      toast.success("Post created successfully !");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => {
      toast.error(err.response.data.message || "Failed to create post !");
    },
  });

  const handlePostCreation = async () => {
    try {
      if (!content.trim() && !image)
        return toast.warn("Content or image is required !");
      const postData = { content };
      if (image) postData.image = await readFileAsDataURL(image);
      createPostMutation(postData);
    } catch (error) {
      console.error("Error in handlePostCreation:", error);
    }
  };

  const resetForm = () => {
    setContent("");
    setImage(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file.size > 1024 * 1024 * 2) {
      return toast.error("Image size must be less than 2MB");
    }
    setImage(file);
    if (file) {
      readFileAsDataURL(file).then(setImagePreview);
    } else {
      setImagePreview(null);
    }
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="bg-base-100 rounded-lg shadow mb-4 p-4 border border-base-200">
      <div className="flex space-x-3">
        <img
          src={user.profilePicture || avatar_img}
          alt={user.name}
          className="size-12 rounded-full"
        />
        <textarea
          placeholder="What's on your mind ?"
          className="w-full p-3 rounded-lg bg-base-200 focus:outline-none resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {imagePreview && (
        <div className="mt-4">
          <img
            src={imagePreview}
            alt="Selected"
            className="w-full h-auto rounded-lg"
          />
        </div>
      )}

      <div className="flex justify-between items-center mt-4 relative">
        <div className="flex space-x-4">
          <label className="flex items-center text-info hover:text-info-dark transition-colors duration-200 cursor-pointer">
            <ImageUp size={20} className="mr-2" />
            <span>Image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        <div className="flex gap-2">
          {showEmojiPicker && (
            <div className="absolute top-[4rem] left-1/2 transform -translate-x-1/2 z-5">
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                height={320}
                width={300}
                theme="light"
                emojiStyle="google"
              />
            </div>
          )}
          <span
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="flex items-center justify-center cursor-pointe mr-1 cursor-pointer"
          >
            <SmilePlus />
          </span>
          <button
            className="bg-red-600 text-white rounded-lg px-4 py-1 hover:bg-primary-dark transition-colors duration-200"
            onClick={resetForm}
          >
            Reset
          </button>
          <button
            className="bg-primary text-white rounded-lg px-4 py-1 hover:bg-primary-dark transition-colors duration-200"
            onClick={handlePostCreation}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="size-5 animate-spin" /> : "Share"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default PostCreation;
