import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { MdOutlineVideoFile } from "react-icons/md";
import VideoUploaderUppy from "../../../../Course/VideoUploaderUppy";

const EditLectureModal = ({ lecture, onClose, onSave }) => {
  const [title, setTitle] = useState(lecture?.title || "");
  const [description, setDescription] = useState(lecture?.description || "");
  const [isPreview, setIsPreview] = useState(lecture?.isPreview || false);
  const isEditing = lecture?.isEditing || false;

  // Sync state when lecture prop changes
  useEffect(() => {
    setTitle(lecture?.title || "");
    setDescription(lecture?.description || "");
    setIsPreview(lecture?.isPreview || false);
  }, [lecture?._id]); // only re-sync when a different lecture is opened

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Title and description cannot be empty");
      return;
    }
    const hasChanges =
      title !== lecture.title ||
      description !== lecture.description ||
      isPreview !== lecture.isPreview;

    if (!hasChanges) {
      toast.error("No changes detected");
      return;
    }
    await onSave(lecture._id, { ...lecture, title, description, isPreview });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-[#1D2532] rounded-2xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto border border-white/[0.08]">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-[18px] border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD60A]" />
            <h2 className="text-white font-medium text-[15px]">
              {isEditing ? "Editing Lecture" : "Add Lecture"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.06] border border-white/10 text-[#838894] hover:text-white hover:bg-white/10 transition-all"
          >
            <IoClose size={14} />
          </button>
        </div>

        <div className="px-6 py-[22px] flex flex-col gap-[18px]">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-[#AFB2BF]">
              Lecture Title <sup className="text-pink-400">*</sup>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter lecture title"
              className="w-full px-[14px] py-[11px] rounded-[10px] bg-[#2C333F] border border-white/[0.08] text-white placeholder-[#555f6e] text-sm focus:outline-none focus:border-[#FFD60A]/60 transition-colors"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-[#AFB2BF]">
              Lecture Description <sup className="text-pink-400">*</sup>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Enter lecture description"
              className="w-full px-[14px] py-[11px] rounded-[10px] bg-[#2C333F] border border-white/[0.08] text-white placeholder-[#555f6e] text-sm focus:outline-none focus:border-[#FFD60A]/60 transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Preview Toggle */}
          <div className="flex items-center justify-between px-[14px] py-3 rounded-[10px] bg-[#2C333F] border border-white/[0.08]">
            <div className="flex flex-col gap-0.5">
              <span className="text-[13px] font-medium text-[#AFB2BF]">
                Allow Preview
              </span>
              <span className="text-[12px] text-[#555f6e]">
                Students can watch this before enrolling
              </span>
            </div>
            <button
              role="switch"
              aria-checked={isPreview}
              onClick={() => setIsPreview((p) => !p)}
              className={`relative w-10 h-[22px] rounded-full transition-colors duration-200 flex-shrink-0 ${
                isPreview ? "bg-[#FFD60A]" : "bg-[#3D4654]"
              }`}
            >
              <span
                className={`absolute top-[3px] w-4 h-4 rounded-full transition-all duration-200 ${
                  isPreview ? "left-[21px] bg-[#0f1117]" : "left-[3px] bg-white"
                }`}
              />
            </button>
          </div>

          {/* Current video — shown only when editing and video exists */}
          {isEditing && lecture?.videoURL && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#AFB2BF]">
                Current Video
              </label>
              <div className="flex items-center gap-3 px-[14px] py-3 rounded-[10px] bg-[#2C333F] border border-white/[0.08]">
                <div className="w-10 h-10 rounded-lg bg-[#FFD60A]/10 flex items-center justify-center flex-shrink-0">
                  <MdOutlineVideoFile size={18} className="text-[#FFD60A]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-white font-medium truncate">
                    {lecture.videoURL.split("/").pop()}
                  </p>
                  <p className="text-[12px] text-[#555f6e] mt-0.5">
                    Ready to play
                  </p>
                </div>
                <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
              </div>
            </div>
          )}

          {/* Video Uploader */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-[#AFB2BF]">
              {isEditing ? "Replace Video" : "Lecture Video"}{" "}
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

          {/* Footer */}
          <div className="flex justify-end gap-2.5 pt-1 border-t border-white/[0.06]">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-[10px] bg-white/[0.06] border border-white/10 text-[#AFB2BF] text-[13px] font-medium hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            {isEditing && (
              <button
                onClick={handleSave}
                className="px-5 py-2.5 rounded-[10px] bg-[#FFD60A] text-[#0f1117] text-[13px] font-semibold hover:bg-yellow-300 transition-colors"
              >
                Save changes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditLectureModal;
