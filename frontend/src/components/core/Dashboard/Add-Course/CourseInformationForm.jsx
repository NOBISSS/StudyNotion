import React, { useEffect, useState } from 'react'
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
  UploadCourseThumbnail,
} from '../../../../services/operations/courseDetailsAPI'
import { setCourse, setStep } from '../../../../slices/courseSlice'
import { COURSE_STATUS, LEVEL } from '../../../../utils/constants'
import ChipInput from './ChipInput'
import RequirementOfCourse from './RequirementOfCourse'

const CourseInformationForm = () => {
  const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm()
  const dispatch = useDispatch()
  const { course, editCourse } = useSelector((state) => state.course)
  const [loading, setLoading] = useState(false)
  const [courseCategories, setCourseCategories] = useState([])
  const [thumbnailPreview, setThumbnailPreview] = useState(null)

  useEffect(() => {
    const getCategories = async () => {
      const categories = await fetchCourseCategories()
      if (categories?.length > 0) setCourseCategories(categories)
    }
    getCategories()
  }, [])

  useEffect(() => {
    if (editCourse && course) {
      setValue('courseTitle', course.courseName)
      setValue('courseShortDesc', course.courseDescription)
      setValue('coursePrice', course.price)
      setValue('courseTag', course.tag)
      setValue('courseBenefits', course.whatYouWillLearn)
      setValue('courseCategory', course.category?._id || course.category)
      setValue('courseLevel', course.level || LEVEL[0])
      setValue('courseRequirements', course.instructions || [])
      setThumbnailPreview(course.thumbnailUrl || course.thumbnail || null)
    }
  }, [editCourse, course])

  const isFormUpdated = () => {
    const v = getValues()
    return (
      v.courseTitle !== course?.courseName ||
      v.courseShortDesc !== course?.courseDescription ||
      v.coursePrice !== course?.price ||
      v.courseBenefits !== course?.whatYouWillLearn ||
      v.courseLevel !== (course?.level || LEVEL[0]) ||
      v.courseCategory !== (course?.category?._id || course?.category) ||
      v.courseRequirements?.toString() !== course?.instructions?.toString()
    )
  }

  const onSubmit = async (data) => {
    if (editCourse) {
      if (!isFormUpdated()) { toast.error('No changes made to the form'); return }
      const v = getValues()
      const formData = new FormData()
      formData.append('courseId', course._id)
      if (v.courseTitle !== course.courseName) formData.append('courseName', data.courseTitle)
      if (v.courseShortDesc !== course.courseDescription) formData.append('courseDescription', data.courseShortDesc)
      if (v.coursePrice !== course.price) formData.append('price', data.coursePrice)
      if (v.courseBenefits !== course.whatYouWillLearn) formData.append('whatYouWillLearn', data.courseBenefits)
      if (v.courseLevel !== (course.level || LEVEL[0]))
      formData.append('level', data.courseLevel)
      if (v.courseCategory !== (course.category?._id || course.category)) formData.append('category', data.courseCategory)
      if (v.courseRequirements?.toString() !== course.instructions?.toString()) formData.append('instructions', JSON.stringify(data.courseRequirements))
      setLoading(true)
      const result = await editCourseDetails(formData)
      setLoading(false)
      if (result) { dispatch(setStep(2)); dispatch(setCourse(result)) }
      return
    }
    const formData = new FormData()
    formData.append('courseName', data.courseTitle)
    formData.append('courseDescription', data.courseShortDesc)
    formData.append('price', data.coursePrice)
    formData.append('whatYouWillLearn', data.courseBenefits)
    formData.append('level', data.courseLevel)
    formData.append('category', data.courseCategory)
    formData.append('instructions', JSON.stringify(data.courseRequirements))
    formData.append('thumbnail', data.courseImage[0])
    formData.append('tag', JSON.stringify(data.courseTag))
    formData.append('status', COURSE_STATUS.DRAFT)
    setLoading(true)
    //const uploadThumbnail=await UploadCourseThumbnail(formData.thumbnailImage);
    
    const result = await addCourseDetails(formData)
    setLoading(false)
    if (result?.success) { dispatch(setStep(2)); dispatch(setCourse(result.data || result)) }
  }

  const inputCls = "w-full px-4 py-3 rounded-lg bg-[#2C333F] border border-transparent text-white placeholder-[#838894] text-sm focus:outline-none focus:border-[#FFD60A] transition-colors"

  return (
    <>
      {/* Form Card */}
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

        {/* Course Short Description */}
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
              {...register('coursePrice', { required: 'Price is required', valueAsNumber: true, min: { value: 0, message: 'Cannot be negative' } })} />
          </div>
          {errors.coursePrice && <p className="text-pink-400 text-xs">{errors.coursePrice.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white">
            Level <sup className="text-pink-400">*</sup>
          </label>
          <div className="relative">
            <select defaultValue="" className={`${inputCls} appearance-none pr-10 cursor-pointer`}
              {...register('courseLevel', { required: 'Level is required' })}>
              <option value="" disabled className="bg-[#2C333F]">Choose Level</option>
              {LEVEL.map((level,index) => (
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
        <ChipInput label="Tags" name="courseTag" register={register} errors={errors} setValue={setValue} />

        {/* Thumbnail */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-white">
            Course Thumbnail <sup className="text-pink-400">*</sup>
          </label>
          <label className="cursor-pointer">
            <div className="w-full rounded-xl border-2 border-dashed border-[#424854] bg-[#2C333F] flex flex-col items-center justify-center gap-3 py-10 hover:border-[#FFD60A] transition-colors">
              {thumbnailPreview ? (
                <img src={thumbnailPreview} alt="preview" className="max-h-48 object-cover rounded-lg" />
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
                    <p className="text-[#838894] text-xs mt-1">Max 6MB each (12MB for videos)</p>
                  </div>
                  <div className="flex gap-10 text-xs text-[#838894]">
                    <span>• Aspect ratio 16:9</span>
                    <span>• Recommended size 1024×576</span>
                  </div>
                </>
              )}
            </div>
            <input type="file" accept="image/*" className="hidden"
              {...register('courseImage', { required: !editCourse })}
              onChange={(e) => {
                const file = e.target.files[0]
                if (file) setThumbnailPreview(URL.createObjectURL(file))
              }} />
          </label>
          {errors.courseImage && <p className="text-pink-400 text-xs">Thumbnail is required</p>}
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

      {/* Next button — outside card, centered at bottom like Figma */}
      <div className="flex justify-center mt-6">
        {editCourse && (
          <button type="button" onClick={() => dispatch(setStep(2))}
            className="mr-3 px-5 py-2.5 text-sm font-medium text-[#AFB2BF] border border-[#2C333F] rounded-lg hover:bg-[#2C333F] transition-colors">
            Continue Without Saving
          </button>
        )}
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={loading}
          className="flex items-center gap-2 px-8 py-2.5 bg-[#FFD60A] text-black font-semibold text-sm rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : editCourse ? 'Save Changes' : (<>Next <VscChevronRight /></>)}
        </button>
      </div>
    </>
  )
}

export default CourseInformationForm