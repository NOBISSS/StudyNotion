export const Card = ({ cardData, currentCard, setCurrentCard }) => {
  const isActive = currentCard === cardData;
  return (
    <div
      className="relative w-full cursor-pointer"
      onClick={() => setCurrentCard(cardData)}
    >
      {isActive && (
        <div className="absolute inset-0 translate-x-2 translate-y-2 sm:translate-x-3 sm:translate-y-3 bg-yellow-400 rounded-xl z-0 transition-all duration-300"></div>
      )}
      <div
        className={`relative z-10 w-full rounded-xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 min-h-[160px] sm:min-h-[180px]
          ${
            isActive
              ? "bg-white text-black shadow-xl scale-105"
              : "bg-[#161D29] text-white hover:scale-95"
          }`}
      >
        <div className="flex flex-col gap-3">
          <h1 className="text-base sm:text-lg font-semibold leading-snug">
            {cardData.heading}
          </h1>
          <p className="text-sm text-[#838894]">{cardData.description}</p>
        </div>
        <div className="flex justify-between items-center border-t border-dashed border-[#2C333F] pt-3 text-xs mt-3">
          <span className={`${isActive ? "text-blue-600" : "text-blue-400"}`}>
            {cardData.level}
          </span>
          <span className={`${isActive ? "text-blue-600" : "text-blue-400"}`}>
            {cardData.lessonNumber} Lessons
          </span>
        </div>
      </div>
    </div>
  );
};
