import { useState } from "react";
import { HomePageExplore } from "../../../data/homepage-explore";
import { Card } from "./Card";

export const ExploreMore = ({ element, isCards = false }) => {
  const tabsName = HomePageExplore.map((course) => course.tag);
  const [currentTab, setCurrentTab] = useState(tabsName[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [currentCard, setCurrentCard] = useState(
    HomePageExplore[0].courses[0].heading,
  );

  const setMyCards = (value) => {
    setCurrentTab(value);
    const result = HomePageExplore.filter(
      (course) => course.tag.toLowerCase() === value.toLowerCase(),
    );
    setCourses(result[0].courses);
    setCurrentCard(result[0].courses[0].heading);
  };

  return (
    <div className="z-1 w-full">
      {/* Tabs — scrollable on mobile */}
      <div className="flex flex-row rounded-full bg-[#161D29] mb-5 mt-5 shadow-[0_0.50px_0_0_rgba(255,255,255,0.4)] py-1 px-1 w-full sm:w-fit overflow-x-auto scrollbar-hide">
        {tabsName.map((tab, index) => (
          <div
            key={index}
            className={`text-[13px] sm:text-[16px] flex-shrink-0 flex flex-row items-center gap-2
              ${
                currentTab === tab
                  ? "bg-[#000917] text-white font-medium"
                  : "text-[#838894]"
              } rounded-full transition-all duration-200 cursor-pointer hover:bg-[#000917] hover:text-[#F9F9F9] px-4 sm:px-7 py-2`}
            onClick={() => setMyCards(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Cards — 1 col on mobile, 3 on desktop */}
      {isCards && (
        <div className="w-full pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 w-full">
            {courses.map((element, index) => (
              <Card
                key={index}
                cardData={element}
                currentCard={currentCard}
                setCurrentCard={setCurrentCard}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
