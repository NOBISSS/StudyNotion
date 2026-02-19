import React, { useState } from 'react'

const ChipInput = ({label,register,errors,setValue,getValue}) => {
    const [tag,setTag]=useState("");
    const [tags,setTags]=useState([]);
    const RemoveTag=(e,tagToRemove)=>{
        e.preventDefault();
        const newTags=tags.filter((t)=>t!==tagToRemove)
        setTags(newTags)
        setValue("courseTags",newTags);
    }
    const HandleTags=(e)=>{
        e.preventDefault();
        if(tag.trim()==="" || tags.includes(tag)) return;
        const newTags=[...tags,tag];
        setTags(newTags);
        setTag("");
        setValue("courseTags",newTags);
    }
    
  return (
     <div className="flex flex-col gap-3">
      <label className="block mb-2 font-semibold">{label}</label>

      {tags.length > 0 && (
        <div className="TAGS-BOX flex gap-2 flex-wrap">
          {tags.map((t, index) => (
            <div
              key={index}
              className="rounded-lg p-2 flex items-center gap-2 bg-amber-700 text-white"
            >
              <span>{t}</span>
              <button
                type="button"
                className="bg-amber-950 px-2 rounded cursor-pointer"
                onClick={(e) => RemoveTag(e, t)}
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <input
          type="text"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") HandleTags(e);
          }}
          placeholder="Enter Tags and press Add Or Enter"
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-yellow-400"
        />
        <button
          className="px-4 py-2 bg-amber-300 text-black rounded-lg"
          onClick={HandleTags}
        >
          Add+
        </button>
      </div>

      {errors.courseTags && <span>Tag is Required**</span>}
    </div>
  );
}

export default ChipInput