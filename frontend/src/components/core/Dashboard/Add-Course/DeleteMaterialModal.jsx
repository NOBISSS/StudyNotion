// components/core/Dashboard/AddCourse/DeleteMaterialModal.jsx
//
// Props:
//   isOpen       : boolean
//   onClose      : () => void
//   subsectionId : string     — the subsection._id to delete
//   materialName : string     — displayed in the confirmation text
//   onSuccess    : () => void — called after successful deletion

import { useState } from 'react';
import { MdDelete, MdClose, MdWarning } from 'react-icons/md';
import { deleteMaterial } from '../../../../services/operations/MaterialAPI';

const DeleteMaterialModal = ({ isOpen, onClose, subsectionId, materialName, onSuccess }) => {
    const [deleting, setDeleting] = useState(false);

    if (!isOpen) return null;

    const handleDelete = async () => {
        setDeleting(true);
        const success = await deleteMaterial(subsectionId);
        setDeleting(false);
        if (success) {
            onSuccess?.();
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => { if (e.target === e.currentTarget && !deleting) onClose(); }}
        >
            <div className="w-full max-w-sm bg-[#1E2636] rounded-2xl border border-[#2C3244] shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#2C3244]">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                            <MdDelete className="text-red-400 text-base" />
                        </div>
                        <h2 className="text-white font-semibold text-[15px]">Delete Material</h2>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={deleting}
                        className="text-[#6B7280] hover:text-white transition-colors p-1 rounded-lg hover:bg-[#2C333F] disabled:opacity-40"
                    >
                        <MdClose className="text-xl" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-6 flex flex-col gap-4">
                    <div className="flex gap-3 items-start p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
                        <MdWarning className="text-red-400 text-lg mt-0.5 flex-shrink-0" />
                        <p className="text-[#AFB2BF] text-sm leading-relaxed">
                            This will permanently delete{' '}
                            <span className="text-white font-medium">
                                "{materialName || 'this material'}"
                            </span>{' '}
                            and remove the file from storage. This action{' '}
                            <span className="text-red-400 font-medium">cannot be undone</span>.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-5 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={deleting}
                        className="px-5 py-2.5 text-sm font-medium text-[#AFB2BF] border border-[#2C3244] rounded-lg hover:bg-[#2C333F] transition-colors disabled:opacity-40"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-400 text-white font-semibold text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px] justify-center"
                    >
                        {deleting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Deleting…
                            </>
                        ) : (
                            <><MdDelete className="text-base" /> Delete</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteMaterialModal;