import React from 'react'
import { HighlightText } from './HighlightText'
import Know_your_progress from "../../../assets/Know_your_progress.png"
import Plan_your_lessons from "../../../assets/Plan_your_lessons.svg"
import Compare_with_others from "../../../assets/Compare_with_others.svg"
import { CTAButton } from './Button'
export const LearningLanguageSection = () => {
  return (
    <div className='mt-[130px] mb-32'>
        <div className="flex flex-col gap-5 items-center">
            <div className="text-4xl font-semibold text-center">
                Your Swiss Knife for
                <HighlightText text={"Learning any Language"}/>
            </div>

            <div className='text-center mx-auto text-base font-medium w-[70%]'>
            Using spin making learning multiple language easy. with 20+ languages realistic voice-over,
            progress tracking, custom schedule and more.
            </div>  

            <div className="flex flex-row items-center justify-center mt-5">
                <img src={Know_your_progress} alt="KnowYourProgressImage" 
                className='object-contain -mr-32'/>
                <img src={Compare_with_others} alt="" 
                className='object-contain'/>
                <img src={Plan_your_lessons} alt="" 
                className='object-contain -ml-36'/>
            </div>
            <div className="w-fit">
                <CTAButton active={true} linkto={"/signup"}>
                    <div>
                        Learn More
                    </div>
                </CTAButton>
            </div>
        </div>
    </div>
  )
}
