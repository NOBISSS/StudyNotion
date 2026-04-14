import { CTAButton } from "../HomePage/Button";
import { FaArrowRight } from "react-icons/fa";
import { TypeAnimation } from "react-type-animation";

export const CodeBlocks = ({
  user,
  position,
  heading,
  subheading,
  ctabtn1,
  ctabtn2,
  codeblock,
  backgroundGradient,
  codecolor,
}) => {
  return (
    <div
      className={`flex flex-col ${position} my-10 sm:my-20 justify-between gap-8 sm:gap-10 w-full`}
    >
      {/* Text block */}
      <div className="w-full lg:w-[50%] flex flex-col gap-6 sm:gap-8">
        {heading}
        <div className="text-[#838894] font-bold text-sm sm:text-base">
          {subheading}
        </div>
        {!user && (
          <div className="flex flex-wrap gap-4 sm:gap-7 mt-4 sm:mt-7">
            <CTAButton active={ctabtn1.active} linkto={ctabtn1.linkto}>
              <div className="flex gap-2 items-center">
                {ctabtn1.btnText}
                <FaArrowRight />
              </div>
            </CTAButton>
            <CTAButton active={ctabtn2.active} linkto={ctabtn2.linkto}>
              {ctabtn2.btnText}
            </CTAButton>
          </div>
        )}
      </div>

      {/* Code block */}
      <div className="relative code-border text-[10px] w-full lg:w-[500px] py-4 flex flex-row bg-[#0E1A2D3D]">
        <div className={`${backgroundGradient} absolute`}></div>
        <div className="text-center flex flex-col w-[10%] text-[#6E727F] font-inter font-bold select-none">
          {Array.from({ length: 11 }, (_, i) => (
            <p key={i}>{i + 1}</p>
          ))}
        </div>
        <div
          className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codecolor} pr-2`}
        >
          <TypeAnimation
            sequence={[codeblock, 10000, ""]}
            repeat={Infinity}
            cursor={true}
            omitDeletionAnimation={true}
            style={{ whiteSpace: "pre-line", display: "block" }}
          />
        </div>
      </div>
    </div>
  );
};
