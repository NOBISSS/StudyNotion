// components/core/Dashboard/AddCourse/MaterialList.jsx
//
// Drop this inside your SectionBuilder / CourseBuilder wherever you render
// a section's content list. It manages the modal open/close state locally.
//
// Props:
//   courseId   : string
//   sectionId  : string
//   materials  : Array<{ subsectionId, title, description, materialType, materialSize, materialS3Key }>
//   onChange   : (updatedMaterials: array) => void  — parent updates its local state

import { useState } from 'react';
import { MdAdd, MdEdit, MdDelete, MdVideoFile, MdAudioFile,
         MdPictureAsPdf, MdImage, MdInsertDriveFile, MdLock } from 'react-icons/md';
import AddMaterialModal from './AddMaterialModal';
import DeleteMaterialModal from './DeleteMaterialModal';

const TYPE_ICONS = {
    video:    MdVideoFile,
    audio:    MdAudioFile,
    pdf:      MdPictureAsPdf,
    image:    MdImage,
    document: MdInsertDriveFile,
    other:    MdInsertDriveFile,
};

const formatBytes = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

const MaterialList = ({ courseId, sectionId, materials = [], onChange }) => {
    const [addOpen, setAddOpen]       = useState(false);
    const [editTarget, setEditTarget] = useState(null);  // material object | null
    const [deleteTarget, setDeleteTarget] = useState(null); // material object | null

    const handleAddSuccess = (newMaterial) => {
        onChange?.([...materials, newMaterial.material ?? newMaterial]);
    };

    const handleEditSuccess = (updatedMaterial) => {
        onChange?.(materials.map((m) =>
            m.subsectionId === updatedMaterial._id || m.subsectionId === updatedMaterial.subsectionId
                ? { ...m, ...updatedMaterial }
                : m
        ));
    };

    const handleDeleteSuccess = () => {
        onChange?.(materials.filter((m) => m.subsectionId !== deleteTarget?.subsectionId));
        setDeleteTarget(null);
    };

    return (
        <div className="flex flex-col gap-2">
            {/* Material rows */}
            {materials.map((mat) => {
                const Icon = TYPE_ICONS[mat.materialType] || MdInsertDriveFile;
                return (
                    <div
                        key={mat.subsectionId || mat._id}
                        className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[#161D29] border border-[#2C3244] group"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-[#2C333F] flex items-center justify-center flex-shrink-0">
                                <Icon className="text-[#FFD60A] text-base" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-white text-sm font-medium truncate">{mat.title}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[#6B7280] text-xs capitalize">{mat.materialType}</span>
                                    {mat.materialSize && (
                                        <span className="text-[#6B7280] text-xs">· {formatBytes(mat.materialSize)}</span>
                                    )}
                                    {/* Lock badge — visible to enrolled users only */}
                                    <span className="flex items-center gap-0.5 text-[10px] text-[#6B7280]">
                                        <MdLock className="text-[10px]" /> Gated
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions — visible on hover */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <button
                                onClick={() => setEditTarget(mat)}
                                className="p-2 rounded-lg hover:bg-[#2C333F] text-[#AFB2BF] hover:text-[#FFD60A] transition-colors"
                                title="Edit"
                            >
                                <MdEdit className="text-base" />
                            </button>
                            <button
                                onClick={() => setDeleteTarget(mat)}
                                className="p-2 rounded-lg hover:bg-[#2C333F] text-[#AFB2BF] hover:text-red-400 transition-colors"
                                title="Delete"
                            >
                                <MdDelete className="text-base" />
                            </button>
                        </div>
                    </div>
                );
            })}

            {/* Add button */}
            <button
                onClick={() => setAddOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-[#2C3244] text-[#AFB2BF] text-sm hover:border-[#FFD60A]/50 hover:text-[#FFD60A] transition-all duration-150 mt-1"
            >
                <MdAdd className="text-lg" />
                Add Material
            </button>

            {/* ── Modals ────────────────────────────────────────────────── */}
            <AddMaterialModal
                isOpen={addOpen}
                onClose={() => setAddOpen(false)}
                courseId={courseId}
                sectionId={sectionId}
                onSuccess={handleAddSuccess}
            />

            <AddMaterialModal
                isOpen={Boolean(editTarget)}
                onClose={() => setEditTarget(null)}
                courseId={courseId}
                sectionId={sectionId}
                editData={editTarget}
                onSuccess={handleEditSuccess}
            />

            <DeleteMaterialModal
                isOpen={Boolean(deleteTarget)}
                onClose={() => setDeleteTarget(null)}
                subsectionId={deleteTarget?.subsectionId}
                materialName={deleteTarget?.title}
                onSuccess={handleDeleteSuccess}
            />
        </div>
    );
};

export default MaterialList;