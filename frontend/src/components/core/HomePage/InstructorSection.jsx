import Instructor from "../../../assets/Instructor.png";
import { HighlightText } from "./HighlightText";
import { CTAButton } from "./Button";
import { FaArrowRight } from "react-icons/fa";

export const InstructorSection = () => {
  return (
    <div className="mt-10 sm:mt-16 w-full">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-center">
        {/* Image */}
        <div className="w-full lg:w-[50%] flex justify-center">
          <img
            src={Instructor}
            alt="Instructor"
            className="shadow-white object-contain w-full max-w-[420px] lg:max-w-none rounded-xl"
          />
        </div>

        {/* Text */}
        <div className="w-full lg:w-[50%] flex flex-col gap-6 sm:gap-10 text-center lg:text-left">
          <div className="text-3xl sm:text-4xl font-semibold">
            Become an
            <HighlightText text={"Instructor"} />
          </div>
          <p className="font-medium text-[15px] sm:text-[16px] text-[#838894] lg:w-[90%]">
            Instructors from around the world teach millions of students on
            StudyNotion. We provide the tools and skills to teach what you love.
          </p>
          <div className="flex justify-center lg:justify-start">
            <CTAButton active={true} linkto={"/signup"}>
              <div className="flex flex-row gap-2 items-center">
                Start Learning Today
                <FaArrowRight />
              </div>
            </CTAButton>
          </div>
        </div>
      </div>
    </div>
  );
};
