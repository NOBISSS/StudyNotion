import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { ReviewCard } from "../components/core/CourseDetail";
import { CTAButton } from "../components/core/HomePage/Button";
import { CodeBlocks } from "../components/core/HomePage/CodeBlocks";
import { ExploreMore } from "../components/core/HomePage/ExploreMore";
import { HighlightText } from "../components/core/HomePage/HighlightText";
import { InstructorSection } from "../components/core/HomePage/InstructorSection";
import { LearningLanguageSection } from "../components/core/HomePage/LearningLanguageSection";
import { TimeLineSection } from "../components/core/HomePage/TimeLineSection";

export const Home = () => {
  const user = useSelector((store) => store.profile.user);

  const reviews = [
    {
      _id: "1",
      user: {
        firstName: "Amit",
        lastName: "Sharma",
        image: null,
        accountType: "Student",
      },
      review:
        "This platform completely changed how I learn coding. The UI is clean and the lessons are super easy to follow.",
      rating: 4.5,
    },
    {
      _id: "2",
      user: {
        firstName: "Priya",
        lastName: "Patel",
        image: null,
        accountType: "Student",
      },
      review:
        "Loved the hands-on projects! I was able to build real-world apps within weeks.",
      rating: 5,
    },
    {
      _id: "3",
      user: {
        firstName: "Rahul",
        lastName: "Verma",
        image: null,
        accountType: "Instructor",
      },
      review:
        "Great platform for both learners and instructors. Content quality is top-notch.",
      rating: 4.2,
    },
    {
      _id: "4",
      user: {
        firstName: "Sneha",
        lastName: "Iyer",
        image: null,
        accountType: "Student",
      },
      review:
        "The timeline and structured learning paths really helped me stay consistent.",
      rating: 4.8,
    },
    {
      _id: "5",
      user: {
        firstName: "Karan",
        lastName: "Mehta",
        image: null,
        accountType: "Student",
      },
      review:
        "Good courses, but I wish there were more advanced topics. Still worth it!",
      rating: 3.9,
    },
    {
      _id: "6",
      user: {
        firstName: "Neha",
        lastName: "Gupta",
        image: null,
        accountType: "Student",
      },
      review:
        "Amazing experience! The instructors explain concepts very clearly.",
      rating: 4.7,
    },
    {
      _id: "7",
      user: {
        firstName: "Arjun",
        lastName: "Reddy",
        image: null,
        accountType: "Student",
      },
      review:
        "I started from zero and now I can build full-stack apps. Highly recommend!",
      rating: 5,
    },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* ── Section 1: Hero ─────────────────────────────────────── */}
      <div className="relative mx-auto flex flex-col max-w-maxContent w-11/12 items-center text-white justify-between">
        {/* Instructor CTA pill */}
        <Link to={"/signup"}>
          <div className="group mt-10 sm:mt-16 p-1 rounded-full bg-[#161D29] font-bold text-[#999DAA] transition-all duration-200 hover:scale-95 w-fit">
            <div className="flex flex-row items-center gap-2 sm:gap-3 rounded-full px-6 sm:px-10 py-[5px] transition-all shadow-[0_0.50px_0_0_rgba(255,255,255,0.4)] duration-200 group-hover:bg-[#000917] text-sm sm:text-base">
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>

        {/* Hero heading */}
        <div className="text-center text-3xl sm:text-4xl font-semibold mt-5 sm:mt-7 px-2">
          Empower Your Future with
          <HighlightText text={"Coding Skills"} />
        </div>

        {/* Hero subheading */}
        <div className="w-full sm:w-[85%] lg:w-[80%] text-center text-sm sm:text-base lg:text-lg font-bold text-[#999DAA] mt-3 sm:mt-4 px-2">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </div>

        {/* CTA buttons */}
        {!user && (
          <div className="flex flex-row gap-4 sm:gap-7 mt-6 sm:mt-8">
            <CTAButton active={true} linkto={"/signup"}>
              Learn More
            </CTAButton>
            <CTAButton active={false} linkto={"/login"}>
              Book Demo
            </CTAButton>
          </div>
        )}

        {/* Hero video */}
        <div className="shadow-[10px_-5px_50px_-5px] shadow-blue-200 my-8 sm:my-12 w-full">
          <video
            className="shadow-[20px_20px_rgba(255,255,255)] w-full rounded-lg"
            muted
            loop
            autoPlay
            playsInline
          >
            <source src="/banner.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Code Section 1 */}
        <div className="w-full">
          <CodeBlocks
            user={user}
            backgroundGradient={"codeblock1"}
            position={"lg:flex-row"}
            heading={
              <div className="text-3xl sm:text-4xl font-semibold">
                Unlock Your
                <HighlightText text={"coding potential"} />
                with our online courses
              </div>
            }
            subheading={
              "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
            }
            ctabtn1={{
              btnText: "Try it Yourself",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{ btnText: "Learn more", linkto: "/login", active: false }}
            codeblock={
              '<!DOCTYPE html>\n<html>head><title>Example<title><linkrel="stylesheet" href="styles.css">'
            }
            codecolor={"text-[#E7BC5B]"}
          />
        </div>

        {/* Code Section 2 */}
        <div className="w-full">
          <CodeBlocks
            user={user}
            backgroundGradient={"codeblock2"}
            position={"lg:flex-row-reverse"}
            heading={
              <div className="text-3xl sm:text-4xl font-semibold">
                Start
                <HighlightText text={"coding in seconds"} />
              </div>
            }
            subheading={
              "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
            }
            ctabtn1={{
              btnText: "Continue Lesson",
              linkto: "/signup",
              active: true,
            }}
            ctabtn2={{ btnText: "Learn More", linkto: "/login", active: false }}
            codeblock={
              '<!DOCTYPE html>\n<html>head><title>Example<title><linkrel="stylesheet" href="styles.css">'
            }
            codecolor={"text-[#E7BC5B]"}
          />
        </div>

        {/* Explore heading */}
        <div className="text-3xl sm:text-4xl font-semibold text-center px-2">
          Unlock the
          <HighlightText text={"Power of Code"} />
        </div>
        <p className="text-center text-sm sm:text-[16px] text-[#838894] mt-3 px-2">
          Learn to Build anything You can imagine
        </p>

        <ExploreMore
          element={[
            "Free",
            "New to Coding",
            "Most popular",
            "Skill paths",
            "Career paths",
          ]}
          isCards={true}
        />
      </div>

      {/* ── Section 2: Light bg ─────────────────────────────────── */}
      <div className="bg-[rgb(249,249,249)] text-[#000814]">
        <div className="homepage_bg h-[200px] sm:h-[310px]">
          <div className="w-11/12 max-w-maxContent flex flex-col items-center gap-5 mx-auto justify-center h-full">
            <div className="flex flex-row flex-wrap gap-4 sm:gap-7 text-white justify-center pt-16 sm:pt-[150px]">
              <CTAButton active={true} linkto={"/signup"}>
                <div className="flex flex-row items-center gap-2">
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </CTAButton>
              <CTAButton active={false} linkto={"/login"}>
                <div>Learn More</div>
              </CTAButton>
            </div>
          </div>
        </div>

        <div className="mx-auto w-11/12 max-w-maxContent flex flex-col items-center gap-7">
          {/* Skills headline */}
          <div className="flex flex-col lg:flex-row gap-8 mb-6 sm:mb-10 mt-12 sm:mt-[95px] w-full">
            <div className="text-3xl sm:text-4xl font-semibold w-full lg:w-[45%] text-center lg:text-left">
              Get the Skills you need for a
              <HighlightText text={"Job that is in demand"} />
            </div>
            <div className="flex flex-col gap-6 sm:gap-10 w-full lg:w-[40%] items-center lg:items-start">
              <div className="text-[15px] sm:text-[16px] text-center lg:text-left">
                The modern StudyNotion dictates its own terms. Today, to be a
                competitive specialist requires more than just professional
                skills.
              </div>
              <CTAButton active={true} linkto={"/signup"}>
                Learn more
              </CTAButton>
            </div>
          </div>

          <TimeLineSection />
          <LearningLanguageSection />
        </div>
      </div>

      {/* ── Section 3: Dark bg ──────────────────────────────────── */}
      <div className="w-11/12 flex mx-auto max-w-maxContent flex-col items-center justify-between gap-8 text-white bg-[#000917] overflow-hidden pb-10">
        <InstructorSection />

        {/* Reviews */}
        <h2 className="text-center text-3xl sm:text-4xl font-semibold mt-4">
          Reviews from other Learners
        </h2>

        <section className="w-full mb-6 sm:mb-10">
          {reviews?.length > 0 ? (
            // Scrollable row on mobile, wrapping grid on md+
            <div
              className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4
              overflow-x-auto md:overflow-x-visible
              pb-3 md:pb-0
              scrollbar-hide
            "
            >
              {reviews.map((review, i) => (
                <div
                  key={review._id || i}
                  className="flex-shrink-0 w-[280px] sm:w-[300px] md:w-auto"
                >
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#6B7280] text-sm text-center">
              No reviews yet. Be the first to review!
            </p>
          )}
        </section>
      </div>
    </div>
  );
};
