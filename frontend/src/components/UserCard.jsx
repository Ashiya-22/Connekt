import { Link } from "react-router-dom";
import avatar_img from "../assets/avatar.png";

function UserCard({ user, isConnection }) {
  return (
    <div className="bg-base-100 border border-base-200 rounded-lg shadow px-6 py-12 flex flex-col items-center transition-all hover:shadow-md">
      <Link
        to={`/profile/${user.username}`}
        className="flex flex-col items-center"
      >
        <img
          src={user.profilePicture || avatar_img}
          alt={user.name}
          className="w-16 h-16 rounded-full object-cover mb-4"
        />
        <h3 className="font-semibold text-lg text-center">{user.name}</h3>
      </Link>
      <p className="text-base-content text-center text-sm">{user.headline}</p>
      <p className="text-xs text-gray-500 mt-2">
        {user.connections?.length} connections
      </p>
      <button className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors w-full">
        {isConnection ? "Connected" : "Connect"}
      </button>
    </div>
  );
}

export default UserCard;
