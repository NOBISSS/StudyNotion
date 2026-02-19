import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from "react-icons/fa";
import { HighlightText } from '../components/core/HomePage/HighlightText';
import { CTAButton } from '../components/core/HomePage/Button';
import Banner from "../assets/banner.mp4"
import { CodeBlocks } from '../components/core/HomePage/CodeBlocks';
import { TimeLineSection } from '../components/core/HomePage/TimeLineSection';
import { LearningLanguageSection } from '../components/core/HomePage/LearningLanguageSection';
import { InstructorSection } from '../components/core/HomePage/InstructorSection';
import { ExploreMore } from '../components/core/HomePage/ExploreMore';
import Navbar from '../components/core/Navbar';

export const Home = () => {
  return (
    <div className="">
      
      {/*Section1 */}
      
      <div className='relative mx-auto flex flex-col max-w-maxContent w-11/12 items-center text-white justify-between'>
      
        <Link to={"/signup"}>
          <div className='group mt-16 p-1 rounded-full bg-[#161D29] font-bold text-[#999DAA] transition-all duration-200 hover:scale-95 w-fit'>
            <div className='flex flex-row items-center gap-3 rounded-full px-10 py-[5px] transition-all shadow-[0_0.50px_0_0_rgba(255,255,255,0.4)]  duration-200 group-hover:bg-[#000917] '>
              <p>Become a Instructor</p>
              <FaArrowRight/>
            </div>
          </div>

        </Link>
        <div className='text-center text-4xl font-semibold mt-7'>
          Empower Your Future with  
           <HighlightText text={"Coding Skills"}/>
        </div>

        <div className='w-[80%] text-center text-lg font-bold text-[#999DAA] mt-4'>
          With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors. 
        </div>
        <div className='flex flex-row gap-7 mt-8'>
            <CTAButton active={true} linkto={"/signup"}>Learn More</CTAButton>
            <CTAButton active={false} linkto={"/login"}>Book Demo</CTAButton>
        </div>

        <div className=' shadow-[10px_-5px_50px_-5px] shadow-blue-200 my-12 '>
          <video className='shadow-[20px_20px_rgba(255,255,255)]'
          muted
          loop
          autoPlay
          >
            <source src={Banner} type='video/mp4'/>
          </video>
        </div>
        {/*Code Section 1*/}
        <div className=' flex flex-row'>
              <CodeBlocks 
              backgroundGradient={"codeblock1"}
              position={"lg:flex-row"}
              heading={
              <div className='text-4xl font-semibold'>
                Unlock Your
                <HighlightText text={"coding potential"}/>
                with out online courses
              </div>}
              subheading={
                "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
              }
              ctabtn1={
                {
                  btnText:"Try it Yourself",
                  linkto:"/signup",
                  active:true
                }
              }
              ctabtn2={
                {
                  btnText:"learn more",
                  linkto:"/login",
                  active:false
                }
              }
              codeblock={'<!DOCTYPE html>\n<html>head><title>Example<title><linkrel="stylesheet" href="styles.css">'}
              codecolor={"text-[#E7BC5B]"}
              />
              
        </div>
         {/*Code Section 2*/}
        <div className=' flex flex-row'>
              <CodeBlocks 
              backgroundGradient={"codeblock2"}
              position={"flex-row-reverse"}
              heading={
              <div className='text-4xl font-semibold'>
                Start
                <HighlightText text={`coding in seconds`}/>
                
              </div>}
              subheading={
                "Go Ahead,give it a try.Our hands-on learning environment means you'll be writing real code from your very first lesson."
              }
              ctabtn1={
                {
                  btnText:"Continue Lesson",
                  linkto:"/signup",
                  active:true
                }
              }
              ctabtn2={
                {
                  btnText:"Learn More",
                  linkto:"/login",
                  active:false
                }
              }
              codeblock={'<!DOCTYPE html>\n<html>head><title>Example<title><linkrel="stylesheet" href="styles.css">'}
              codecolor={"text-[#E7BC5B]"}
              />
              
        </div>
          <div className='text-4xl font-semibold text-center'>
            Unlock the
            <HighlightText text={"Power of code"}/>
        </div>
        <p className="text-center text-sm text-[16px] text-[#838894] mt-3">
            Learn to Build anything You can imagine
        </p>
              <ExploreMore element={[
                  "Free",
                  "New to Coding",
                  "Most popular",
                  "Skill paths",
                  "Carrer paths"]} isCards={true}/>
      </div>
      {/*Section2 */}
      <div className='bg-[rgb(249,249,249)] text-[#000814]'>
        <div className='homepage_bg h-[310px]'>
            
            <div className='w-11/12 max-w-maxContent flex flex-col items-center gap-5 mx-auto justify-center'>
                <div className='h-[150px]'></div>
                <div className='flex flex-row gap-7 text-white'>
                    <CTAButton active={true} linkto={"/signup"} >
                      <div className='flex flex-row items-center gap-2'>
                        Explore Full Catalog
                        <FaArrowRight/>
                        </div>
                    </CTAButton>
                    <CTAButton active={false} linkto={"/login"}>
                      <div>
                        Learn More
                      </div>
                    </CTAButton>
                </div>
            </div>
        </div>
        <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center gap-7'>
                <div className='flex flex-row gap-5 mb-10 mt-[95px]'>
                  <div className="text-4xl font-semibold w-[45%]">
                    Get the Skills you need for a
                    <HighlightText text={"Job that is in demand"}/>
                  </div>
                <div className='flex flex-col gap-10 w-[40%] items-start'>
                    <div className='text-[16px]'>
                      The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist required more than professional skills 
                    </div>
                    <CTAButton active={true} linkto={"/signup"}>
                      Learn more
                    </CTAButton>
                </div>
                </div>
        <TimeLineSection/>
        <LearningLanguageSection />
        </div>
      </div>
      {/*Section3 */}
      <div className='w-11/12 flex mx-auto max-w-maxContent flex-col items-center justify-between gap-8  text-white bg-[#000917] overflow-hidden'>
        <InstructorSection/>
        <h2 className='text-center text-4xl font-semibold'>Review from other Learners</h2>
        {/*Slider*/}
      </div>
      {/*Section4 */}
    </div>
  )
}
