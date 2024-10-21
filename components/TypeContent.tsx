import React from "react";

const TypeContent = ({
  started,
  remainingTime,
  selectedTime,
  finalText,
  currentIndex,
  pressed,
  errorIndexes,
  isCorrect,
  upward,
  battle,
}: any) => {

  return (
    <div className="flex-center flex-col">
      <div className="relative max-w-[1200px]">
        {!battle && (
          <div className="absolute top-[-3rem] left-[0] right-0 text-slate-200 text-3xl">
            {started ? remainingTime : selectedTime}
          </div>
        )}
        <div className="overflow-hidden max-w-[1200px]">
          <div
            className="max-h-[150px]"
            style={{
              transform: `translateY(-${upward}px)`,
              transition: "transform 0.3s ease-in-out",
            }}
          >
            {!finalText.length ? (
              <div className="flex justify-center items-center h-[200px]">
                <div className="relative w-10 h-10">
                  <span className="absolute inline-block w-full h-full rounded-full border-4 border-t-transparent border-white animate-spin"></span>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap">
              {finalText.map((wordArray: string[], mainIndex: number) => {
                    const step = finalText[mainIndex].length; // Length of the current word
                    return (
                      <div key={mainIndex} className="flex mr-1">
                        {wordArray.map((char: string, charIndex: number) => {
                          const absoluteIndex = finalText.slice(0, mainIndex).reduce((acc:any, arr:any) => acc + arr.length, 0) + charIndex;
                          return (
                            <span 
                              key={`${mainIndex}-${charIndex}`}
                              style={char === ' ' ? { paddingLeft: '4px', paddingRight: '4px' } : {}}
                              className={`mr-[1px] font-[500] text-[28px] ${
                                absoluteIndex === currentIndex && !pressed
                                  ? "bg-yellow-500 text-white"
                                  : absoluteIndex < currentIndex
                                  ? errorIndexes.includes(absoluteIndex)
                                    ? "text-[#F94E4E]"
                                    : "text-[#2E428A] text-opacity-70"
                                  : "text-slate-100"
                              } ${
                                absoluteIndex === currentIndex && !isCorrect
                                  ? "bg-red-500"
                                  : "bg-transparent"
                              } py-1 duration-75 px-[2px] rounded`}
                            >
                              {char}
                            </span>
                          );
                        })}
                      </div>
                    );
                  })}

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypeContent;
