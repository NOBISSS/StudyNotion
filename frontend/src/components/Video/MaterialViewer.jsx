import { useEffect, useState } from "react";
import { getMaterial } from "../../services/operations/MaterialAPI";
import { markSubsectionAsCompleted } from "../../services/operations/subsectionAPI";

const TYPE_MAP = {
  pdf: ["application/pdf", "pdf"],
  image: [
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "image/jfif",
  ],
  audio: ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/aac"],
  document: [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ],
};

function getMaterialType(mimeType) {
  //can be done same with s3Key because it has also extension
  // const extension = link?.split("?")[0].split(".").pop()?.toLowerCase();
  if (!mimeType) return "other";
  for (const [type, mimes] of Object.entries(TYPE_MAP)) {
    if (mimes.includes(mimeType)) return type;
  }
  return "other";
}

function formatFileSize(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Sub-viewers ────────────────────────────────────────────────────────────

function PdfViewer({ url }) {
  return (
    <iframe
      src={`${url}#toolbar=1&navpanes=1`}
      className="w-full h-full rounded-lg border-0"
      title="PDF Viewer"
    />
  );
}

function ImageViewer({ url, fileName }) {
  const [zoom, setZoom] = useState(1);
  return (
    <div className="w-full h-full flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))}
          className="px-3 py-1 rounded-lg bg-[#2C333F] text-[#AFB2BF] text-sm hover:bg-[#374151] transition-colors"
        >
          −
        </button>
        <span className="text-[#AFB2BF] text-sm min-w-[50px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.min(4, z + 0.25))}
          className="px-3 py-1 rounded-lg bg-[#2C333F] text-[#AFB2BF] text-sm hover:bg-[#374151] transition-colors"
        >
          +
        </button>
        <button
          onClick={() => setZoom(1)}
          className="px-3 py-1 rounded-lg bg-[#2C333F] text-[#AFB2BF] text-sm hover:bg-[#374151] transition-colors"
        >
          Reset
        </button>
      </div>
      <div className="flex-1 w-full overflow-auto flex items-center justify-center">
        <img
          src={url}
          alt={fileName}
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "center",
            transition: "transform 0.2s",
          }}
          className="max-w-full rounded-lg"
        />
      </div>
    </div>
  );
}

function AudioViewer({ url, fileName }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full max-w-lg bg-[#2C333F] rounded-2xl p-8 flex flex-col items-center gap-6 border border-white/[0.06]">
        {/* Waveform placeholder */}
        <div className="w-full flex items-end justify-center gap-1 h-16">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="w-1.5 rounded-full bg-[#FFD60A]/30"
              style={{
                height: `${20 + Math.sin(i * 0.8) * 14 + Math.random() * 12}px`,
              }}
            />
          ))}
        </div>
        <p className="text-white font-medium text-sm truncate max-w-full">
          {fileName}
        </p>
        <audio
          src={url}
          controls
          className="w-full"
          style={{ accentColor: "#FFD60A" }}
        />
      </div>
    </div>
  );
}

function DocumentViewer({ url, fileName, fileSize }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="bg-[#2C333F] rounded-2xl p-10 flex flex-col items-center gap-5 border border-white/[0.06] max-w-sm w-full">
        <div className="w-16 h-16 rounded-2xl bg-[#FFD60A]/10 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M8 4h12l8 8v16a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z"
              stroke="#FFD60A"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M20 4v8h8"
              stroke="#FFD60A"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M12 17h8M12 21h6"
              stroke="#FFD60A"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-white font-medium text-sm">{fileName}</p>
          {fileSize && (
            <p className="text-[#555f6e] text-xs mt-1">
              {formatFileSize(fileSize)}
            </p>
          )}
        </div>
        <p className="text-[#838894] text-xs text-center">
          This file type can't be previewed directly. Download it to view.
        </p>
        <a
          href={url}
          download={fileName}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFD60A] text-[#0f1117] text-sm font-semibold hover:bg-yellow-300 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 3v7M5 8l3 3 3-3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 12h10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Download file
        </a>
      </div>
    </div>
  );
}

function OtherViewer({ url, fileName, fileSize }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="bg-[#2C333F] rounded-2xl p-10 flex flex-col items-center gap-5 border border-white/[0.06] max-w-sm w-full">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.06] flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect
              x="4"
              y="4"
              width="24"
              height="24"
              rx="4"
              stroke="#838894"
              strokeWidth="1.5"
            />
            <path
              d="M12 16h8M16 12v8"
              stroke="#838894"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-white font-medium text-sm">{fileName}</p>
          {fileSize && (
            <p className="text-[#555f6e] text-xs mt-1">
              {formatFileSize(fileSize)}
            </p>
          )}
        </div>
        <a
          href={url}
          download={fileName}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2C333F] border border-white/10 text-[#AFB2BF] text-sm font-medium hover:bg-[#374151] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 3v7M5 8l3 3 3-3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 12h10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Download
        </a>
      </div>
    </div>
  );
}

// ── Loading skeleton ───────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-[#FFD60A]/30 border-t-[#FFD60A] animate-spin" />
        <p className="text-[#838894] text-sm">Loading material...</p>
      </div>
    </div>
  );
}

// ── Error state ────────────────────────────────────────────────────────────

function ErrorState({ onRetry }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center max-w-xs">
        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="#ef4444" strokeWidth="1.5" />
            <path
              d="M10 6v4M10 14h.01"
              stroke="#ef4444"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div>
          <p className="text-white text-sm font-medium">
            Failed to load material
          </p>
          <p className="text-[#838894] text-xs mt-1">
            Check your connection and try again
          </p>
        </div>
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-lg bg-[#2C333F] text-[#AFB2BF] text-sm hover:bg-[#374151] transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function MaterialViewer({
  setCompletedIds,
  materialSrc, // { subsectionId }
  setMaterialSrc,
  setLoadingMaterial,
  setActiveSub,
  isCompleted: propIsCompleted,
}) {
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState(null);
  const [error, setError] = useState(false);
  const [isCompleted, setIsCompleted] = useState(propIsCompleted);

  const loadMaterial = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getMaterial(materialSrc.subsectionId);
      if (materialSrc?.subsectionId && res) {
        setActiveSub((prev) => ({ ...prev, ...res }));
      }
      setMaterial({
        url: res.link,
        fileName: res?.materialName || "material",
        mimeType: res?.mimeType || null,
        fileSize: res?.materialSize || null,
        subSectionId: materialSrc.subsectionId,
        isCompleted: propIsCompleted,
      });
      setIsCompleted(false);
    } catch (err) {
      console.error("MATERIAL FETCH ERROR:", err);
      setError(true);
      setMaterialSrc(null);
    } finally {
      setLoading(false);
      setLoadingMaterial(false);
    }
  };

  useEffect(() => {
    if (materialSrc?.subsectionId) loadMaterial();
  }, [materialSrc?.subsectionId]);

  // Mark as completed on load for non-interactive materials
  // (documents, images, audio) — viewing = completing
  useEffect(() => {
    if (!material || isCompleted) return;
    setType(getMaterialType(material.mimeType));
    // PDFs — give them 3 seconds of "reading" time before auto-marking
    // For others, mark immediately on view
    const delay = type === "pdf" ? 3000 : 1000;

    const timer = setTimeout(async () => {
      if (!propIsCompleted) {
        await markSubsectionAsCompleted(material.subSectionId, true);
        setIsCompleted(true);
        setCompletedIds((prev) => new Set(prev).add(material.subSectionId));
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [material, isCompleted, propIsCompleted, setCompletedIds, type]);

  const handleToggleComplete = async () => {
    if (!material) return;
    const next = !isCompleted;
    await markSubsectionAsCompleted(material.subSectionId, next);
    setIsCompleted(next);
    setCompletedIds((prev) => {
      const s = new Set(prev);
      next ? s.add(material.subSectionId) : s.delete(material.subSectionId);
      return s;
    });
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState onRetry={loadMaterial} />;
  if (!material) return null;

  return (
    <div className="w-full h-full flex flex-col gap-3">
      {/* Top bar — filename + completion toggle */}
      {/* <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#1D2532] border border-white/[0.06] flex-shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <TypeBadge type={type} />
          <span className="text-white text-sm font-medium truncate">
            {material.fileName}
          </span>
          {material.fileSize && (
            <span className="text-[#555f6e] text-xs flex-shrink-0">
              {formatFileSize(material.fileSize)}
            </span>
          )}
        </div>
        <button
          onClick={handleToggleComplete}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 transition-all ${
            isCompleted
              ? "bg-green-500/15 text-green-400 border border-green-500/25"
              : "bg-white/[0.06] text-[#838894] border border-white/10 hover:border-white/20"
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6l3 3 5-5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {isCompleted ? "Completed" : "Mark complete"}
        </button>
      </div> */}

      {/* Viewer area */}
      <div className="flex-1 min-h-0 rounded-xl overflow-hidden bg-[#0D1117] border border-white/[0.06]">
        {type === "pdf" && <PdfViewer url={material.url} />}
        {type === "image" && (
          <ImageViewer url={material.url} fileName={material.fileName} />
        )}
        {type === "audio" && (
          <AudioViewer url={material.url} fileName={material.fileName} />
        )}
        {(type === "document" || type === "other") && (
          <DocumentViewer
            url={material.url}
            fileName={material.fileName}
            fileSize={material.fileSize}
          />
        )}
        {/* {type === "other" && (
          <OtherViewer
            url={material.url}
            fileName={material.fileName}
            fileSize={material.fileSize}
          />
        )} */}
      </div>
    </div>
  );
}

// ── Type badge ─────────────────────────────────────────────────────────────

function TypeBadge({ type }) {
  const config = {
    pdf: { label: "PDF", bg: "bg-red-500/15", text: "text-red-400" },
    image: { label: "Image", bg: "bg-blue-500/15", text: "text-blue-400" },
    audio: { label: "Audio", bg: "bg-purple-500/15", text: "text-purple-400" },
    document: {
      label: "Document",
      bg: "bg-cyan-500/15",
      text: "text-cyan-400",
    },
    other: { label: "File", bg: "bg-white/[0.06]", text: "text-[#838894]" },
  };
  const { label, bg, text } = config[type] ?? config.other;
  return (
    <span
      className={`px-2 py-0.5 rounded-md text-[11px] font-medium flex-shrink-0 ${bg} ${text}`}
    >
      {label}
    </span>
  );
}
