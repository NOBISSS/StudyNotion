import React, { useEffect, useState } from "react";

const RequirementOfCourse = ({ label, register, errors, setValue }) => {
  const [requirement, setRequirement] = useState("");
  const [requirements, setRequirements] = useState([]);

  useEffect(() => {
    register("courseRequirements", {
      required: "At least one requirement is required",
      validate: (value) => value.length > 0 || "At least one requirement is required",
    });
    setValue("courseRequirements",[],{ shouldValidate: true });
  }, [register,setValue]);
  const addRequirement = (e) => {
    e.preventDefault();
    if (requirement.trim() === "" || requirements.includes(requirement)) return;
    const newReqs = [...requirements, requirement];
    setRequirements(newReqs);
    setRequirement("");
    setValue("courseRequirements", newReqs,{ shouldValidate: true }); // sync with react-hook-form
  };

  const removeRequirement = (reqToRemove) => {
    const newReqs = requirements.filter((req) => req !== reqToRemove);
    setRequirements(newReqs);
    setValue("courseRequirements", newReqs,{ shouldValidate: true }); // sync with react-hook-form
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="block mb-2 font-semibold">{label}</label>

      {/* Input field */}
      <div className="flex gap-3 items-end">
        <div>
              <label className="block mb-2 font-semibold">Requirements/Instructions *</label>
              <input
                type="text"
                name="requirement"
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                placeholder="Enter Requirements/Instructions"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-400"
              />
            </div> 
        {/* <input
          type="text"
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          placeholder="Enter a requirement and press Add"
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-400"
        /> */}
        <button
          type="button"
          className="px-4 py-3 bg-amber-300 text-black rounded-lg"
          onClick={addRequirement}
        >
          Add
        </button>
      </div>

      {errors.courseRequirements && (
        <span className="text-red-500">At least one requirement is required**</span>
      )}

      {/* Requirements list (shown below input) */}
      <div className="flex flex-col gap-2 mt-3">
        {requirements.map((req, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-gray-700 text-white p-2 rounded-lg"
          >
            <span>{req}</span>
            <button
              type="button"
              className="text-red-400 underline cursor-pointer"
              onClick={() => removeRequirement(req)}
            >
              Clear
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequirementOfCourse;
