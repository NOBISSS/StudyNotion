// components/core/Admin/CategoryManagement.jsx
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiCheck } from "react-icons/fi"
import { MdCategory } from "react-icons/md"
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../services/operations/adminAPI"

// ── Confirm Delete Modal ──────────────────────────────────────────────────
const ConfirmModal = ({ category, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
    <div className="w-full max-w-sm bg-[#1E2735] rounded-xl border border-[#2C333F] p-6">
      <h3 className="text-white font-semibold text-lg mb-2">Delete Category</h3>
      <p className="text-[#AFB2BF] text-sm mb-1">
        Are you sure you want to delete{" "}
        <span className="text-[#FFD60A] font-medium">"{category.name}"</span>?
      </p>
      <p className="text-[#6E727F] text-xs mb-6">
        All courses in this category will be moved to "Uncategorized".
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-lg border border-[#2C333F] text-[#AFB2BF] text-sm hover:bg-[#2C333F] transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-2.5 rounded-lg bg-[#EF4444] hover:bg-red-500 text-white text-sm font-semibold transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)

// ── Category Form Modal ───────────────────────────────────────────────────
const CategoryModal = ({ mode, category, onSave, onClose, loading }) => {
  const [form, setForm] = useState({
    name: category?.name || "",
    description: category?.description || "",
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = "Category name is required"
    if (!form.description.trim()) e.description = "Description is required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) onSave(form)
  }

  const inputCls = (field) =>
    `w-full bg-[#2C333F] border ${
      errors[field] ? "border-[#EF4444]" : "border-[#2C333F] focus:border-[#FFD60A]"
    } outline-none text-white placeholder-[#6E727F] text-sm rounded-lg px-4 py-3 transition-colors duration-200`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#1E2735] rounded-xl border border-[#2C333F] p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold text-lg">
            {mode === "create" ? "Add New Category" : "Edit Category"}
          </h3>
          <button
            onClick={onClose}
            className="text-[#6E727F] hover:text-white transition-colors p-1"
          >
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#F1F2FF]">
              Category Name <span className="text-[#EF4444]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Web Development"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className={inputCls("name")}
            />
            {errors.name && <p className="text-[#EF4444] text-xs">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-[#F1F2FF]">
              Description <span className="text-[#EF4444]">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Brief description of this category..."
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              className={`${inputCls("description")} resize-none`}
            />
            {errors.description && (
              <p className="text-[#EF4444] text-xs">{errors.description}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-lg border border-[#2C333F] text-[#AFB2BF] text-sm hover:bg-[#2C333F] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-lg bg-[#FFD60A] hover:bg-[#FFC800] text-black font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Saving..."
                : mode === "create"
                ? "Create Category"
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────
const CategoryManagement = () => {
  const { token } = useSelector((state) => state.auth)

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState("")

  const [modal, setModal] = useState(null) // { type: "create"|"edit"|"delete", category? }

  // Fetch
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    const data = await getAllCategories(token)
    setCategories(data || [])
    setLoading(false)
  }

  // Filtered list
  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase())
  )

  // Handlers
  const handleCreate = async (form) => {
    setSaving(true)
    const created = await createCategory(token, form)
    if (created) setCategories((prev) => [...prev, created])
    setSaving(false)
    setModal(null)
  }

  const handleUpdate = async (form) => {
    setSaving(true)
    const updated = await updateCategory(token, modal.category._id, form)
    if (updated)
      setCategories((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c))
      )
    setSaving(false)
    setModal(null)
  }

  const handleDelete = async () => {
    setSaving(true)
    const ok = await deleteCategory(token, modal.category._id)
    if (ok)
      setCategories((prev) => prev.filter((c) => c._id !== modal.category._id))
    setSaving(false)
    setModal(null)
  }

  return (
    <div className="min-h-screen bg-[#161D29] text-white px-6 py-6">
      {/* Modals */}
      {modal?.type === "create" && (
        <CategoryModal
          mode="create"
          onSave={handleCreate}
          onClose={() => setModal(null)}
          loading={saving}
        />
      )}
      {modal?.type === "edit" && (
        <CategoryModal
          mode="edit"
          category={modal.category}
          onSave={handleUpdate}
          onClose={() => setModal(null)}
          loading={saving}
        />
      )}
      {modal?.type === "delete" && (
        <ConfirmModal
          category={modal.category}
          onConfirm={handleDelete}
          onCancel={() => setModal(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Category Management</h1>
          <p className="text-[#6E727F] text-sm mt-0.5">
            {categories.length} categories total
          </p>
        </div>
        <button
          onClick={() => setModal({ type: "create" })}
          className="flex items-center gap-2 bg-[#FFD60A] hover:bg-[#FFC800] text-black font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors"
        >
          <FiPlus size={16} />
          Add Category
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <FiSearch
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6E727F]"
          size={16}
        />
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#2C333F] border border-[#2C333F] focus:border-[#FFD60A] outline-none text-white placeholder-[#6E727F] text-sm rounded-lg pl-9 pr-4 py-2.5 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-[#1E2735] rounded-xl border border-[#2C333F] overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[2fr_3fr_1fr_auto] gap-4 px-5 py-3 border-b border-[#2C333F]">
          {["Name", "Description", "Courses", "Actions"].map((h) => (
            <p key={h} className="text-[#6E727F] text-xs font-semibold uppercase tracking-wider">
              {h}
            </p>
          ))}
        </div>

        {/* Rows */}
        {loading ? (
          <div className="flex flex-col gap-0">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="grid grid-cols-[2fr_3fr_1fr_auto] gap-4 px-5 py-4 border-b border-[#2C333F] animate-pulse"
              >
                <div className="h-4 bg-[#2C333F] rounded w-3/4" />
                <div className="h-4 bg-[#2C333F] rounded w-full" />
                <div className="h-4 bg-[#2C333F] rounded w-8" />
                <div className="h-4 bg-[#2C333F] rounded w-16" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <MdCategory size={40} className="text-[#2C333F]" />
            <p className="text-[#6E727F]">
              {search ? "No categories match your search" : "No categories yet"}
            </p>
            {!search && (
              <button
                onClick={() => setModal({ type: "create" })}
                className="text-[#FFD60A] text-sm font-medium hover:underline"
              >
                Create your first category
              </button>
            )}
          </div>
        ) : (
          filtered.map((cat, index) => (
            <div
              key={cat._id}
              className={`grid grid-cols-[2fr_3fr_1fr_auto] gap-4 items-center px-5 py-4 transition-colors hover:bg-[#2C333F]/40 ${
                index < filtered.length - 1 ? "border-b border-[#2C333F]" : ""
              }`}
            >
              {/* Name */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FFD60A]/10 flex items-center justify-center shrink-0">
                  <MdCategory size={16} className="text-[#FFD60A]" />
                </div>
                <p className="text-white text-sm font-medium truncate">{cat.name}</p>
              </div>

              {/* Description */}
              <p className="text-[#AFB2BF] text-sm truncate">{cat.description}</p>

              {/* Course count */}
              <p className="text-[#AFB2BF] text-sm">
                {cat.courses?.length ?? 0}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setModal({ type: "edit", category: cat })}
                  className="p-2 rounded-lg text-[#AFB2BF] hover:bg-[#2C333F] hover:text-white transition-colors"
                  title="Edit"
                >
                  <FiEdit2 size={15} />
                </button>
                <button
                  onClick={() => setModal({ type: "delete", category: cat })}
                  className="p-2 rounded-lg text-[#AFB2BF] hover:bg-[#EF4444]/10 hover:text-[#EF4444] transition-colors"
                  title="Delete"
                >
                  <FiTrash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CategoryManagement