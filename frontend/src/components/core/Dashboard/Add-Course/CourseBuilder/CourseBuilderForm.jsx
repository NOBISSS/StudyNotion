import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { VscAdd, VscChevronLeft, VscChevronRight } from "react-icons/vsc";
import { MdInsertDriveFile, MdVideoFile, MdAudioFile,
         MdPictureAsPdf, MdImage, MdEdit, MdDelete } from "react-icons/md";
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
import AddMaterialModal from "../AddMaterialModal";
import DeleteMaterialModal from "../DeleteMaterialModal";

// ─── Material type → icon map ─────────────────────────────────────────────────
const TYPE_ICONS = {
  video:    MdVideoFile,
  audio:    MdAudioFile,
  pdf:      MdPictureAsPdf,
  image:    MdImage,
  document: MdInsertDriveFile,
  other:    MdInsertDriveFile,
};

function MaterialIcon({ type }) {
  const Icon = TYPE_ICONS[type] || MdInsertDriveFile;
  return <Icon className="text-[#FFD60A] text-sm flex-shrink-0" />;
}

const CourseBuilderForm = ({ courseId }) => {
  const dispatch = useDispatch();
  const { course } = useSelector((state) => state.course);
  const [, setSearchParams] = useSearchParams();

  const [sectionName, setSectionName] = useState("");
  const [sections, setSections] = useState(course?.sections || []);

  // expandedSections: Set of sectionIds currently open
  const [expandedSections, setExpandedSections] = useState(new Set());

  // subsections stored as { [sectionId]: [...subsections] }
  const [subsectionMap, setSubsectionMap] = useState({});

  // materials stored as { [sectionId]: [...materials] }
  const [materialMap, setMaterialMap] = useState({});

  const [editingSection, setEditingSection] = useState({
    sectionId: null,
    isEditing: false,
    editingName: "",
  });

  // ── Lecture modal state ──────────────────────────────────────────────────
  const [editingLecture, setEditingLecture] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ── Material modal state ─────────────────────────────────────────────────
  const [materialModal, setMaterialModal] = useState({
    open: false,
    sectionId: null,
    editData: null,   // null = add mode; object = edit mode
  });
  const [deleteMaterialModal, setDeleteMaterialModal] = useState({
    open: false,
    subsectionId: null,
    materialName: "",
    sectionId: null,
  });

  // Tracks which sections have already been fetched so we don't re-fetch on re-open
  const fetchedSections = useRef(new Set());

  // ── Redirect if no courseId ──────────────────────────────────────────────
  useEffect(() => {
    if (!courseId) dispatch(setStep(1));
  }, [courseId]);

  // ── Initial section fetch ────────────────────────────────────────────────
  useEffect(() => {
    const fetchSections = async () => {
      if (!courseId) return;
      const res = await fetchCourseSections({ courseId });
      setSections(res?.sections || []);
    };
    fetchSections();
  }, [courseId]);

  // ── Toggle section accordion ─────────────────────────────────────────────
  const toggleSection = useCallback(
    async (sectionId) => {
      const isCurrentlyOpen = expandedSections.has(sectionId);

      if (isCurrentlyOpen) {
        setExpandedSections((prev) => {
          const next = new Set(prev);
          next.delete(sectionId);
          return next;
        });
        return;
      }

      // Open — fetch subsections only if not fetched before
      setExpandedSections((prev) => new Set([...prev, sectionId]));

      if (!fetchedSections.current.has(sectionId)) {
        fetchedSections.current.add(sectionId);
        const res = await getAllSubsections(sectionId);
        const subs = (res?.subsections || []).map((s) => ({ ...s, sectionId }));
        // Separate lectures from materials by contentType
        const lectures  = subs.filter((s) => s.contentType !== "material");
        const materials = subs.filter((s) => s.contentType === "material");
        setSubsectionMap((prev) => ({ ...prev, [sectionId]: lectures }));
        setMaterialMap((prev)   => ({ ...prev, [sectionId]: materials }));
      }
    },
    [expandedSections],
  );

  // ── Section CRUD ─────────────────────────────────────────────────────────
  const handleAddSection = async () => {
    if (!sectionName.trim()) { toast.error("Section name cannot be empty"); return; }
    const res = await createSection({ courseId, sectionName: sectionName.trim() });
    if (!res?.section) return;
    setSections((prev) => [...prev, res.section]);
    setSubsectionMap((prev) => ({ ...prev, [res.section._id]: [] }));
    setMaterialMap((prev)   => ({ ...prev, [res.section._id]: [] }));
    fetchedSections.current.add(res.section._id);
    setExpandedSections((prev) => new Set([...prev, res.section._id]));
    setSectionName("");
  };

  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm("Delete this section and all its lectures?")) return;
    await deleteSection({ sectionId });
    setSections((prev) => prev.filter((s) => s._id !== sectionId));
    setSubsectionMap((prev) => { const n = { ...prev }; delete n[sectionId]; return n; });
    setMaterialMap((prev)   => { const n = { ...prev }; delete n[sectionId]; return n; });
    setExpandedSections((prev) => { const n = new Set(prev); n.delete(sectionId); return n; });
    fetchedSections.current.delete(sectionId);
  };

  const handleSectionUpdate = async (sectionId) => {
    const original = sections.find((s) => s._id === sectionId)?.name;
    if (editingSection.editingName === original) {
      toast.error("No changes detected");
      setEditingSection({ sectionId: null, isEditing: false, editingName: "" });
      return;
    }
    await updateSection({ sectionId, sectionName: editingSection.editingName });
    setSections((prev) =>
      prev.map((s) =>
        s._id === sectionId ? { ...s, name: editingSection.editingName } : s,
      ),
    );
    setEditingSection({ sectionId: null, isEditing: false, editingName: "" });
  };

  // ── Lecture CRUD ─────────────────────────────────────────────────────────
  const handleDeleteLecture = async (sectionId, lectureId) => {
    if (!window.confirm("Delete this lecture?")) return;
    await removeSubsection(lectureId);
    setSubsectionMap((prev) => ({
      ...prev,
      [sectionId]: (prev[sectionId] || []).filter((l) => l._id !== lectureId),
    }));
  };

  const handleUpdateSubsection = async (subsectionId, lectureData) => {
    const { title, description, isPreview } = lectureData;
    await updateSubsection(subsectionId, { title, description, isPreview });
    const sectionId = lectureData.sectionId;
    setSubsectionMap((prev) => ({
      ...prev,
      [sectionId]: (prev[sectionId] || []).map((l) =>
        l._id === subsectionId ? { ...l, title, description, isPreview } : l,
      ),
    }));
    closeModal();
  };

  const handleLectureCreated = (sectionId, newSubsection) => {
    setSubsectionMap((prev) => ({
      ...prev,
      [sectionId]: [...(prev[sectionId] || []), { ...newSubsection, sectionId }],
    }));
    closeModal();
  };

  // ── Lecture modal helpers ─────────────────────────────────────────────────
  const openEditModal = async (lecture) => {
    setEditingLecture({ ...lecture, isEditing: true });
    setShowModal(true);
    const res = await getSubsectionDetails(lecture._id);
    if (res?.subsection) {
      setEditingLecture((prev) => ({
        ...prev,
        ...res.subsection,
        videoURL: res.link || null,
        isEditing: true,
        sectionId: lecture.sectionId,
        courseId,
      }));
    }
  };

  const openAddModal = (sectionId) => {
    setEditingLecture({ sectionId, courseId, isNew: true, isEditing: false });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditingLecture(null); };

  // ── Material modal helpers ────────────────────────────────────────────────
  const openAddMaterial = (sectionId) => {
    setMaterialModal({ open: true, sectionId, editData: null });
  };

  const openEditMaterial = (sectionId, material) => {
    setMaterialModal({ open: true, sectionId, editData: material });
  };

  const closeMaterialModal = () => {
    setMaterialModal({ open: false, sectionId: null, editData: null });
  };

  // Called by AddMaterialModal after a successful add
  const handleMaterialAdded = (result) => {
    const sectionId = materialModal.sectionId;
    const newMaterial = result?.material ?? result;
    setMaterialMap((prev) => ({
      ...prev,
      [sectionId]: [...(prev[sectionId] || []), { ...newMaterial, sectionId }],
    }));
  };

  // Called by AddMaterialModal after a successful edit
  const handleMaterialUpdated = (updatedMaterial) => {
    const sectionId = materialModal.sectionId;
    setMaterialMap((prev) => ({
      ...prev,
      [sectionId]: (prev[sectionId] || []).map((m) =>
        // match on subsectionId or _id
        (m.subsectionId ?? m._id) === (updatedMaterial.subsectionId ?? updatedMaterial._id)
          ? { ...m, ...updatedMaterial }
          : m,
      ),
    }));
  };

  // Called by DeleteMaterialModal after successful delete
  const handleMaterialDeleted = () => {
    const { sectionId, subsectionId } = deleteMaterialModal;
    setMaterialMap((prev) => ({
      ...prev,
      [sectionId]: (prev[sectionId] || []).filter(
        (m) => (m.subsectionId ?? m._id) !== subsectionId,
      ),
    }));
    setDeleteMaterialModal({ open: false, subsectionId: null, materialName: "", sectionId: null });
  };

  // ── Next step ────────────────────────────────────────────────────────────
  const handleNext = () => {
    if (sections.length === 0) { toast.error("Add at least one section"); return; }
    dispatch(setCourse({ ...course, sections }));
    dispatch(setStep(3));
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="bg-[#161D29] rounded-xl p-6 flex flex-col gap-5">
        <h2 className="text-xl font-bold text-white">Course Builder</h2>

        {/* Empty state */}
        {sections.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 rounded-xl border border-dashed border-[#2C333F] text-[#6B7280] text-sm">
            No sections yet — add one below.
          </div>
        )}

        {/* Sections list */}
        {sections.map((section) => {
          const isOpen       = expandedSections.has(section._id);
          const isEditingThis = editingSection.isEditing && editingSection.sectionId === section._id;
          const lectures  = subsectionMap[section._id] || [];
          const materials = materialMap[section._id]   || [];

          return (
            <div key={section._id} className="rounded-lg overflow-hidden border border-[#2C333F]">

              {/* Section header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#2C333F]">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-[#838894] text-base flex-shrink-0">☰</span>
                  {isEditingThis ? (
                    <input
                      type="text"
                      value={editingSection.editingName}
                      onChange={(e) => setEditingSection((p) => ({ ...p, editingName: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter")  handleSectionUpdate(section._id);
                        if (e.key === "Escape") setEditingSection({ sectionId: null, isEditing: false, editingName: "" });
                      }}
                      autoFocus
                      className="flex-1 min-w-0 bg-[#1D2532] text-white border border-[#FFD60A] rounded px-2 py-1 text-sm focus:outline-none"
                    />
                  ) : (
                    <span className="text-white font-semibold text-sm truncate">{section.name}</span>
                  )}
                </div>

                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                  {isEditingThis ? (
                    <>
                      <button onClick={() => handleSectionUpdate(section._id)} className="p-1.5 text-[#838894] hover:text-green-400 transition-colors" title="Save">
                        <CheckIcon className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEditingSection({ sectionId: null, isEditing: false, editingName: "" })} className="p-1.5 text-[#838894] hover:text-red-400 transition-colors" title="Cancel">
                        <span className="text-sm">✕</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditingSection({ sectionId: section._id, isEditing: true, editingName: section.name })}
                      className="p-1.5 text-[#838894] hover:text-white transition-colors"
                      title="Rename section"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => handleDeleteSection(section._id)} className="p-1.5 text-[#838894] hover:text-red-400 transition-colors" title="Delete section">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                  <div className="w-px h-4 bg-[#374151] mx-0.5" />
                  <button onClick={() => toggleSection(section._id)} className="p-1.5 text-[#838894] hover:text-white transition-colors">
                    {isOpen ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded body */}
              {isOpen && (
                <div className="bg-[#0F1117] flex flex-col">

                  {/* ── Lectures ─────────────────────────────────────────── */}
                  {lectures.length === 0 && materials.length === 0 && (
                    <p className="px-8 py-3 text-xs text-[#4B5563] italic">
                      No content yet — add a lecture or material below.
                    </p>
                  )}

                  {lectures.map((lecture) => (
                    <div
                      key={lecture._id}
                      className="group flex items-center justify-between gap-3 px-8 py-2.5 border-b border-[#1C2333] last:border-b-0 hover:bg-[#161D29] transition-colors"
                    >
                      <div className="flex items-center gap-3 text-sm text-[#AFB2BF] flex-1 min-w-0">
                        <span className="text-[#6B7280] flex-shrink-0">☰</span>
                        <span className="truncate">{lecture.title}</span>
                        {lecture.isPreview && (
                          <span className="flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#FFD60A]/10 text-[#FFD60A]">
                            Preview
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button onClick={() => openEditModal({ ...lecture, sectionId: section._id })} className="p-1.5 text-[#838894] hover:text-white transition-colors" title="Edit lecture">
                          <PencilIcon className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteLecture(section._id, lecture._id)} className="p-1.5 text-[#838894] hover:text-red-400 transition-colors" title="Delete lecture">
                          <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* ── Materials ─────────────────────────────────────────── */}
                  {materials.map((material) => {
                    const matId = material.subsectionId ?? material._id;
                    return (
                      <div
                        key={matId}
                        className="group flex items-center justify-between gap-3 px-8 py-2.5 border-b border-[#1C2333] last:border-b-0 hover:bg-[#161D29] transition-colors"
                      >
                        <div className="flex items-center gap-3 text-sm text-[#AFB2BF] flex-1 min-w-0">
                          <MaterialIcon type={material.materialType} />
                          <span className="truncate">{material.title}</span>
                          {/* Badge to distinguish materials from lectures */}
                          <span className="flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#47A992]/10 text-[#47A992] capitalize">
                            {material.materialType || "material"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button
                            onClick={() => openEditMaterial(section._id, { ...material, subsectionId: matId })}
                            className="p-1.5 text-[#838894] hover:text-white transition-colors"
                            title="Edit material"
                          >
                            <PencilIcon className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteMaterialModal({
                                open: true,
                                subsectionId: matId,
                                materialName: material.title,
                                sectionId: section._id,
                              })
                            }
                            className="p-1.5 text-[#838894] hover:text-red-400 transition-colors"
                            title="Delete material"
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* ── Add lecture / Add material ────────────────────────── */}
                  <div className="flex items-center gap-2 px-6 py-2.5 border-t border-[#1C2333]">
                    <button
                      onClick={() => openAddModal(section._id)}
                      className="flex items-center gap-1.5 text-[#FFD60A] text-sm font-medium hover:text-yellow-300 transition-colors"
                    >
                      <VscAdd /> Add Lecture
                    </button>
                    <span className="text-[#2C333F]">|</span>
                    <button
                      onClick={() => openAddMaterial(section._id)}
                      className="flex items-center gap-1.5 text-[#4ade80] text-sm font-medium hover:text-green-400 transition-colors"
                    >
                      <VscAdd /> Add Material
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Add section input */}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSection()}
            placeholder="Add a section to build your course"
            className="w-full px-4 py-3 rounded-lg bg-[#2C333F] border border-transparent text-white placeholder-[#838894] text-sm focus:outline-none focus:border-[#FFD60A] transition-colors"
          />
          <button
            type="button"
            onClick={handleAddSection}
            className="flex items-center gap-2 w-fit px-5 py-2.5 border border-[#FFD60A] text-[#FFD60A] rounded-lg hover:bg-[#FFD60A] hover:text-black transition-all text-sm font-medium"
          >
            <VscAdd /> Create Section
          </button>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            type="button"
            onClick={() => { if (courseId) setSearchParams({ courseId }); dispatch(setStep(1)); }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-[#424854] text-white bg-[#1D2532] hover:bg-[#2C333F] transition-colors text-sm font-medium"
          >
            <VscChevronLeft /> Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-2.5 bg-[#FFD60A] text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors text-sm"
          >
            Next <VscChevronRight />
          </button>
        </div>
      </div>

      {/* ── Lecture modal ────────────────────────────────────────────────────── */}
      {showModal && editingLecture && (
        <EditLectureModal
          lecture={editingLecture}
          onClose={closeModal}
          onSave={handleUpdateSubsection}
          onCreated={handleLectureCreated}
        />
      )}

      {/* ── Add / Edit Material modal ────────────────────────────────────────── */}
      <AddMaterialModal
        isOpen={materialModal.open}
        onClose={closeMaterialModal}
        courseId={courseId}
        sectionId={materialModal.sectionId}
        editData={materialModal.editData}
        onSuccess={materialModal.editData ? handleMaterialUpdated : handleMaterialAdded}
      />

      {/* ── Delete Material confirmation modal ──────────────────────────────── */}
      <DeleteMaterialModal
        isOpen={deleteMaterialModal.open}
        onClose={() => setDeleteMaterialModal({ open: false, subsectionId: null, materialName: "", sectionId: null })}
        subsectionId={deleteMaterialModal.subsectionId}
        materialName={deleteMaterialModal.materialName}
        onSuccess={handleMaterialDeleted}
      />
    </>
  );
};

export default CourseBuilderForm;