import { CTAButton } from "../HomePage/Button"
import { HighlightText } from "../HomePage/HighlightText"

const AboutData1 = [
  {
    order: -1,
    title: "World-Class Learning For ",
    highlightText: "Anyone, Anywhere",
    description:
      "Save time and money! The Belajar curriculum is designed to be easy to understand and aligned with industry needs.",
    BtnText: "Learn More",
    BtnLink: "/",
  },
  {
    order: 1,
    title: "Curriculum Based on Industry Needs",
    description:
      "Our curriculum is constantly updated based on real-world industry requirements.",
  },
  {
    order: 2,
    title: "Our Learning Methods",
    description:
      "We focus on hands-on, project-based learning to build real skills.",
  },
  {
    order: 3,
    title: "Certification",
    description:
      "Earn certifications that validate your knowledge and boost your career.",
  },
  {
    order: 4,
    title: 'Auto-Grading System',
    description:
      "Track your progress instantly with our smart evaluation system.",
  },
  {
    order: 5,
    title: "Career Ready Approach",
    description:
      "We prepare you for real-world jobs, not just theoretical knowledge.",
  },
]

export const LearningGrid = () => {
  return (
    <div className="w-full px-4 md:px-[9vw] py-12">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {AboutData1.map((card, index) => {
          const isHero = card.order < 0

          return (
            <div
              key={index}
              className={`
                rounded-lg overflow-hidden
                ${isHero ? "sm:col-span-2 lg:col-span-2" : ""}
                ${card.order % 2 === 0 ? "bg-[#161D29]" : "bg-[#2C333F]"}
              `}
            >
              {isHero ? (
                <div className="flex flex-col justify-center h-full p-6 sm:p-10 md:p-12 gap-4 bg-[#000814]">

                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug">
                    {card.title}
                    <HighlightText text={card.highlightText} />
                  </h1>

                  <p className="text-sm sm:text-base text-[#AFB2BF] max-w-[500px]">
                    {card.description}
                  </p>

                  <div className="w-fit mt-2">
                    <CTAButton active={true} linkto={card.BtnLink}>
                      {card.BtnText}
                    </CTAButton>
                  </div>

                </div>
              ) : (
                <div className="flex flex-col h-full p-5 sm:p-6 gap-3">

                  <h2 className="text-lg sm:text-xl text-white font-semibold">
                    {card.title}
                  </h2>

                  <p className="text-sm sm:text-base text-[#AFB2BF]">
                    {card.description}
                  </p>

                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}