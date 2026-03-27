import React, { useState } from "react";
import RenderSteps from "./RenderSteps";

export default function AddCourse(){
    return (
        <>
            <div className="text-white flex p-10 gap-10">
                <div>
                    <h1>Add Course</h1>
                    <div className="text-white w-full">
                        <RenderSteps/>
                    </div>
                </div>
                <div className="bg-red-600">
                  <div className="bg-gray-800 fixed p-6 rounded-lg shadow-lg">
             <h2 className="text-yellow-400 font-bold mb-4">⚡ Course Upload Tips</h2>
             <ul className="space-y-3 text-sm text-gray-300">
               <li>Set the Course Price option or make it free.</li>
               <li>Standard size for the course thumbnail is 1024×576.</li>
               <li>Video section controls the course overview video.</li>
               <li>Course Builder is where you create & organize a course.</li>
               <li>Add Topics in the Course Builder section to create lessons, quizzes, and assignments.</li>
               <li>Information from the Additional Data section shows up on the course page.</li>
               <li>Make Announcements to notify any important updates.</li>
               <li>Notes to all enrolled students at once.</li>
             </ul>
           </div>
                </div>
            </div>
        </>
    )
}