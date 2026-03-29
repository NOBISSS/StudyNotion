// components/core/Dashboard/AddCourse/CourseInformationForm.jsx
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { HiOutlineCurrencyRupee } from 'react-icons/hi'
import { VscChevronRight } from 'react-icons/vsc'
import { MdCloudUpload } from 'react-icons/md'
import {
  addCourseDetails,
  editCourseDetails,
  fetchCourseCategories,
  fetchCourseDetails,
} from '../../../../services/operations/courseDetailsAPI'
import { setCourse, setEditCourse, setStep } from '../../../../slices/courseSlice'
import { COURSE_STATUS, LEVEL } from '../../../../utils/constants'
import ChipInput from './ChipInput'
import RequirementOfCourse from './RequirementOfCourse'
import { useSearchParams } from 'react-router-dom'

// ─── Config ───────────────────────────────────────────────────────────────────
const MAX_FILE_MB      = 2
const MAX_FILE_BYTES   = MAX_FILE_MB * 1024 * 1024
const COMPRESS_QUALITY = 0.75
const COMPRESS_MAX_W   = 1280

// ─── Helper: append array to FormData ────────────────────────────────────────
const appendArray = (formData, key, arr = []) => {
  if (!arr?.length) return
  arr.forEach((item) => formData.append(key, item))
}

// ─── Helper: compress image via canvas ───────────────────────────────────────
const compressImage = (file) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width > COMPRESS_MAX_W) {
        height = Math.round((height * COMPRESS_MAX_W) / width)
        width  = COMPRESS_MAX_W
      }
      const canvas = document.createElement('canvas')
      canvas.width  = width
      canvas.height = height
      canvas.getContext('2d').drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error('Compression failed')); return }
          resolve(new File([blob], file.name, { type: 'image/jpeg' }))
        },
        'image/jpeg',
        COMPRESS_QUALITY
      )
    }
    img.onerror = () => reject(new Error('Image load failed'))
    img.src = url
  })

// ─── Fetch course for edit ────────────────────────────────────────────────────
async function getCurrentCourse(courseId) {
  const res = await fetchCourseDetails(courseId)
  return res?.data?.course ?? null
}

const CourseInformationForm = ({ courseId }) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm()

  const dispatch = useDispatch()
  const { course, editCourse } = useSelector((state) => state.course)
  const [searchParams, setSearchParams] = useSearchParams()

  const [loading, setCLoading]              = useState(false)
  const [courseCategories, setCourseCategories] = useState([])
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [thumbnailFile, setThumbnailFile]       = useState(null)
  const [compressing, setCompressing]           = useState(false)
  const [fileInfo, setFileInfo]                 = useState(null)

  // ── Fetch categories ─────────────────────────────────────────────────────
  useEffect(() => {
    const getCategories = async () => {
      const categories = await fetchCourseCategories()
      if (categories?.length > 0) setCourseCategories(categories)
    }
    getCategories()
  }, [])

  // ── Pre-fill form from API response ──────────────────────────────────────
  // API response fields (from your actual response):
  // courseName, description, originalPrice, tag[], whatYouWillLearn[],
  // categoryId: { _id, name }, level, thumbnailUrl, tag[]
  useEffect(() => {
    const fetchCurrentCourse = async () => {
      if (courseId) {
        const c = await getCurrentCourse(courseId)
        if (!c) return

        dispatch(setEditCourse(true))

        // ✅ Map each API field to its correct form field
        setValue('courseTitle',        c.courseName ?? '')

        // ✅ API uses "description" not "courseDescription"
        setValue('courseShortDesc',    c.description ?? '')

        // ✅ API uses "originalPrice" not "price"
        setValue('coursePrice',        c.originalPrice ?? 0)

        // ✅ API uses "tag" (array of strings)
        setValue('courseTag',          Array.isArray(c.tag) ? c.tag : [])

        // ✅ API uses "whatYouWillLearn" as array — join for textarea
        setValue('courseBenefits',
          Array.isArray(c.whatYouWillLearn)
            ? c.whatYouWillLearn.join('\n')
            : (c.whatYouWillLearn ?? '')
        )

        // ✅ API uses "categoryId._id" for the select value
        setValue('courseCategory',     c.categoryId?._id ?? '')

        setValue('courseLevel',        c.level ?? LEVEL[0])

        // ✅ instructions may not exist in this response — fallback to []
        setValue('courseRequirements', Array.isArray(c.instructions) ? c.instructions : [])

        // ✅ API uses "thumbnailUrl"
        setThumbnailPreview(c.thumbnailUrl ?? null)

      } else {
        // Reset for create mode
        dispatch(setEditCourse(false))
        setValue('courseTitle',        '')
        setValue('courseShortDesc',    '')
        setValue('coursePrice',        null)
        setValue('courseTag',          [])
        setValue('courseBenefits',     '')
        setValue('courseCategory',     '')
        setValue('courseLevel',        LEVEL[0])
        setValue('courseRequirements', [])
        setThumbnailPreview(null)
        setThumbnailFile(null)
        setFileInfo(null)
      }
    }
    fetchCurrentCourse()
  }, [courseId, setValue, dispatch])

  // ── Handle thumbnail with compression ────────────────────────────────────
  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return }

    setCompressing(true)
    try {
      let finalFile = file
      if (file.size > MAX_FILE_BYTES) {
        toast.loading('Compressing image...', { id: 'compress' })
        finalFile = await compressImage(file)
        toast.dismiss('compress')
        if (finalFile.size > MAX_FILE_BYTES) {
          toast.error(`Still too large (${(finalFile.size / 1024 / 1024).toFixed(1)}MB). Use a smaller image.`)
          setCompressing(false)
          return
        }
        toast.success(`Compressed to ${(finalFile.size / 1024 / 1024).toFixed(2)}MB`)
      }
      setThumbnailFile(finalFile)
      setThumbnailPreview(URL.createObjectURL(finalFile))
      setFileInfo({ name: finalFile.name, sizeMB: (finalFile.size / 1024 / 1024).toFixed(2) })
    } catch (err) {
      toast.error('Failed to process image')
    } finally {
      setCompressing(false)
    }
  }

  // ── Detect changes for edit ───────────────────────────────────────────────
  const isFormUpdated = () => {
    const v = getValues()
    // Compare against the raw API shape stored in Redux course
    return (
      v.courseTitle     !== (course?.courseName ?? '')                               ||
      v.courseShortDesc !== (course?.description ?? '')                              ||
      String(v.coursePrice) !== String(course?.originalPrice ?? 0)                  ||
      v.courseBenefits  !== (Array.isArray(course?.whatYouWillLearn)
                              ? course.whatYouWillLearn.join('\n')
                              : (course?.whatYouWillLearn ?? ''))                   ||
      v.courseLevel     !== (course?.level ?? LEVEL[0])                             ||
      v.courseCategory  !== (course?.categoryId?._id ?? '')                         ||
      JSON.stringify(v.courseRequirements) !== JSON.stringify(course?.instructions ?? []) ||
      thumbnailFile !== null
    )
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  const onSubmit = async (data) => {

    // EDIT mode
    if (editCourse && courseId) {
      if (!isFormUpdated()) { toast.error('No changes made'); return }

      const v        = getValues()
      const formData = new FormData()
      formData.append('courseId', courseId)

      if (v.courseTitle     !== (course?.courseName ?? ''))
        formData.append('courseName',        data.courseTitle)
      if (v.courseShortDesc !== (course?.description ?? ''))
        formData.append('courseDescription', data.courseShortDesc)
      if (String(v.coursePrice) !== String(course?.originalPrice ?? 0))
        formData.append('price',             String(data.coursePrice))
      if (v.courseBenefits  !== (Array.isArray(course?.whatYouWillLearn)
                                  ? course.whatYouWillLearn.join('\n')
                                  : (course?.whatYouWillLearn ?? '')))
        formData.append('whatYouWillLearn',  data.courseBenefits)
      if (v.courseCategory  !== (course?.categoryId?._id ?? ''))
        formData.append('category',          data.courseCategory)
      if (v.courseLevel     !== (course?.level ?? LEVEL[0]))
        formData.append('level',             data.courseLevel)
      if (JSON.stringify(v.courseRequirements) !== JSON.stringify(course?.instructions ?? []))
        appendArray(formData, 'instructions', data.courseRequirements)
      if (thumbnailFile)
        formData.append('thumbnail', thumbnailFile)

      setCLoading(true)
      const result = await editCourseDetails(formData)
      setCLoading(false)
      if (result) { dispatch(setStep(2)); dispatch(setCourse(result)) }
      return
    }

    // CREATE mode
    if (!thumbnailFile) { toast.error('Please upload a course thumbnail'); return }

    const formData = new FormData()
    formData.append('courseName',        data.courseTitle)
    formData.append('courseDescription', data.courseShortDesc)
    formData.append('price',             String(data.coursePrice))
    formData.append('whatYouWillLearn',  data.courseBenefits)
    formData.append('level',             data.courseLevel)
    formData.append('category',          data.courseCategory)
    formData.append('status',            COURSE_STATUS.DRAFT)
    formData.append('thumbnail',         thumbnailFile)
    appendArray(formData, 'instructions', data.courseRequirements)
    appendArray(formData, 'tag',          data.courseTag)

    setCLoading(true)
    const result = await addCourseDetails(formData)
    setCLoading(false)
    if (result?.success) {
      setSearchParams({ courseId: result.data.course._id })
      dispatch(setStep(2))
      dispatch(setCourse(result.data || result))
    }
  }

  const inputCls =
    'w-full px-4 py-3 rounded-lg bg-[#2C333F] border border-transparent text-white placeholder-[#838894] text-sm focus:outline-none focus:border-[#FFD60A] transition-colors'

  return (
    <>
      <div className="bg-[#161D29] rounded-xl p-6 flex flex-col gap-5">

        {/* Course Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white">
            Course Title <sup className="text-pink-400">*</sup>
          </label>
          <input type="text" placeholder="Enter Course Title" className={inputCls}
            {...register('courseTitle', { required: 'Course title is required' })} />
          {errors.courseTitle && <p className="text-pink-400 text-xs">{errors.courseTitle.message}</p>}
        </div>

        {/* Short Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white">
            Course Short Description <sup className="text-pink-400">*</sup>
          </label>
          <textarea rows={5} placeholder="Enter Description" className={`${inputCls} resize-none`}
            {...register('courseShortDesc', { required: 'Description is required' })} />
          {errors.courseShortDesc && <p className="text-pink-400 text-xs">{errors.courseShortDesc.message}</p>}
        </div>

        {/* Price */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white">
            Price <sup className="text-pink-400">*</sup>
          </label>
          <div className="relative">
            <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-[#838894] text-lg" />
            <input type="number" placeholder="Enter Price" className={`${inputCls} pl-9`}
              {...register('coursePrice', {
                required: 'Price is required',
                min: { value: 0, message: 'Cannot be negative' },
              })} />
          </div>
          {errors.coursePrice && <p className="text-pink-400 text-xs">{errors.coursePrice.message}</p>}
        </div>

        {/* Level */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white">
            Level <sup className="text-pink-400">*</sup>
          </label>
          <div className="relative">
            <select defaultValue="" className={`${inputCls} appearance-none pr-10 cursor-pointer`}
              {...register('courseLevel', { required: 'Level is required' })}>
              <option value="" disabled className="bg-[#2C333F]">Choose Level</option>
              {LEVEL.map((level, index) => (
                <option key={index} value={level} className="bg-[#2C333F]">{level}</option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#838894] pointer-events-none text-xs">▾</span>
          </div>
          {errors.courseLevel && <p className="text-pink-400 text-xs">{errors.courseLevel.message}</p>}
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white">
            Category <sup className="text-pink-400">*</sup>
          </label>
          <div className="relative">
            <select defaultValue="" className={`${inputCls} appearance-none pr-10 cursor-pointer`}
              {...register('courseCategory', { required: 'Category is required' })}>
              <option value="" disabled className="bg-[#2C333F]">Choose a Category</option>
              {courseCategories.map((cat) => (
                <option key={cat._id} value={cat._id} className="bg-[#2C333F]">{cat.name}</option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#838894] pointer-events-none text-xs">▾</span>
          </div>
          {errors.courseCategory && <p className="text-pink-400 text-xs">{errors.courseCategory.message}</p>}
        </div>

        {/* Tags */}
        <ChipInput
          label="Tags"
          name="courseTag"
          register={register}
          errors={errors}
          setValue={setValue}
          currentTags={Array.isArray(course?.tag) ? course.tag : []}
        />

        {/* Thumbnail */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white">
            Course Thumbnail <sup className="text-pink-400">*</sup>
          </label>
          <label className={`cursor-pointer ${compressing ? 'pointer-events-none opacity-60' : ''}`}>
            <div className="w-full rounded-xl border-2 border-dashed border-[#424854] bg-[#2C333F] flex flex-col items-center justify-center gap-3 py-10 hover:border-[#FFD60A] transition-colors">
              {compressing ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#FFD60A] border-t-transparent" />
                  <p className="text-[#AFB2BF] text-sm">Compressing image...</p>
                </div>
              ) : thumbnailPreview ? (
                <div className="flex flex-col items-center gap-2">
                  <img src={thumbnailPreview} alt="preview" className="max-h-48 object-cover rounded-lg" loading="lazy" />
                  {fileInfo && <p className="text-[#6B7280] text-xs">{fileInfo.name} • {fileInfo.sizeMB}MB</p>}
                  <p className="text-[#FFD60A] text-xs font-medium">Click to change</p>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-full bg-[#1D2532] flex items-center justify-center">
                    <MdCloudUpload className="text-3xl text-[#FFD60A]" />
                  </div>
                  <div className="text-center">
                    <p className="text-[#AFB2BF] text-sm">
                      Drag and drop an image, or{' '}
                      <span className="text-[#FFD60A] font-medium">Browse</span>
                    </p>
                    <p className="text-[#838894] text-xs mt-1">Max {MAX_FILE_MB}MB · Auto-compressed if larger</p>
                  </div>
                  <div className="flex gap-6 text-xs text-[#838894]">
                    <span>• Aspect ratio 16:9</span>
                    <span>• Recommended 1024×576</span>
                  </div>
                </>
              )}
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailChange} />
          </label>
        </div>

        {/* Benefits */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white">
            Benefits of the course <sup className="text-pink-400">*</sup>
          </label>
          <textarea rows={4} placeholder="Enter Benefits of the course" className={`${inputCls} resize-none`}
            {...register('courseBenefits', { required: 'Benefits are required' })} />
          {errors.courseBenefits && <p className="text-pink-400 text-xs">{errors.courseBenefits.message}</p>}
        </div>

        {/* Requirements */}
        <RequirementOfCourse label="Requirements/Instructions" name="courseRequirements"
          register={register} errors={errors} setValue={setValue} />
      </div>

      {/* Action buttons */}
      <div className="flex justify-center mt-6">
        {editCourse && courseId && (
          <button type="button" onClick={() => dispatch(setStep(2))}
            className="mr-3 px-5 py-2.5 text-sm font-medium text-[#AFB2BF] border border-[#2C333F] rounded-lg hover:bg-[#2C333F] transition-colors">
            Continue Without Saving
          </button>
        )}
        <button onClick={handleSubmit(onSubmit)} disabled={loading || compressing}
          className="flex items-center gap-2 px-8 py-2.5 bg-[#FFD60A] text-black font-semibold text-sm rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50">
          {loading ? 'Saving...' : editCourse && courseId ? 'Save Changes' : (<>Create <VscChevronRight /></>)}
        </button>
      </div>
    </>
  )
}

export default CourseInformationForm