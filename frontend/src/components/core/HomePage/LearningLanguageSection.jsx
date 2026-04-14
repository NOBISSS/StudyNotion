import { HighlightText } from "./HighlightText";
import Know_your_progress from "../../../assets/Know_your_progress.png";
import Plan_your_lessons from "../../../assets/Plan_your_lessons.svg";
import Compare_with_others from "../../../assets/Compare_with_others.svg";
import { CTAButton } from "./Button";

export const LearningLanguageSection = () => {
  return (
    <div className="mt-16 sm:mt-[130px] mb-16 sm:mb-32 w-full">
      <div className="flex flex-col gap-5 items-center">
        <div className="text-3xl sm:text-4xl font-semibold text-center">
          Your Swiss Knife for
          <HighlightText text={"Learning any Language"} />
        </div>

        <div className="text-center mx-auto text-sm sm:text-base font-medium w-full sm:w-[80%] lg:w-[70%] px-4 sm:px-0">
          Using spin making learning multiple language easy. with 20+ languages
          realistic voice-over, progress tracking, custom schedule and more.
        </div>

        {/* Images — stack on mobile, overlap on desktop */}
        <div className="flex flex-col sm:flex-row items-center justify-center mt-5 w-full">
          {/* Mobile: stacked, Desktop: overlapping */}
          <div className="hidden sm:flex flex-row items-center justify-center">
            <img
              src={Know_your_progress}
              alt="Know your progress"
              className="object-contain -mr-16 lg:-mr-32 w-[280px] lg:w-auto"
            />
            <img
              src={Compare_with_others}
              alt="Compare with others"
              className="object-contain z-10 w-[280px] lg:w-auto"
            />
            <img
              src={Plan_your_lessons}
              alt="Plan your lessons"
              className="object-contain -ml-16 lg:-ml-36 w-[280px] lg:w-auto"
            />
          </div>

          {/* Mobile: vertical stack, no overlap */}
          <div className="flex sm:hidden flex-col items-center gap-6 w-full px-4">
            <img
              src={Know_your_progress}
              alt="Know your progress"
              className="object-contain w-full max-w-[280px]"
            />
            <img
              src={Compare_with_others}
              alt="Compare with others"
              className="object-contain w-full max-w-[280px]"
            />
            <img
              src={Plan_your_lessons}
              alt="Plan your lessons"
              className="object-contain w-full max-w-[280px]"
            />
          </div>
        </div>

        <div className="w-fit">
          <CTAButton active={true} linkto={"/signup"}>
            Learn More
          </CTAButton>
        </div>
      </div>
    </div>
  );
};
