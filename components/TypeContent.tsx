import React, { useEffect } from 'react';

const TypeContent = ({
  started,
  remainingTime,
  selectedTime,
  charArray,
  currentIndex,
  pressed,
  errorIndexes,
  isCorrect,
  setUpward, 
  upward
}: any) => {

  useEffect(() => {
    const baseIndex = 114; // Starting point for the upward shift
    const step = 57; // Matches maxCharsPerLine

    if (currentIndex > baseIndex) {
      // Calculate how many shifts have happened after the baseIndex
      const additionalShifts = Math.floor((currentIndex - baseIndex) / step);
      // Apply the shift for the first time after baseIndex, and increment by step size
      setUpward(55 * (1 + additionalShifts));
    }
  }, [currentIndex]);

  return (
    <div className="flex-center flex-col mt-20">
      <div className="relative max-w-[1000px]">
        <div className="absolute top-[-3rem] left-[0] right-0 text-slate-200 text-3xl">
          {started ? remainingTime : selectedTime}
        </div>
        <div className="overflow-hidden max-w-[1000px]">
          {/* Apply dynamic inline style for translateY */}
          <div
            className="flex flex-wrap max-h-[150px] z-[-1]"
            style={{
              transform: `translateY(-${upward}px)`, // Dynamically shift the lines
              transition: 'transform 0.3s ease-in-out', // Smooth transition
            }}
          >
            {charArray.map((char: string, index: number) => (
              <span
                key={index}
                className={`mr-[1px] font-[500] text-[28px] ${
                  index === currentIndex && !pressed
                    ? 'bg-yellow-500'
                    : index < currentIndex
                    ? errorIndexes.includes(index)
                      ? 'text-[#F94E4E]'
                      : 'text-[#2E428A] text-opacity-70'
                    : 'text-white'
                } ${
                  index === currentIndex && !isCorrect ? 'bg-red-500' : 'bg-transparent'
                } py-1 duration-100 px-[2px] rounded ${char === '' && 'mx-[8px]'}`}
              >
                {char}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypeContent;
