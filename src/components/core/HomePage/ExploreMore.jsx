import React, { useState } from 'react'
import {HomePageExplore} from "../../../data/homepage-explore"
import { HighlightText } from './HighlightText';
// const tabsName=[
//     "Free",
//     "New to Coding",
//     "Most popular",
//     "Skill paths",
//     "Carrer paths"
// ];

export const ExploreMore = ({element,isCards=false,customCss}) => {
    const tabsName=element;
    
    const [currentTab, setCurrentTab] = useState(tabsName[0]);
    const [courses,setCourses]=useState(HomePageExplore[0].courses);
    const [currentCard,setCurrentCard]=useState(HomePageExplore[0].courses[0].heading);
const setMyCards=(value)=>{
    setCurrentCard(value);
    const result=HomePageExplore.filter((course)=>course.tag===value);
    setCourses(result[0].courses);
    setCurrentCard(result[0].course[0].heading);
}
  return (
    <div>
      <div className='flex flex-row rounded-full bg-[#161D29] mb-5 mt-5 shadow-[0_0.50px_0_0_rgba(255,255,255,0.4)] py-1 px-1'>
            {
                tabsName.map((element,index)=>{
                    return (
                        <div
                        className={`text-[16px] flex flex-row items-center gap-2
                        ${currentTab===element ? "bg-[#000917] text-white font-medium" 
                            : "text-[#838894]"} rounded-full transition-all duration-200 cursor-pointer hover:bg-[#000917] hover:text-[#F9F9F9] px-7 py-2`}
                        key={index}
                        onClick={()=>setCurrentTab(element)}
                        >
                            {element}
                        </div>
                    )
                })
            }
        </div>
        {isCards && <div className="relative lg:h-[150px] overflow-hidden">
            {/*Course Card ka group*/}
            <div className='absolute flex flex-row gap-10 justify-between w-full'>
                {/*
                    courses.map((element,index)=>{
                        return (
                            <CourseCard
                            key={index}
                            cardData={element}
                            currentCard={currentCard}
                            setCurrentCard={setCurrentCard}
                            />
                        )
                    })*/
                }
            </div>
        </div>}
    </div>
  )
}
