import { useState } from "react";
import { motion } from "framer-motion";

const AboutSection = ({ userData, isOwnProfile, onSave, isPending }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [about, setAbout] = useState(userData.about || "");

  const handleSave = () => {
    setIsEditing(false);
    onSave({ about });
  };
  return (
    <div className="bg-base-100 shadow rounded-lg p-6 mb-6 border border-base-200">
      <h2 className="text-xl font-semibold mb-4">About</h2>
      {!isOwnProfile && <p>{userData.about}</p>}
      {isOwnProfile && (
        <>
          {isEditing ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="pb-4"
              >
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-1"
                  rows="4"
                  placeholder="I'm a proud Connekt user!"
                />
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={handleSave}
                    className="bg-success text-white py-1 px-4 rounded hover:bg-primary-dark 
									transition duration-300 font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center space-x-1 bg-red-600 text-white py-1 px-3 rounded font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </>
          ) : (
            <>
              <p>{userData.about}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-3 bg-primary text-white py-1 px-6 rounded hover:bg-primary-dark 
									transition duration-300 disabled:opacity-50 font-medium flex items-center justify-center gap-1"
                disabled={isPending}
              >
                Edit
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};
export default AboutSection;
