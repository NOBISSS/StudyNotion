import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { VscAdd, VscChevronLeft, VscChevronRight } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  createSection,
  deleteSection,
  fetchCourseSections,
  getAllSubsections,
  getSubsectionDetails,
  removeSubsection,
  updateSection,
  updateSubsection,
} from "../../../../../services/operations/courseDetailsAPI";
import { setCourse, setStep } from "../../../../../slices/courseSlice";
import EditLectureModal from "./EditLectureModal";

const CourseBuilderForm = ({ courseId }) => {
  const dispatch = useDispatch();
  const { course } = useSelector((state) => state.course);
  const [searchParams, setSearchParams] = useSearchParams();
  const [sectionName, setSectionName] = useState("");
  const [editingSection, setEditingSection] = useState({
    sectionId: null,
    isEditing: false,
    editingName: "",
  });
  const [sections, setSections] = useState(course?.sections || []);
  const [expandedSection, setExpandedSection] = useState(sections[0] ? [sections[0]._id] : []);
  const subsectionDetailsRef = useRef(false); // To store details of subsections when fetched, to avoid refetching
  const [subsections, setSubSections] = useState([]);
  const demoSubsection = [
    {
      sectionId: "1",
      _id: "1",
      title: "Lecture 1: Introduction to React",
      content:
        "This lecture covers the basics of React, including components, state, and props.",
    },
  ];
  async function loadSections(sectionId,isExpanded) {
    if (isExpanded) {
      setExpandedSection(prev => [...prev,sectionId]);
      const res = await getAllSubsections(sectionId);
      setSubSections(res.subsections);
    }else{
      setExpandedSection(prev => prev.filter(s => s !== sectionId));
    }
  }
  useEffect(() => {
    if (!courseId) {
      dispatch(setStep(1));
    }
  }, [courseId]);

  const [editingLecture, setEditingLecture] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleAddSection = async () => {
    if (!sectionName.trim()) {
      toast.error("Section name cannot be empty");
      return;
    }
    const newSection = {
      _id: Date.now().toString(),
      name: sectionName.trim(),
      subSection: [],
    };
    const res = await createSection({ courseId, sectionName: newSection.name });
    const updated = [...sections, res.section];
    setSections(updated);
    setExpandedSection(newSection._id);
    setSectionName("");
  };

  useEffect(() => {
    const fetchCourseSection = async () => {
      if (courseId) {
        const res = await fetchCourseSections({ courseId });
        setSections(res.sections || []);
        // console.log("Fetched sections for course:", sections);
      }
    };
    fetchCourseSection();
  }, [courseId]);
  const handleDeleteSection = async (sectionId) => {
    await deleteSection({ sectionId });
    setSections((prev) => prev.filter((s) => s._id !== sectionId));
    if (expandedSection === sectionId) setExpandedSection(null);
  };

  const handleSectionUpdate = async (sectionId) => {
    await updateSection({ sectionId, sectionName: editingSection.editingName });
    setEditingSection({ sectionId: null, isEditing: false, editingName: "" });
    setSections((prev) =>
      prev.map((s) =>
        s._id === sectionId ? { ...s, name: editingSection.editingName } : s,
      ),
    );
  };
  const handleDeleteLecture = async (sectionId, lectureId) => {
    await removeSubsection(lectureId);
    setSubSections((prev) => prev.filter((l) => l._id !== lectureId));
  };
  const handleUpdateSubsection = async (subsectionId, lectureData) => {
    setSubSections((sub) => [
      { ...lectureData, _id: subsectionId },
      ...sub.filter((l) => l._id !== subsectionId),
    ]);
    const { title, description, isPreview } = lectureData;
    const res = await updateSubsection(subsectionId, {
      title,
      description,
      isPreview,
    });
    setShowModal(false);
    setEditingLecture(null);
  };
  const getSubSectionDetails = async (subsectionId) => {
    const res = await getSubsectionDetails(subsectionId);
    setEditingLecture({
      ...editingLecture,
      ...res.subsection,
      videoURL: res.link,
      isEditing: true,
    });
    console.log(res.link);
    // return res.subsection;
  };
  useEffect(() => {
    if (
      editingLecture &&
      !editingLecture.isNew &&
      !subsectionDetailsRef.current
    ) {
      subsectionDetailsRef.current = true; // Mark as fetched to prevent future refetches
      console.log("Fetching details for lecture", editingLecture);
      getSubSectionDetails(editingLecture._id);
    }
  }, [editingLecture]);
  const handleNext = () => {
    if (sections.length === 0) {
      toast.error("Add at least one section");
      return;
    }
    dispatch(setCourse({ ...course, sections }));
    dispatch(setStep(3));
  };

  return (
    <>
      {/* Card */}
      <div className="bg-[#161D29] rounded-xl p-6 flex flex-col gap-5">
        <h2 className="text-xl font-bold text-white">Course Builder</h2>

        {/* Sections list */}
        {sections.map((section) => (
          <div
            key={section._id}
            className="rounded-lg overflow-hidden border border-[#2C333F]"
          >
            {/* Section row */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#2C333F]">
              <div className="flex items-center gap-3">
                <span className="text-[#838894] text-base">☰</span>
                {editingSection?.isEditing &&
                editingSection.sectionId === section._id ? (
                  <input
                    type="text"
                    value={editingSection.editingName}
                    onChange={(e) =>
                      setEditingSection({
                        ...editingSection,
                        editingName: e.target.value,
                      })
                    }
                    className="bg-[#2C333F] text-white placeholder:text-[#838894] border border-[#838894] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                ) : (
                  <span className="text-white font-semibold text-sm">
                    {section.name}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {!editingSection.isEditing ? (
                  <button
                    className="p-1.5 text-[#838894] hover:text-white transition-colors"
                    onClick={() =>
                      setEditingSection({
                        sectionId: section._id,
                        isEditing: true,
                        editingName: section.name,
                      })
                    }
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                ) : (
                  editingSection.isEditing &&
                  editingSection.sectionId === section._id && (
                    <button
                      className="p-1.5 text-[#838894] hover:text-green-400 transition-colors"
                      onClick={() => handleSectionUpdate(section._id)}
                    >
                      <CheckIcon className="w-4 h-4" />
                    </button>
                  )
                )}
                <button
                  onClick={() => handleDeleteSection(section._id)}
                  className="p-1.5 text-[#838894] hover:text-red-400 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => loadSections(section._id, !expandedSection.includes(section._id))}
                  className="p-1.5 text-[#838894] hover:text-white transition-colors"
                >
                  {expandedSection.includes(section._id) ? (
                    <ChevronUpIcon className="w-4 h-4" />
                  ) : (
                    <ChevronDownIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Expanded: lectures */}
            {expandedSection.includes(section._id) && (
              <div className="bg-[#161D29] flex flex-col">
                {subsections
                  .filter((s) => s.sectionId === section._id)
                  ?.map((lecture) => (
                    <div
                      key={lecture._id}
                      className="flex items-center justify-between px-8 py-2.5 border-b border-[#2C333F] last:border-b-0"
                    >
                      <div className="flex items-center gap-3 text-sm text-[#AFB2BF]">
                        <span className="text-[#838894]">☰</span>
                        <span>{lecture.title}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingLecture({
                              ...lecture,
                              sectionId: section._id,
                              courseId,
                              isEditing: true,
                            });
                            setShowModal(true);
                          }}
                          className="p-1.5 text-[#838894] hover:text-white transition-colors"
                        >
                          <PencilIcon className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteLecture(section._id, lecture._id)
                          }
                          className="p-1.5 text-[#838894] hover:text-red-400 transition-colors"
                        >
                          <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                {/* Add Lecture */}
                <div className="flex justify-start">
                  <button
                    onClick={() => {
                      setEditingLecture({
                        sectionId: section._id,
                        isNew: true,
                        courseId,
                      });
                      setShowModal(true);
                    }}
                    className="flex items-center gap-2 pl-8 py-3 text-[#FFD60A] text-sm font-medium hover:text-yellow-300 transition-colors w-fit"
                  >
                    <VscAdd />
                    Add Lecture
                  </button>
                  <button
                    onClick={() => {
                      setEditingLecture({
                        sectionId: section._id,
                        isNew: true,
                        courseId,
                      });
                      setShowModal(true);
                    }}
                    className="flex items-center gap-2 px-5 py-3 text-[#75e033] text-sm font-medium transition-colors w-fit"
                  >
                    <VscAdd />
                    Add Material
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add section input */}
        <input
          type="text"
          value={sectionName}
          onChange={(e) => setSectionName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddSection()}
          placeholder="Add a section to build your course"
          className="w-full px-4 py-3 rounded-lg bg-[#2C333F] border border-transparent text-white placeholder-[#838894] text-sm focus:outline-none focus:border-[#FFD60A] transition-colors"
        />

        {/* Create Section button */}
        <button
          type="button"
          onClick={handleAddSection}
          className="flex items-center gap-2 w-fit px-5 py-2.5 border border-[#FFD60A] text-[#FFD60A] rounded-lg hover:bg-[#FFD60A] hover:text-black transition-all text-sm font-medium"
        >
          <VscAdd />
          Create Section
        </button>
      </div>

      {/* Back / Next — outside card, centered at bottom like Figma */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          type="button"
          onClick={() => {
            if (courseId) setSearchParams({ courseId: courseId });
            dispatch(setStep(1));
          }}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-[#424854] text-white bg-[#1D2532] hover:bg-[#2C333F] transition-colors text-sm font-medium"
        >
          <VscChevronLeft />
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="flex items-center gap-2 px-8 py-2.5 bg-[#FFD60A] text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors text-sm"
        >
          Next
          <VscChevronRight />
        </button>
      </div>

      {/* Edit Lecture Modal */}
      {showModal && (
        <EditLectureModal
          lecture={editingLecture}
          onClose={() => {
            setShowModal(false);
            setEditingLecture(null);
            subsectionDetailsRef.current = false;
          }}
          onSave={handleUpdateSubsection}
        />
      )}
    </>
  );
};

export default CourseBuilderForm;
