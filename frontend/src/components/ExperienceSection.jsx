import { Briefcase, X } from "lucide-react";
import { useState } from "react";
import { formatDate, formatDuration } from "../utils/dateUtils";
import { motion } from "framer-motion";
import { Dot } from "lucide-react";

const ExperienceSection = ({ userData, isOwnProfile, onSave, isPending }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [experiences, setExperiences] = useState(userData.experience || []);
  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    startDate: "",
    endDate: "",
    description: "",
    place: "",
    currentlyWorking: false,
  });

  const handleAddExperience = () => {
    if (
      newExperience.title &&
      newExperience.company &&
      newExperience.startDate
    ) {
      setExperiences([...experiences, newExperience]);

      setNewExperience({
        title: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
        place: "",
        currentlyWorking: false,
      });
    }
  };

  const handleDeleteExperience = (id) => {
    if (!window.confirm("Are you sure you want to delete this experience ?"))
      return;
    setExperiences(experiences.filter((exp) => exp._id !== id));
  };

  const handleSave = () => {
    onSave({ experience: experiences });
    setIsEditing(false);
  };

  const handleCurrentlyWorkingChange = (e) => {
    setNewExperience({
      ...newExperience,
      currentlyWorking: e.target.checked,
      endDate: e.target.checked ? "" : newExperience.endDate,
    });
  };

  return (
    <div className="bg-base-100 shadow rounded-lg p-6 mb-6 border border-base-200">
      <h2 className="text-xl font-semibold mb-4">Experience</h2>
      {experiences.map((exp) => (
        <div key={exp._id} className="mb-4 flex justify-between items-start">
          <div className="flex items-start">
            <Briefcase
              size={20}
              className="mr-2 mt-[0.15rem] hidden md:block"
            />
            <div>
              <h3 className="font-semibold">{exp.title}</h3>
              <p className="text-base-content">{exp.company}</p>
              <p className="text-gray-500 text-sm flex items-center">
                {formatDate(exp.startDate)} -{" "}
                {exp.endDate ? formatDate(exp.endDate) : "Present"}
                <Dot size={12} />
                {formatDuration(exp.startDate, exp.endDate)}
              </p>
              <p className="text-gray-400 text-sm">{exp.place}</p>
              <p className="text-base-content whitespace-pre-wrap mt-1">
                {exp.description}
              </p>
            </div>
          </div>
          {isEditing && (
            <button
              onClick={() => handleDeleteExperience(exp._id)}
              className="text-red-500"
            >
              <X size={20} />
            </button>
          )}
        </div>
      ))}

      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="mt-4"
        >
          <input
            type="text"
            placeholder="Title"
            value={newExperience.title}
            onChange={(e) =>
              setNewExperience({ ...newExperience, title: e.target.value })
            }
            className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-1"
          />
          <input
            type="text"
            placeholder="Company"
            value={newExperience.company}
            onChange={(e) =>
              setNewExperience({ ...newExperience, company: e.target.value })
            }
            className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-1"
          />
          <input
            type="text"
            placeholder="Place"
            value={newExperience.place}
            onChange={(e) =>
              setNewExperience({ ...newExperience, place: e.target.value })
            }
            className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-1"
          />
          <input
            type="date"
            placeholder="Start Date"
            value={newExperience.startDate}
            onChange={(e) =>
              setNewExperience({ ...newExperience, startDate: e.target.value })
            }
            className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-1"
          />
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="currentlyWorking"
              checked={newExperience.currentlyWorking}
              onChange={handleCurrentlyWorkingChange}
              className="mr-1 w-6 cursor-pointer"
            />
            <label htmlFor="currentlyWorking" className="text-gray-600">
              I currently work here
            </label>
          </div>
          {!newExperience.currentlyWorking && (
            <input
              type="date"
              placeholder="End Date"
              value={newExperience.endDate}
              onChange={(e) =>
                setNewExperience({ ...newExperience, endDate: e.target.value })
              }
              className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-1"
            />
          )}
          <textarea
            placeholder="Description"
            value={newExperience.description}
            onChange={(e) =>
              setNewExperience({
                ...newExperience,
                description: e.target.value,
              })
            }
            className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-1"
            rows={4}
          />
          <button
            onClick={handleAddExperience}
            className="bg-primary text-white py-1 px-5 rounded hover:bg-primary-dark transition duration-300 font-medium"
          >
            Add Experience
          </button>
        </motion.div>
      )}

      {isOwnProfile && (
        <>
          {isEditing ? (
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={handleSave}
                className="bg-success text-white py-1 px-4 rounded hover:bg-primary-dark transition duration-300 font-medium"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-red-600 text-white py-1 px-[0.9rem] rounded hover:bg-red-600 transition duration-300 mr-2 font-medium"
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
export default ExperienceSection;
