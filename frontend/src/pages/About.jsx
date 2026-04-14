import React from 'react'
import { HighlightText } from '../components/core/HomePage/HighlightText'
import About4 from "../assets/About4.jpg";
import { LearningGrid } from '../components/core/AboutPage/LearningGrid';
import ContactFormSection from './ContactFormSection';
import { getImage } from '../utils/constants';

const About = () => {

  const stats = [
    { no: "5K+", text: "Active Students" },
    { no: "10+", text: "Expert Mentors" },
    { no: "200+", text: "Courses Available" },
    { no: "50+", text: "Industry Awards" },
  ];

  const features = [
    {
      title: "Industry-Focused Curriculum",
      description: "Our courses are designed with direct input from industry experts, ensuring you learn exactly what companies are looking for."
    },
    {
      title: "Hands-on Learning",
      description: "We emphasize project-based learning so you gain real-world experience while building your portfolio."
    },
    {
      title: "Recognized Certifications",
      description: "Earn certifications that showcase your skills and help you stand out in competitive job markets."
    },
    {
      title: "Smart Evaluation",
      description: "Our automated grading and feedback system helps you track your progress efficiently."
    },
    {
      title: "Career Readiness",
      description: "We prepare you not just to learn, but to succeed in real-world jobs and internships."
    },
  ];

  return (
    <div className='text-white w-full'>

      {/* SECTION 1 - HERO */}
      <div className='min-h-[500px] px-4 md:px-[9vw] pt-20 flex flex-col items-center text-center bg-[#2c333f]'>

        <h1 className='text-2xl md:text-4xl font-semibold leading-tight'>
          Driving Innovation in Online Education for a <br />
          <HighlightText text={"Brighter Future"} />
        </h1>

        <p className='text-sm md:text-lg mt-4 max-w-[800px] text-[#838894]'>
          Studynotion is redefining how people learn by combining cutting-edge technology,
          expert-led courses, and a vibrant community. We aim to make high-quality education
          accessible, practical, and career-focused.
        </p>

        {/* Images */}
        <div className='mt-10 flex flex-wrap justify-center gap-4'>
          {[1, 2, 3].map((_, i) => (
            <img
              key={i}
              src={getImage("About3_nmyw4k.jpg")}
              className='w-[90%] sm:w-[250px] h-auto shadow-md rounded-md'
              alt="Learning"
            />
          ))}
        </div>
      </div>

      {/* SECTION 2 - MISSION */}
      <div className='py-16 px-4 md:px-[9vw] text-center border-b border-gray-700'>
        <h2 className='text-xl md:text-3xl font-medium max-w-[900px] mx-auto leading-relaxed'>
          We are on a mission to transform education by making learning accessible,
          engaging, and aligned with real-world industry needs. Our platform bridges
          the gap between knowledge and practical application.
        </h2>
      </div>

      {/* SECTION 3 - STORY + IMAGE */}
      <div className='flex flex-col md:flex-row items-center w-full'>

        <div className='md:w-1/2 w-full px-4 md:px-16 py-10 flex flex-col gap-6 text-center md:text-left'>
          <h2 className='text-3xl md:text-4xl font-semibold'>Our Journey</h2>
          <p className='text-[#838894]'>
            Studynotion started with a simple idea: education should be accessible to everyone,
            regardless of location or background. What began as a small initiative has now grown
            into a thriving learning platform used by thousands of students.
          </p>
          <p className='text-[#838894]'>
            We continuously evolve by integrating new technologies, listening to our learners,
            and adapting to industry trends—ensuring that our students stay ahead.
          </p>
        </div>

        <div className='md:w-1/2 w-full flex justify-center items-center px-4 py-10'>
          <img
            src={About4}
            alt='About'
            className='w-full max-w-[400px] rounded-lg shadow-lg'
          />
        </div>
      </div>

      {/* SECTION 4 - FEATURES */}
      <div className='px-4 md:px-[9vw] py-16'>
        <h2 className='text-3xl md:text-4xl font-semibold text-center mb-12'>
          What Makes Us Different
        </h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
          {
            features.map((item, index) => (
              <div key={index} className='bg-[#2c333f] p-6 rounded-lg shadow-md'>
                <h3 className='text-xl font-semibold mb-2'>{item.title}</h3>
                <p className='text-[#838894]'>{item.description}</p>
              </div>
            ))
          }
        </div>
      </div>

      {/* SECTION 5 - STATS */}
      <div className='bg-[#2c333f] py-12 px-4 md:px-[9vw] grid grid-cols-2 md:grid-cols-4 gap-6 text-center'>
        {
          stats.map((data, index) => (
            <div key={index}>
              <h1 className='text-2xl md:text-4xl font-semibold'>{data.no}</h1>
              <p className='text-[#838894]'>{data.text}</p>
            </div>
          ))
        }
      </div>

      {/* SECTION 6 - LEARNING GRID + CONTACT */}
      <div className='px-4 md:px-[9vw] py-16 flex flex-col gap-16'>
        <LearningGrid />
        <ContactFormSection />
      </div>

      {/* SECTION 7 - REVIEWS */}
      <div className='px-4 md:px-[9vw] py-16 text-center'>
        <h2 className='text-3xl md:text-4xl font-semibold mb-6'>
          What Our Learners Say
        </h2>
        <p className='text-[#838894] max-w-[700px] mx-auto'>
          Thousands of students trust Studynotion to upgrade their skills and transform their careers.
          Join a growing community of learners achieving their goals.
        </p>
      </div>

    </div>
  )
}

export default About