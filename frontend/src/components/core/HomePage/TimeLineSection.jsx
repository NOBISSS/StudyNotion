import Logo1 from "../../../assets/Logo1.svg";
import Logo2 from "../../../assets/Logo2.svg";
import Logo3 from "../../../assets/Logo3.svg";
import Logo4 from "../../../assets/Logo4.svg";
import Line3 from "../../../assets/Line 3.png";
import TimeLineImage from "../../../assets/TimelineImage.png";

const timelineData = [
  {
    logo: Logo1,
    heading: "Leadership",
    description: "Fully committed to the success company",
  },
  {
    logo: Logo2,
    heading: "Responsibility",
    description: "Students will always be our top priority",
  },
  {
    logo: Logo3,
    heading: "Flexibility",
    description: "The ability to switch is an important skill",
  },
  {
    logo: Logo4,
    heading: "Solve the problem",
    description: "Code your way to a solution",
  },
];

export const TimeLineSection = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-15 items-center w-full">
        {/* Timeline list */}
        <div className="w-full lg:w-[45%] flex flex-col gap-1">
          {timelineData.map((element, index) => (
            <div key={index}>
              <div className="flex flex-row gap-4 sm:gap-6">
                <div className="w-[44px] h-[44px] sm:w-[50px] sm:h-[50px] bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <img src={element.logo} alt={element.heading} />
                </div>
                <div>
                  <h2 className="font-semibold text-[16px] sm:text-[18px]">
                    {element.heading}
                  </h2>
                  <p className="text-sm sm:text-base">{element.description}</p>
                </div>
              </div>
              {index !== timelineData.length - 1 && (
                <div className="ml-5 sm:ml-6 mt-3">
                  <img src={Line3} alt="" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Timeline image + stats badge */}
        <div className="relative w-full lg:w-auto flex justify-center">
          <img
            src={TimeLineImage}
            alt="Timeline"
            className="shadow-white object-cover w-full max-w-[480px] lg:max-w-none"
          />
          {/* Stats badge */}
          <div
            className="absolute flex flex-row text-white bg-[#014A32] uppercase
            py-4 sm:py-6
            bottom-0 sm:bottom-auto
            left-1/2 -translate-x-1/2
            sm:left-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%]
            w-[90%] sm:w-auto
            justify-center
          "
          >
            <div className="flex flex-row gap-3 sm:gap-5 items-center border-r border-[#037957] px-4 sm:px-7">
              <p className="text-2xl sm:text-3xl font-bold">10</p>
              <p className="text-[#05A77B] text-xs sm:text-sm">
                Years of Experience
              </p>
            </div>
            <div className="flex gap-3 sm:gap-5 items-center px-4 sm:px-7">
              <p className="text-2xl sm:text-3xl font-bold">250</p>
              <p className="text-[#05A77B] text-xs sm:text-sm">
                Types of Courses
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
