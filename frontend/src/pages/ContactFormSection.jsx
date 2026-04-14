import React from "react";
import ContactUsForm from "../components/core/ContactUs/ContactUsForm";

const ContactFormSection = () => {
  return (
    <div className="w-full px-4 md:px-[9vw] py-12 flex flex-col items-center">
      <div className="text-center max-w-[700px]">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4">
          Get in Touch
        </h1>

        <p className="text-base sm:text-lg text-[#838894]">
          We'd love to hear from you. Please fill out the form below.
        </p>
      </div>

      <div className="w-full max-w-[800px] mt-10">
        <ContactUsForm />
      </div>
    </div>
  );
};

export default ContactFormSection;
