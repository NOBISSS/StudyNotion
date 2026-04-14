import React from "react";
import { IoMdChatbubbles } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import ContactFormSection from "./ContactFormSection";

const ContactUs = () => {
  const ContactData = [
    {
      icon: <IoMdChatbubbles />,
      title: "Live Chat",
      description: "Our friendly team is here to help you anytime.",
      info: "Start a live conversation",
    },
    {
      icon: <MdEmail />,
      title: "Email Support",
      description: "Reach out to us via email and we'll respond quickly.",
      info: "support@studynotion.com",
    },
    {
      icon: <FaPhoneAlt />,
      title: "Call Us",
      description: "Prefer speaking directly? Give us a call.",
      info: "+91 98765 43210",
    },
  ];

  return (
    <div className="w-full px-4 md:px-[9vw] py-12 text-white">
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* LEFT SIDE - CONTACT INFO */}
        <div className="w-full lg:w-[40%] bg-[#161D29] rounded-2xl p-6 sm:p-8 flex flex-col gap-8">
          {ContactData.map((data, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="text-2xl text-yellow-400">{data.icon}</div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold">
                  {data.title}
                </h3>

                <p className="text-[#999DAA] text-sm sm:text-base">
                  {data.description}
                </p>

                <p className="text-[#999DAA] text-sm sm:text-base mt-1">
                  {data.info}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="w-full lg:w-[60%]">
          <ContactFormSection />
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
