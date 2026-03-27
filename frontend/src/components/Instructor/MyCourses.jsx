import { IconBtn } from '../common/IconBtn'
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
const MyCourses = () => {

const courses = [
  {
    id: 1,
    title: "Introduction to Design",
    description:
      "This course provides an overview of the design process, design thinking, and basic design principles.",
    created: "April 27, 2023 | 05:15 PM",
    status: "Published",
    duration: "20h 10m",
    price: "₹520",
    image: "https://images.unsplash.com/photo-1754901350791-04eff8b6289c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    title: "Graphic Design",
    description:
      "This course focuses on creating visual communication through the use of typography, images, and color.",
    created: "April 28, 2023 | 04:20 PM",
    status: "Drafted",
    duration: "18h 30m",
    price: "₹1200",
    image: "https://images.unsplash.com/photo-1754901350791-04eff8b6289c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    title: "Web Design",
    description:
      "This course covers the basics of designing and building websites, including HTML, CSS, and responsive design.",
    created: "April 29, 2023 | 12:32 PM",
    status: "Published",
    duration: "5h 52m",
    price: "₹1800",
    image: "https://images.unsplash.com/photo-1754901350791-04eff8b6289c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];
    return (
    <div className='text-white p-5'>
      <div>
        <div className='Header-Part flex justify-between p-5 items-center'>
            <div className='flex flex-col gap-3'>
               <h1 className='text-[#838894]'>Home / Dashboard / <span className='text-[#FFD60A]'>MyCourse</span></h1>
               <h1 className='text-4xl text-white font-medium'>My Courses</h1>
            </div>
            <div className='h-full'>
            
            <IconBtn iconName={"VscAdd"} text={"New"}
                customClassName={"h-[50px] text-[20px] flex-row-reverse"} active={1}
                type={"button"}
            />              
            </div>
        </div>
        <div>


     <div className="min-h-screen text-white p-6">
      

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="min-w-full text-sm">
          {/* Table Header */}
          <thead className="bg-gray-800 text-left  text-gray-300">
            <tr className=''>
              <th className="px-5 py-3">COURSES</th>
              <th className="px-4 py-3">DURATION</th>
              <th className="px-4 py-3">PRICE</th>
              <th className="px-4 py-3">ACTIONS</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-700">
            {courses.map((course) => (
              <tr key={course.id} className="bg-gray-900 ">
                {/* Course Info */}
                <td className="px-4 py-3 flex items-start gap-3">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-3/12 h-3/12 object-cover rounded-md flex-shrink-0"
                  />
                  <div className='flex flex-col gap-2'>
                    <h2 className="font-semibold text-2xl" >{course.title}</h2>
                    <p className="text-gray-400 text-[1.10vw] w-1xs line-clamp-2">
                      {course.description}
                    </p>
                    <p className="text-white text-xs mt-1">
                      Created: {course.created}
                    </p>
                    <span
                      className={`inline-block w-fit mt-2 px-2 py-1 text-xs rounded ${
                        course.status === "Published"
                          ? "bg-green-600"
                          : "bg-red-600"
                      }`}
                    >
                      {course.status}
                    </span>
                  </div>
                </td>

                {/* Duration */}
                <td className="px-4 py-3 text-[#AFB2BF]">{course.duration}</td>

                {/* Price */}
                <td className="px-4 py-3 font-semibold text-[#AFB2BF]">{course.price}</td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button className="p-1 hover:text-blue-400">
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button className="p-1 hover:text-red-400">
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
 

        </div>
      </div>
    </div>
  )
}

export default MyCourses