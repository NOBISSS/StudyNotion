import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { MdCloudUpload, MdClose, MdEdit, MdDelete, MdInsertDriveFile,
         MdVideoFile, MdAudioFile, MdImage, MdPictureAsPdf } from 'react-icons/md';
import { VscChevronRight } from 'react-icons/vsc';
import { addMaterial, updateMaterial } from '../../../../services/operations/MaterialAPI';
import { useS3Upload } from '../../../../hooks/UseS3Upload.js';

// ─── Constants ────────────────────────────────────────────────────────────────
const MATERIAL_TYPES = ['video', 'audio', 'pdf', 'image', 'document', 'other'];

const ACCEPTED_TYPES = {
    video:    'video/*',
    audio:    'audio/*',
    pdf:      'application/pdf',
    image:    'image/*',
    document: '.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt',
    other:    '*',
};

const TYPE_ICONS = {
    video:    MdVideoFile,
    audio:    MdAudioFile,
    pdf:      MdPictureAsPdf,
    image:    MdImage,
    document: MdInsertDriveFile,
    other:    MdInsertDriveFile,
};

// Guess material type from file MIME
const guessMaterialType = (file) => {
    if (!file) return 'other';
    if (file.type.startsWith('video/'))       return 'video';
    if (file.type.startsWith('audio/'))       return 'audio';
    if (file.type === 'application/pdf')      return 'pdf';
    if (file.type.startsWith('image/'))       return 'image';
    if (file.type.includes('document') || file.type.includes('presentation') ||
        file.type.includes('sheet') || file.type.includes('text'))
        return 'document';
    return 'other';
};

const formatBytes = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024)         return `${bytes} B`;
    if (bytes < 1024 ** 2)   return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function TypeIcon({ type, className = '' }) {
    const Icon = TYPE_ICONS[type] || MdInsertDriveFile;
    return <Icon className={className} />;
}

function ProgressBar({ progress }) {
    return (
        <div className="w-full bg-[#2C333F] rounded-full h-1.5 overflow-hidden">
            <div
                className="h-full bg-[#FFD60A] rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
const AddMaterialModal = ({ isOpen, onClose, courseId, sectionId, onSuccess, editData = null }) => {
    const { uploadToS3, uploading, uploadProgress } = useS3Upload();

    const isEditMode = Boolean(editData?.subsectionId);

    // ── Form state ────────────────────────────────────────────────────────
    const [title, setTitle]               = useState('');
    const [description, setDescription]   = useState('');
    const [materialType, setMaterialType] = useState('video');
    const [file, setFile]                 = useState(null);  // File object
    const [dragOver, setDragOver]         = useState(false);
    const [submitting, setSubmitting]     = useState(false);

    const fileInputRef = useRef(null);

    // ── Pre-fill for edit mode ────────────────────────────────────────────
    useEffect(() => {
        if (isEditMode && editData) {
            setTitle(editData.title || '');
            setDescription(editData.description || '');
            setMaterialType(editData.materialType || 'video');
            setFile(null); // user re-uploads if they want to change the file
        } else {
            setTitle('');
            setDescription('');
            setMaterialType('video');
            setFile(null);
        }
    }, [editData, isEditMode, isOpen]);

    // ── Lock body scroll while open ───────────────────────────────────────
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else        document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    // ── File handling ─────────────────────────────────────────────────────
    const handleFileSelect = (selectedFile) => {
        if (!selectedFile) return;
        setFile(selectedFile);
        // Auto-detect type from the file
        setMaterialType(guessMaterialType(selectedFile));
        // Auto-fill title if empty
        if (!title) {
            const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, '');
            setTitle(nameWithoutExt);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) handleFileSelect(dropped);
    };

    // ── Validate ──────────────────────────────────────────────────────────
    const validate = () => {
        if (!title.trim()) { toast.error('Title is required'); return false; }
        if (!isEditMode && !file) { toast.error('Please select a file'); return false; }
        if (!courseId)   { toast.error('Course ID is missing'); return false; }
        if (!sectionId)  { toast.error('Section ID is missing'); return false; }
        return true;
    };

    // ── Submit ────────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (!validate()) return;
        setSubmitting(true);

        try {
            if (isEditMode) {
                // ── EDIT: only upload file if user picked a new one ──────
                let s3Key        = editData.materialS3Key;
                let materialSize = editData.materialSize;

                if (file) {
                    const uploaded = await uploadToS3(file);
                    if (!uploaded) { setSubmitting(false); return; }
                    s3Key        = uploaded.key;
                    materialSize = uploaded.size;
                }

                const payload = {
                    title:        title.trim(),
                    description:  description.trim(),
                    materialType,
                    ...(s3Key        && { materialS3Key: s3Key }),
                    ...(materialSize && { materialSize }),
                };

                const result = await updateMaterial(editData.subsectionId, payload);
                if (result) {
                    onSuccess?.(result);
                    onClose();
                }

            } else {
                // ── CREATE: upload file first, then create material ───────
                const uploaded = await uploadToS3(file);
                if (!uploaded) { setSubmitting(false); return; }

                const payload = {
                    title:         title.trim(),
                    description:   description.trim(),
                    courseId,
                    sectionId,
                    materialType,
                    materialSize:  uploaded.size,
                    materialS3Key: uploaded.key,
                };

                const result = await addMaterial(payload);
                if (result) {
                    onSuccess?.(result);
                    onClose();
                }
            }
        } finally {
            setSubmitting(false);
        }
    };

    const isBusy = uploading || submitting;

    // ── Render ────────────────────────────────────────────────────────────
    return (
        // Backdrop
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => { if (e.target === e.currentTarget && !isBusy) onClose(); }}
        >
            {/* Modal Panel */}
            <div className="w-full max-w-lg bg-[#1E2636] rounded-2xl border border-[#2C3244] shadow-2xl flex flex-col overflow-hidden"
                 style={{ maxHeight: '90vh' }}>

                {/* ── Header ─────────────────────────────────────────────── */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#2C3244]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#FFD60A]/10 flex items-center justify-center">
                            {isEditMode
                                ? <MdEdit className="text-[#FFD60A] text-base" />
                                : <MdCloudUpload className="text-[#FFD60A] text-base" />
                            }
                        </div>
                        <div>
                            <h2 className="text-white font-semibold text-[15px]">
                                {isEditMode ? 'Edit Material' : 'Add Material'}
                            </h2>
                            <p className="text-[#6B7280] text-[11px]">
                                {isEditMode ? "Update this material\u2019s details" : 'Upload a file to this section'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isBusy}
                        className="text-[#6B7280] hover:text-white transition-colors disabled:opacity-40 p-1 rounded-lg hover:bg-[#2C333F]"
                    >
                        <MdClose className="text-xl" />
                    </button>
                </div>

                {/* ── Scrollable Body ─────────────────────────────────────── */}
                <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

                    {/* File Drop Zone */}
                    <div>
                        <label className="text-sm font-medium text-white block mb-1.5">
                            File {!isEditMode && <sup className="text-pink-400">*</sup>}
                        </label>
                        <div
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            onClick={() => !isBusy && fileInputRef.current?.click()}
                            className={`
                                relative cursor-pointer rounded-xl border-2 border-dashed
                                flex flex-col items-center justify-center gap-2 py-7 px-4
                                transition-all duration-200
                                ${dragOver
                                    ? 'border-[#FFD60A] bg-[#FFD60A]/5'
                                    : file
                                        ? 'border-[#47A992] bg-[#47A992]/5'
                                        : 'border-[#424854] bg-[#2C333F] hover:border-[#FFD60A]/50'
                                }
                                ${isBusy ? 'pointer-events-none opacity-60' : ''}
                            `}
                        >
                            {uploading ? (
                                // Upload progress state
                                <div className="w-full flex flex-col items-center gap-3 px-4">
                                    <TypeIcon type={materialType} className="text-3xl text-[#FFD60A]" />
                                    <p className="text-white text-sm font-medium">{file?.name}</p>
                                    <div className="w-full">
                                        <ProgressBar progress={uploadProgress} />
                                        <p className="text-[#AFB2BF] text-xs mt-1.5 text-center">
                                            Uploading… {uploadProgress}%
                                        </p>
                                    </div>
                                </div>
                            ) : file ? (
                                // File selected state
                                <div className="flex flex-col items-center gap-2">
                                    <TypeIcon type={materialType} className="text-3xl text-[#47A992]" />
                                    <p className="text-white text-sm font-medium text-center max-w-[280px] truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-[#6B7280] text-xs">{formatBytes(file.size)}</p>
                                    <p className="text-[#FFD60A] text-xs font-medium">Click to change</p>
                                </div>
                            ) : isEditMode ? (
                                // Edit mode — no new file yet
                                <div className="flex flex-col items-center gap-2">
                                    <TypeIcon type={materialType} className="text-3xl text-[#6B7280]" />
                                    <p className="text-[#AFB2BF] text-sm">Current file kept</p>
                                    <p className="text-[#FFD60A] text-xs font-medium">
                                        Click or drag to replace
                                    </p>
                                </div>
                            ) : (
                                // Empty state
                                <>
                                    <div className="w-12 h-12 rounded-full bg-[#1D2532] flex items-center justify-center">
                                        <MdCloudUpload className="text-2xl text-[#FFD60A]" />
                                    </div>
                                    <p className="text-[#AFB2BF] text-sm text-center">
                                        Drag & drop a file, or{' '}
                                        <span className="text-[#FFD60A] font-medium">Browse</span>
                                    </p>
                                    <p className="text-[#6B7280] text-xs">
                                        Video, PDF, Audio, Image, Document…
                                    </p>
                                </>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={ACCEPTED_TYPES[materialType] || '*'}
                            className="hidden"
                            onChange={(e) => handleFileSelect(e.target.files[0])}
                        />
                    </div>

                    {/* Material Type */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-white">
                            Material Type <sup className="text-pink-400">*</sup>
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {MATERIAL_TYPES.map((type) => {
                                const Icon = TYPE_ICONS[type] || MdInsertDriveFile;
                                const active = materialType === type;
                                return (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setMaterialType(type)}
                                        className={`
                                            flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium
                                            transition-all duration-150 capitalize
                                            ${active
                                                ? 'border-[#FFD60A] bg-[#FFD60A]/10 text-[#FFD60A]'
                                                : 'border-[#2C3244] bg-[#2C333F] text-[#AFB2BF] hover:border-[#AFB2BF]/40'
                                            }
                                        `}
                                    >
                                        <Icon className="text-base flex-shrink-0" />
                                        {type}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-white">
                            Title <sup className="text-pink-400">*</sup>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Introduction to Node.js"
                            disabled={isBusy}
                            className="w-full px-4 py-3 rounded-lg bg-[#2C333F] border border-transparent text-white placeholder-[#838894] text-sm focus:outline-none focus:border-[#FFD60A] transition-colors disabled:opacity-50"
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-white">
                            Description
                            <span className="text-[#6B7280] font-normal ml-1">(optional)</span>
                        </label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description of this material…"
                            disabled={isBusy}
                            className="w-full px-4 py-3 rounded-lg bg-[#2C333F] border border-transparent text-white placeholder-[#838894] text-sm focus:outline-none focus:border-[#FFD60A] transition-colors resize-none disabled:opacity-50"
                        />
                    </div>
                </div>

                {/* ── Footer ─────────────────────────────────────────────── */}
                <div className="px-6 py-4 border-t border-[#2C3244] flex items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isBusy}
                        className="px-5 py-2.5 text-sm font-medium text-[#AFB2BF] border border-[#2C3244] rounded-lg hover:bg-[#2C333F] transition-colors disabled:opacity-40"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isBusy}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#FFD60A] text-black font-semibold text-sm rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] justify-center"
                    >
                        {uploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                Uploading…
                            </>
                        ) : submitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                Saving…
                            </>
                        ) : isEditMode ? (
                            'Save Changes'
                        ) : (
                            <>Add Material <VscChevronRight /></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddMaterialModal;