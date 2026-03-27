import React from 'react'
import ContactUsForm from '../components/core/ContactUs/ContactUsForm'

const ContactFormSection = () => {
  return (
    <div className='mx-auto'>
      <center>
        <h1 className='text-5xl font-semibold m-5'>Get in Touch</h1>
        <p className='text-[20px] text-[#838894] tracking-wide'>We'd love to here for you.Please fill out here</p>
        </center>
        <div>
            <ContactUsForm/>
        </div>
    </div>
  )
}

export default ContactFormSection