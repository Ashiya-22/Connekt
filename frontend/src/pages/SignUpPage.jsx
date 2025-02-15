import { Link } from "react-router-dom";
import SignUpForm from "../components/SignUpForm";
import { Feather } from "lucide-react";
import { Helmet } from "react-helmet-async";

const SignUpPage = () => {
  return (
    <>
      <Helmet>
        <title>Connekt | Signup</title>
      </Helmet>
      <div className="flex items-center justify-around py-4 mx-auto gap-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-xl flex-1">
          <div className="py-8 px-4 sm:rounded-lg sm:px-10">
            <SignUpForm />
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-base-100 text-base-content rounded-lg font-semibold">
                    Already on Connekt ?
                  </span>
                </div>
              </div>
              <div className="mt-6">
                <Link
                  to="/login"
                  className="w-full md:w-3/4 mx-auto flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 hidden lg:flex flex-col justify-center">
          <Feather className="mx-auto text-primary" size={100} />
          <h2 className="text-center text-3xl font-extrabold py-5">
            Connekt. Grow. Succeed.
          </h2>
        </div>
      </div>
    </>
  );
};
export default SignUpPage;
