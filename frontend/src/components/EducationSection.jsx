import { School, X } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const EducationSection = ({ userData, isOwnProfile, onSave, isPending }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [educations, setEducations] = useState(userData.education || []);
  const [newEducation, setNewEducation] = useState({
    school: "",
    fieldOfStudy: "",
    startYear: "",
    endYear: "",
  });

  const handleAddEducation = () => {
    if (
      newEducation.school &&
      newEducation.fieldOfStudy &&
      newEducation.startYear
    ) {
      setEducations([...educations, newEducation]);
      setNewEducation({
        school: "",
        fieldOfStudy: "",
        startYear: "",
        endYear: "",
      });
    }
  };

  const handleDeleteEducation = (id) => {
    if (!window.confirm("Are you sure you want to delete this education ?"))
      return;
    setEducations(educations.filter((edu) => edu._id !== id));
  };

  const handleSave = () => {
    onSave({ education: educations });
    setIsEditing(false);
  };

  return (
    <div className="bg-base-100 shadow rounded-lg p-6 mb-6 border border-base-200">
      <h2 className="text-xl font-semibold mb-4">Education</h2>
      {educations.map((edu) => (
        <div key={edu._id} className="mb-4 flex justify-between items-start">
          <div className="flex items-start">
            <School size={20} className="mr-2 mt-[0.15rem] hidden md:block" />
            <div>
              <h3 className="font-semibold">{edu.fieldOfStudy}</h3>
              <p className="text-gray-500">{edu.school}</p>
              <p className="text-base-content text-sm">
                {edu.startYear} - {edu.endYear || "Present"}
              </p>
            </div>
          </div>
          {isEditing && (
            <button
              onClick={() => handleDeleteEducation(edu._id)}
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
            placeholder="School"
            value={newEducation.school}
            onChange={(e) =>
              setNewEducation({ ...newEducation, school: e.target.value })
            }
            className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-1"
          />
          <input
            type="text"
            placeholder="Field of Study"
            value={newEducation.fieldOfStudy}
            onChange={(e) =>
              setNewEducation({ ...newEducation, fieldOfStudy: e.target.value })
            }
            className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-1"
          />
          <input
            type="number"
            placeholder="Start Year"
            value={newEducation.startYear}
            onChange={(e) =>
              setNewEducation({ ...newEducation, startYear: e.target.value })
            }
            className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-1"
          />
          <input
            type="number"
            placeholder="End Year"
            value={newEducation.endYear}
            onChange={(e) =>
              setNewEducation({ ...newEducation, endYear: e.target.value })
            }
            className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-1"
          />
          <button
            onClick={handleAddEducation}
            className="mt-1.5 bg-primary text-white py-1 px-[1.2rem] rounded hover:bg-primary-dark transition duration-300 font-medium"
          >
            Add Education
          </button>
        </motion.div>
      )}

      {isOwnProfile && (
        <>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="mt-2 bg-success text-white py-1 px-4 rounded hover:bg-primary-dark
							 	transition duration-300 font-medium"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="mt-2 bg-red-600 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-300 font-medium"
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
export default EducationSection;
