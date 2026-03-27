import React from 'react'
import { BiChat } from 'react-icons/bi'
import { IoMdChatbubbles } from "react-icons/io";
import ContactFormSection from './ContactFormSection';

const ContactUs = () => {
    const ContactData=[
        {
            icon:<IoMdChatbubbles />,
            title:"Chat on us",
            description:"Our friendly team is here to help.",
            cn:"info@studynotion.com"
        },
        {
            icon:<IoMdChatbubbles />,
            title:"Chat on us",
            description:"Our friendly team is here to help.",
            cn:"info@studynotion.com"
        },
        {
            icon:<IoMdChatbubbles />,
            title:"Chat on us",
            description:"Our friendly team is here to help.",
            cn:"info@studynotion.com"
        },
    ]
  return (
    <div className='text-white flex gap-10 mt-10 p-10 px-40  ' 
    >
        <div className='bg-[#161D29] rounded-2xl w-[500px] h-fit py-10 flex flex-col px-10 gap-10'>
            {
                ContactData.map((data)=>(
        <div className='flex flex-col items-start'>
            <div className='flex items-center '>
                <h1 className='text-white text-2xl'>{data.icon}</h1>
        <h1 className='text-white text-[23px]'>{data.title}</h1>
        </div>
                        
                            <p className='text-[#999DAA]'>
                                {data.description}
                            </p>
                            <p className='text-[#999DAA]'>
                                {data.cn}
                            </p>
                        
                    </div>
                ))
            }
        </div>
        {/*CONTACT FORM */}
        <div>
            <ContactFormSection/>
        </div>
        {/*TODO:REVIEW */}
    </div>
  )
}

export default ContactUs