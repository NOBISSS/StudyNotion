import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { VscAdd, VscChevronLeft, VscChevronRight } from 'react-icons/vsc'
import { PencilIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { setStep, setCourse } from '../../../../../slices/courseSlice'
import toast from 'react-hot-toast'
import EditLectureModal from './EditLectureModal'

const CourseBuilderForm = () => {
  const dispatch = useDispatch()
  const { course } = useSelector((state) => state.course)

  const [sectionName, setSectionName] = useState('')
  const [sections, setSections] = useState(course?.sections || [])
  const [expandedSection, setExpandedSection] = useState(
    course?.sections?.length > 0 ? course.sections[0]._id : null
  )
  const [editingLecture, setEditingLecture] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const handleAddSection = () => {
    if (!sectionName.trim()) { toast.error('Section name cannot be empty'); return }
    const newSection = { _id: Date.now().toString(), sectionName: sectionName.trim(), subSection: [] }
    const updated = [...sections, newSection]
    setSections(updated)
    setExpandedSection(newSection._id)
    setSectionName('')
  }

  const handleDeleteSection = (sectionId) => {
    setSections((prev) => prev.filter((s) => s._id !== sectionId))
    if (expandedSection === sectionId) setExpandedSection(null)
  }

  const handleDeleteLecture = (sectionId, lectureId) => {
    setSections((prev) => prev.map((s) =>
      s._id === sectionId ? { ...s, subSection: s.subSection.filter((l) => l._id !== lectureId) } : s
    ))
  }

  const handleNext = () => {
    if (sections.length === 0) { toast.error('Add at least one section'); return }
    dispatch(setCourse({ ...course, sections }))
    dispatch(setStep(3))
  }

  return (
    <>
      {/* Card */}
      <div className="bg-[#161D29] rounded-xl p-6 flex flex-col gap-5">
        <h2 className="text-xl font-bold text-white">Course Builder</h2>

        {/* Sections list */}
        {sections.map((section) => (
          <div key={section._id} className="rounded-lg overflow-hidden border border-[#2C333F]">
            {/* Section row */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#2C333F]">
              <div className="flex items-center gap-3">
                <span className="text-[#838894] text-base">☰</span>
                <span className="text-white font-semibold text-sm">{section.sectionName}</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 text-[#838894] hover:text-white transition-colors">
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button onClick={() => handleDeleteSection(section._id)}
                  className="p-1.5 text-[#838894] hover:text-red-400 transition-colors">
                  <TrashIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setExpandedSection(expandedSection === section._id ? null : section._id)}
                  className="p-1.5 text-[#838894] hover:text-white transition-colors"
                >
                  {expandedSection === section._id
                    ? <ChevronUpIcon className="w-4 h-4" />
                    : <ChevronDownIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Expanded: lectures */}
            {expandedSection === section._id && (
              <div className="bg-[#161D29] flex flex-col">
                {section.subSection?.map((lecture) => (
                  <div key={lecture._id}
                    className="flex items-center justify-between px-8 py-2.5 border-b border-[#2C333F] last:border-b-0">
                    <div className="flex items-center gap-3 text-sm text-[#AFB2BF]">
                      <span className="text-[#838894]">☰</span>
                      <span>{lecture.title}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setEditingLecture({ ...lecture, sectionId: section._id }); setShowModal(true) }}
                        className="p-1.5 text-[#838894] hover:text-white transition-colors">
                        <PencilIcon className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteLecture(section._id, lecture._id)}
                        className="p-1.5 text-[#838894] hover:text-red-400 transition-colors">
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {/* Add Lecture */}
                <button
                  onClick={() => { setEditingLecture({ sectionId: section._id, isNew: true }); setShowModal(true) }}
                  className="flex items-center gap-2 px-8 py-3 text-[#FFD60A] text-sm font-medium hover:text-yellow-300 transition-colors w-fit"
                >
                  <VscAdd />
                  Add Lecture
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Add section input */}
        <input
          type="text"
          value={sectionName}
          onChange={(e) => setSectionName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddSection()}
          placeholder="Add a section to build your course"
          className="w-full px-4 py-3 rounded-lg bg-[#2C333F] border border-transparent text-white placeholder-[#838894] text-sm focus:outline-none focus:border-[#FFD60A] transition-colors"
        />

        {/* Create Section button */}
        <button type="button" onClick={handleAddSection}
          className="flex items-center gap-2 w-fit px-5 py-2.5 border border-[#FFD60A] text-[#FFD60A] rounded-lg hover:bg-[#FFD60A] hover:text-black transition-all text-sm font-medium">
          <VscAdd />
          Create Section
        </button>
      </div>

      {/* Back / Next — outside card, centered at bottom like Figma */}
      <div className="flex justify-center gap-4 mt-6">
        <button type="button" onClick={() => dispatch(setStep(1))}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-[#424854] text-white bg-[#1D2532] hover:bg-[#2C333F] transition-colors text-sm font-medium">
          <VscChevronLeft />
          Back
        </button>
        <button type="button" onClick={handleNext}
          className="flex items-center gap-2 px-8 py-2.5 bg-[#FFD60A] text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors text-sm">
          Next
          <VscChevronRight />
        </button>
      </div>

      {/* Edit Lecture Modal */}
      {showModal && (
        <EditLectureModal
          lecture={editingLecture}
          onClose={() => { setShowModal(false); setEditingLecture(null) }}
          onSave={(sectionId, lectureData) => {
            setSections((prev) => prev.map((s) => {
              if (s._id !== sectionId) return s
              if (lectureData.isNew) {
                return { ...s, subSection: [...s.subSection, { ...lectureData, _id: Date.now().toString() }] }
              }
              return { ...s, subSection: s.subSection.map((l) => l._id === lectureData._id ? lectureData : l) }
            }))
            setShowModal(false)
            setEditingLecture(null)
          }}
        />
      )}
    </>
  )
}

export default CourseBuilderForm