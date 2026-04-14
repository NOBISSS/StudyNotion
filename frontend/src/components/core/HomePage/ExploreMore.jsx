import { useState } from 'react'
import { HomePageExplore } from "../../../data/homepage-explore"
import { Card } from './Card';

export const ExploreMore = ({ element, isCards = false, customCss }) => {
    const tabsName = HomePageExplore.map((course) => course.tag);
    const [currentTab, setCurrentTab] = useState(tabsName[0]);
    const [courses, setCourses] = useState(HomePageExplore[0].courses);
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading);
    const setMyCards = (value) => {
        setCurrentCard(value);
        const result = HomePageExplore.filter((course) => course.tag.toLowerCase() === value.toLowerCase());
        setCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading);
    }
    return (
        <div className='z-1'>
            <div className='flex flex-row rounded-full bg-[#161D29] mb-5 mt-5 ml-10 shadow-[0_0.50px_0_0_rgba(255,255,255,0.4)] py-1 px-1 w-fit'>
                {
                    tabsName.map((element, index) => {
                        return (
                            <div
                                className={`text-[16px] flex flex-row items-center gap-2
                        ${currentTab === element ? "bg-[#000917] text-white font-medium"
                                        : "text-[#838894]"} rounded-full transition-all duration-200 cursor-pointer hover:bg-[#000917] hover:text-[#F9F9F9] px-7 py-2`}
                                key={index}
                                onClick={() => {
                                    setCurrentTab(element)
                                    setMyCards(element);
                                }}
                            >
                                {element}
                            </div>
                        )
                    })
                }
            </div>
            {isCards && <div className="relative lg:h-[150px] w-full h-full">
                {/*Course Card ka group*/}
                <div className='flex flex-row gap-20 justify-between w-full h-full z-10'>
                    {
                        courses.map((element, index) => {
                            return (
                                <Card
                                    key={index}
                                    cardData={element}
                                    currentCard={currentCard}
                                    setCurrentCard={setCurrentCard}
                                />
                            )
                        })
                    }
                </div>
            </div>}
        </div>
    )
}
