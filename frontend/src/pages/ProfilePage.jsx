import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

import ProfileHeader from "../components/ProfileHeader";
import AboutSection from "../components/AboutSection";
import ExperienceSection from "../components/ExperienceSection";
import EducationSection from "../components/EducationSection";
import SkillsSection from "../components/SkillsSection";
import { toast } from "react-toastify";
import DeleteProfile from "../components/DeleteProfile";
import { Helmet } from "react-helmet-async";

const ProfilePage = () => {
  const { username } = useParams();
  const queryClient = useQueryClient();

  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
  });

  const { data: userProfile, isLoading: isUserProfileLoading } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: () => axiosInstance.get(`/users/${username}`),
  });

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: async (updatedData) => {
      await axiosInstance.put("/users/profile", updatedData);
    },
    onSuccess: () => {
      toast.success("Profile updated successfully !");
      queryClient.invalidateQueries(["userProfile", username]);
    },
  });

  const { mutate: deleteUser, isPending: deletePending } = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/auth/user-deletion`);
    },
    onSuccess: () => {
      toast.success("Account deleted successfully!");
      queryClient.invalidateQueries(["users"]);
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["notifications"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete user!");
    },
  });

  if (isLoading || isUserProfileLoading)
    return (
      <div className="flex flex-col gap-1.5 items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
        <div className="text-md font-base text-lg animate-pulse">Loading</div>
      </div>
    );

  const isOwnProfile = authUser.username === userProfile.data.username;
  const userData = isOwnProfile ? authUser : userProfile.data;

  const handleSave = (updatedData) => {
    updateProfile(updatedData);
  };

  return (
    <>
      <Helmet>
        <title>Connekt | Profile</title>
      </Helmet>
      <div className="max-w-4xl mx-auto p-4">
        <ProfileHeader
          userData={userData}
          isOwnProfile={isOwnProfile}
          onSave={handleSave}
          isPending={isPending}
        />
        <AboutSection
          userData={userData}
          isOwnProfile={isOwnProfile}
          onSave={handleSave}
          isPending={isPending}
        />
        <ExperienceSection
          userData={userData}
          isOwnProfile={isOwnProfile}
          onSave={handleSave}
          isPending={isPending}
        />
        <EducationSection
          userData={userData}
          isOwnProfile={isOwnProfile}
          onSave={handleSave}
          isPending={isPending}
        />
        <SkillsSection
          userData={userData}
          isOwnProfile={isOwnProfile}
          onSave={handleSave}
          isPending={isPending}
        />
        {isOwnProfile && (
          <DeleteProfile
            deleteUser={deleteUser}
            deletePending={deletePending}
          />
        )}
      </div>
    </>
  );
};
export default ProfilePage;
