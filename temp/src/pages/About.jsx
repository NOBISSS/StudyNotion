import React from 'react'
import { HighlightText } from '../components/core/HomePage/HighlightText'
import About3 from "../assets/About3.jpg";
import About4 from "../assets/About4.jpg";
import { CTAButton } from '../components/core/HomePage/Button';
import { LearningGrid } from '../components/core/AboutPage/LearningGrid';
import ContactFormSection from './ContactFormSection';
const About = () => {
const AboutData=[
    {
        no:"5K",
        text:"Active Students"
    },
    {
        no:"10+",
        text:"Members"
    },
    {
        no:"200+",
        text:"Course"
    },
    {
        no:"50+",
        text:"Awards"
    },
]

const AboutData1=[
    {
        title:"Curriculum Based on Industry Needs",
        description:"Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs."
    },{
        title:"Our Learning Methods",
        description:"Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs."
    },
    {
        title:"Certification",
        description:"Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs."
    },
    {
        title:'Rating "Auto-Grading"',
        description:"Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs."
    },
    {
        title:"Ready to Work",
        description:"Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs."
    },
]
  return (
    <div className='text-white w-full'
    >
        {/*SECTION  -1 */}
        <div className='min-h-[500px] px-4 bg-[#2c333f] 
        md:px-[9vw] pt-20 flex flex-col items-center text-center'>
            
            <h1 className='text-2xl md:text-4xl font-semibold loading-tight'>Driving Innvoation in Online Education for a<br></br><HighlightText text={"Brighter Future"}/></h1>
            <p className='text-sm md:text-lg mt-4 max-w-[800px] text-[#838894]'>Studynotion is at the forefront of driving innovation in online education. We're passionate about creating a brighter future by offering cutting-edge courses, leveraging emerging technologies, and nurturing a vibrant learning community.</p>
            {/*Responsive Images */}
            <div className='photos mt-10 flex justify-center gap-6 md:h-[200px]'>
            <img src={About3} className='w-auto h-[270px] shadow-md'
             alt="A3"/>
            <img src={About3} alt="A3" className='w-auto h-[270px] shadow-md'/>
            <img src={About3} alt="A3" className='w-auto h-[270px] shadow-md'/>
            </div>
        </div>
        {/**SECTION 2 */}
        <div className='py-30 px-4 flex items-center justify-center border-b-1 border-gray-600'>
            <h1 className='text-xl md:text-3xl font-medium max-w-[1000px] text-center loading-relaxed'>
               We are passionate about revolutionizing the way we learn. Our innovative platform combines technology, expertise, and community to create an unparalleled educational experience. 
            </h1>
            
        </div>
        {/*SECTION 3 */}
        <div className='flex w-full'>
            <div className='part1 px-35 py-20 w-[55%] flex flex-col gap-10'>
                <h1 className='text-4xl font-semibold'>Our Founding Story</h1>
                <p className='text-[#838894]'>
                  Our e-learning platform was born out of a shared vision and passion for transforming education. It all began with a group of educators, technologists, and lifelong learners who recognized the need for accessible, flexible, and high-quality learning opportunities in a rapidly evolving digital world. 
                </p>
                <p className='text-[#838894]'>
                    As experienced educators ourselves, we witnessed firsthand the limitations and challenges of traditional education systems. We believed that education should not be confined to the walls of a classroom or restricted by geographical boundaries. We envisioned a platform that could bridge these gaps and empower individuals from all walks of life to unlock their full potential.
                </p>
            </div>
            <div className='w-[45%] flex items-center py-30 px-25 justify-center'>
            <img src={About4} alt='StudyImage' className='w-2/1'>
            </img>
            </div>
        </div>
        {/*SECTION 4 */}
        <div className='flex w-full'>
            <div className='part1 px-35 py-20 w-[55%] flex flex-col gap-10'>
                <h1 className='text-4xl font-semibold'>Our Founding Story</h1>
                <p className='text-[#838894]'>
                  Our e-learning platform was born out of a shared vision and passion for transforming education. It all began with a group of educators, technologists, and lifelong learners who recognized the need for accessible, flexible, and high-quality learning opportunities in a rapidly evolving digital world. 
                </p>
            </div>
            <div className='w-[45%] flex flex-col p-10 gap-10 items-start justify-center'>
              <h1 className='text-4xl font-semibold'>Our Founding Story</h1>
                <p className='text-[#838894]'>
                  Our e-learning platform was born out of a shared vision and passion for transforming education. It all began with a group of educators, technologists, and lifelong learners who recognized the need for accessible, flexible, and high-quality learning opportunities in a rapidly evolving digital world. 
                </p>
            </div>
        </div>
        {/*SECTION 5 */}
        <div className='h-[100px] bg-[#2c333f] flex items-center justify-evenly'>
            {
                AboutData.map((data,index)=>(
                <div className='flex flex-col text-center' key={index}>
                    <h1 className='text-white text-4xl font-semibold'>{data.no}</h1>
                    <p className='text-[#838894]'>{data.text}</p>
                </div>
                ))
            }
        </div>
        {/*SECTION 6 */}
        <div className='mx-auto flex flex-col justify-between gap-10'>
        <LearningGrid/>
        <ContactFormSection/>
        </div>
        {/* Reviwes */}
        <div>
            <div>
                Reviews From Other Learners
            </div>
        </div>
    </div>
  )
}

export default About