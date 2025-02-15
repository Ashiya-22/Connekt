import { X } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const SkillsSection = ({ userData, isOwnProfile, onSave, isPending }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [skills, setSkills] = useState(userData.skills || []);
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const handleDeleteSkill = (skill) => {
    if (!window.confirm("Are you sure you want to delete this skill ?")) return;
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSave = () => {
    onSave({ skills });
    setIsEditing(false);
  };

  return (
    <div className="bg-base-100 shadow rounded-lg p-6 border border-base-200 mb-6">
      <h2 className="text-xl font-semibold mb-4">Skills</h2>
      <div className="flex flex-wrap">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="bg-base-200 text-base-content px-3 py-1 rounded-full text-sm mr-2 mb-2 flex items-center"
          >
            {skill}
            {isEditing && (
              <button
                onClick={() => handleDeleteSkill(skill)}
                className="ml-2 text-red-500"
              >
                <X size={14} />
              </button>
            )}
          </span>
        ))}
      </div>

      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="mt-4 flex flex-col gap-y-3"
        >
          <input
            type="text"
            placeholder="New Skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="flex-grow p-[0.48rem] border rounded-l focus:outline-none focus:ring-1"
          />
          <button
            onClick={handleAddSkill}
            className="max-w-max px-[3.08rem] bg-primary text-white py-1 rounded hover:bg-primary-dark transition duration-300 font-medium"
          >
            Add Skill
          </button>
        </motion.div>
      )}

      {isOwnProfile && (
        <>
          {isEditing ? (
            <div className="flex items-center gap-1">
              <button
                onClick={handleSave}
                className="mt-2 bg-success text-white py-1 px-[1.3rem] rounded hover:bg-primary-dark transition duration-300 font-medium"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="mt-2 bg-red-600 text-white py-1 px-4 rounded hover:bg-red-700 transition duration-300 ml-1 font-medium"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-3 bg-primary text-white py-1 px-6 rounded hover:bg-primary-dark 
								transition duration-300 disabled:opacity-50 font-medium flex items-center justify-center gap-1"
              disabled={isPending}
            >
              Edit
            </button>
          )}
        </>
      )}
    </div>
  );
};
export default SkillsSection;
