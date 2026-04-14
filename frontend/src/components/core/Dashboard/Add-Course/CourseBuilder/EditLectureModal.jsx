import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import VideoUploaderUppy from "../../../../Course/VideoUploaderUppy";

const EditLectureModal = ({ lecture, onClose, onSave }) => {
  const [title, setTitle] = useState(lecture?.title || "");
  const [description, setDescription] = useState(lecture?.description || "");
  const [isPreview, setIsPreview] = useState(lecture?.isPreview || false);
  const [isEditing, setIsEditing] = useState(lecture?.isEditing || false);
  const [videoPreview, setVideoPreview] = useState(lecture?.videoURL || null);

  const handleSave = async () => {
    if (
      title == lecture.title &&
      description == lecture.description &&
      isPreview == lecture.isPreview
    ) {
      toast.error("No changes detected");
      return;
    }
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description cannot be empty");
      return;
    }
    await onSave(lecture._id, { ...lecture, title, description, isPreview });
  };
  useEffect(() => {
    setTitle(lecture?.title || "");
    setDescription(lecture?.description || "");
    setIsPreview(lecture?.isPreview || false);
    setIsEditing(lecture?.isEditing || false);
    setVideoPreview(lecture?.videoURL || null);
  }, [lecture]);
  const timeSelectCls =
    "w-full px-3 py-3 rounded-lg bg-[#2C333F] border border-transparent text-[#838894] text-sm focus:outline-none focus:border-[#FFD60A] transition-colors appearance-none cursor-pointer";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-[#1D2532] rounded-xl w-full max-w-[580px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#2C333F]">
          <h2 className="text-white font-semibold text-base">
            {isEditing ? "Editing Lecture" : "Add Lecture"}
          </h2>
          <button
            onClick={onClose}
            className="text-[#838894] hover:text-white transition-colors"
          >
            <IoClose className="text-xl" />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Lecture Title */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white">
              Lecture Title <sup className="text-pink-400">*</sup>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Lecture Title"
              name="title"
              className="w-full px-4 py-3 rounded-lg bg-[#2C333F] border border-transparent text-white placeholder-[#838894] text-sm focus:outline-none focus:border-[#FFD60A] transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-white">
              Is Preview <sup className="text-pink-400">*</sup>
            </label>
            <input
              type="checkbox"
              name="isPreview"
              checked={isPreview}
              onChange={(e) => setIsPreview(e.target.checked)}
              className="w-4 h-4 rounded border-[#424854] accent-[#FFD60A] cursor-pointer"
            />
          </div>
          {/* Lecture Description */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white">
              Lecture Description <sup className="text-pink-400">*</sup>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              name="description"
              placeholder="Enter lecture description"
              className="w-full px-4 py-3 rounded-lg bg-[#2C333F] border border-transparent text-white placeholder-[#838894] text-sm focus:outline-none focus:border-[#FFD60A] transition-colors resize-none"
            />
          </div>
          {isEditing && (
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-lg bg-[#FFD60A] text-black text-sm font-semibold hover:bg-yellow-300 transition-colors"
            >
              Save Edits
            </button>
          )}
          {/* Lecture Video Upload */}
          <div className="flex gap-3 w-full">
            {lecture.isEditing && (
              <div className="flex flex-col gap-2 w-[50%]">
                <label className="text-sm font-medium text-white">
                  Lecture Video <sup className="text-pink-400">*</sup>
                </label>
                <label className="cursor-pointer">
                  <div className="w-full rounded-xl border-2 border-dashed border-[#424854] bg-[#2C333F] flex flex-col items-center justify-center gap-3 py-10 hover:border-[#FFD60A] transition-colors">
                    {videoPreview && (
                      <video
                        src={videoPreview}
                        className="max-h-40 rounded-lg"
                        controls
                      />
                    )}
                  </div>
                </label>
              </div>
            )}
            <div className={`${lecture.isEditing ? "w-[50%]" : "w-full"}`}>
              <label className="text-sm font-medium text-white">
                {isEditing ? "Edit Lecture Video" : "Lecture Video"}{" "}
                <sup className="text-pink-400">*</sup>
              </label>
              <VideoUploaderUppy
                title={title}
                description={description}
                isPreview={isPreview}
                sectionId={lecture.sectionId}
                courseId={lecture.courseId}
                isEditing={isEditing}
                subsectionId={lecture._id}
              />
            </div>
          </div>
          {/* Footer buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg bg-[#2C333F] text-white text-sm font-medium hover:bg-[#374151] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditLectureModal;
