import Navbar from "./components/Navbar";
import { Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import NotificationPage from "./pages/NotifcationPage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";
import NetworkPage from "./pages/NetworkPage";
import { ToastContainer, toast } from "react-toastify";
import { axiosInstance } from "./lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState, useEffect } from "react";

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/user-info");
        return res.data;
      } catch (err) {
        if (err.response && err.response.status === 401) {
          return null;
        }
        toast.error(err.response.data.message || "Something went wrong !");
      }
    },
  });

  const searchBarRef = useRef(null);

  const handleOutsideClick = (event) => {
    if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
      toggleSearchBar(); // Close the search bar if clicked outside
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const [searchBar, toggleSearchBar] = useState(false);

  if (isLoading && !authUser)
    return (
      <div className="flex flex-col gap-1.5 items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
        <div className="text-md font-base text-lg animate-pulse">Loading</div>
      </div>
    );
  return (
    <>
      <div className="min-h-screen bg-base-100 relative">
        <Navbar toggleSearchBar={toggleSearchBar} />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route
              path="/"
              element={
                authUser ? (
                  <HomePage searchBar={searchBar} searchBarRef={searchBarRef} />
                ) : (
                  <Navigate to={"/login"} />
                )
              }
            />
            <Route
              path="/sign-up"
              element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />}
            />
            <Route
              path="/login"
              element={
                !authUser ? (
                  <LoginPage isLoading={isLoading} />
                ) : (
                  <Navigate to={"/"} />
                )
              }
            />
            <Route
              path="/notifications"
              element={
                authUser ? <NotificationPage /> : <Navigate to={"/login"} />
              }
            />
            <Route
              path="/network"
              element={authUser ? <NetworkPage /> : <Navigate to={"/login"} />}
            />
            <Route
              path="/post/:postId"
              element={authUser ? <PostPage /> : <Navigate to={"/login"} />}
            />
            <Route
              path="/profile/:username"
              element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />}
            />
          </Routes>
        </main>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </>
  );
}

export default App;
