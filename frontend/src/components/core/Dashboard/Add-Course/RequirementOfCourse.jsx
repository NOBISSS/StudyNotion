import React, { useEffect, useState } from 'react'

const RequirementOfCourse = ({ label, register, errors, setValue, requirements: initialRequirements }) => {
  const [requirement, setRequirement] = useState('')
  const [requirements, setRequirements] = useState(initialRequirements || [])

  useEffect(() => {
    register('courseRequirements', {
      required: 'At least one requirement is required',
      validate: (value) => value?.length > 0 || 'At least one requirement is required',
    })
    setValue('courseRequirements', requirements, { shouldValidate: false })
  }, [register, setValue,requirements])

  const addRequirement = (e) => {
    e.preventDefault()
    if (!requirement.trim() || requirements.includes(requirement)) return
    const newReqs = [...requirements, requirement]
    setRequirements(newReqs)
    setRequirement('')
    setValue('courseRequirements', newReqs, { shouldValidate: true })
  }

  const removeRequirement = (reqToRemove) => {
    const newReqs = requirements.filter((r) => r !== reqToRemove)
    setRequirements(newReqs)
    setValue('courseRequirements', newReqs, { shouldValidate: true })
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-white">
        {label} <sup className="text-pink-400">*</sup>
      </label>

      {/* Input + Add button */}
      <div className="flex gap-2">
        <input
          type="text"
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addRequirement(e)}
          placeholder="Enter Benefits of the course"
          className="w-1/2 px-4 py-3 rounded-lg bg-[#2C333F] border border-transparent text-white placeholder-[#838894] text-sm focus:outline-none focus:border-[#FFD60A] transition-colors"
        />
        <button
          type="button"
          onClick={addRequirement}
          className="bg-[#FFD60A] px-5 py-1 rounded-2xl text-black text-sm font-semibold w-fit hover:bg-yellow-300 transition-colors"
        >
          Add
        </button>
      </div>

      {errors.courseRequirements && (
        <p className="text-pink-400 text-xs">{errors.courseRequirements.message}</p>
      )}

      {/* List */}
      {requirements.length > 0 && (
        <div className="flex flex-col gap-2 mt-1">
          {requirements.map((req, index) => (
            <div key={index}
              className="flex justify-between items-center bg-[#2C333F] text-white px-4 py-2.5 rounded-lg text-sm">
              <div className="flex items-center gap-2">
                <span className="text-[#838894]">•</span>
                <span>{req}</span>
              </div>
              <button
                type="button"
                onClick={() => removeRequirement(req)}
                className="text-[#838894] hover:text-red-400 text-xs transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RequirementOfCourse