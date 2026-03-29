import React, { useState } from 'react'

const ChipInput = ({ label, register, errors, setValue, currentTags }) => {
  const [tag, setTag] = useState('')
  const [tags, setTags] = useState(currentTags)

  const removeTag = (tagToRemove) => {
    const newTags = tags.filter((t) => t !== tagToRemove)
    setTags(newTags)
    setValue('courseTag', newTags)
  }

  const addTag = (e) => {
    e.preventDefault()
    if (!tag.trim() || tags.includes(tag)) return
    const newTags = [...tags, tag]
    setTags(newTags)
    setTag('')
    setValue('courseTag', newTags)
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-white">
        {label} <sup className="text-pink-400">*</sup>
      </label>

      {/* Tags display */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((t, i) => (
            <div key={i}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2C333F] text-white text-xs font-medium">
              <span>{t}</span>
              <button type="button" onClick={() => removeTag(t)}
                className="text-[#838894] hover:text-red-400 transition-colors text-xs leading-none">
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input + Add */}
      <div className="flex gap-3">
        <input
          type="text"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTag(e)}
          placeholder="Choose a Tag"
          className="flex-1 px-4 py-3 rounded-lg bg-[#2C333F] border border-transparent text-white placeholder-[#838894] text-sm focus:outline-none focus:border-[#FFD60A] transition-colors"
        />
        <button type="button" onClick={addTag}
          className="px-4 py-2.5 bg-[#FFD60A] text-black text-sm font-semibold rounded-lg hover:bg-yellow-300 transition-colors">
          Add
        </button>
      </div>

      {errors.courseTag && (
        <p className="text-pink-400 text-xs">At least one tag is required</p>
      )}
    </div>
  )
}

export default ChipInput