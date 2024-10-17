import { textObject } from '@/app/page';
import React, { useEffect } from 'react';

const TypeContent = ({
  started,
  remainingTime,
  selectedTime,
  finalText,
  currentIndex,
  pressed,
  errorIndexes,
  isCorrect,
  setUpward, 
  upward,
  battle
}: any) => {

  const step = finalText[0]?.chars.length;

  useEffect(() => {
    const baseIndex = step*2;

    if (currentIndex+1 > baseIndex) {
      const additionalShifts = Math.floor((currentIndex - baseIndex) / step);
      setUpward(55 * (1 + additionalShifts));
    }
  }, [currentIndex]);
  
  return (
    <div className="flex-center flex-col">
      <div className="relative max-w-[1000px]">
        {!battle && (
          <div className="absolute top-[-3rem] left-[0] right-0 text-slate-200 text-3xl">
          {started ? remainingTime : selectedTime}
        </div>
        )}
        <div className="overflow-hidden max-w-[1000px]">
          {/* Apply dynamic inline style for translateY */}
          <div
            className='max-h-[150px]'
            style={{
              transform: `translateY(-${upward}px)`, // Dynamically shift the lines
              transition: 'transform 0.3s ease-in-out', // Smooth transition
            }}
          >
            {finalText.map((block: any, blockIndex: number) => (
              <div key={blockIndex} className="flex"> {/* Ensure each block is its own line */}
                {block.chars.map((char: any, charIndex: any) => (
                  <span
                    key={`${blockIndex}-${charIndex}`} // Unique key combining block and char index
                    className={`mr-[1px] font-[500] text-[28px] ${
                      blockIndex * step + charIndex === currentIndex && !pressed
                        ? 'bg-yellow-500 text-white'
                        : blockIndex * step + charIndex < currentIndex
                        ? errorIndexes.includes(blockIndex * step + charIndex)
                          ? 'text-[#F94E4E]'
                          : 'text-[#2E428A] text-opacity-70'
                        : 'text-slate-100'
                    } ${
                      blockIndex * step + charIndex === currentIndex && !isCorrect
                        ? 'bg-red-500'
                        : 'bg-transparent'
                    } py-1 duration-100 px-[2px] rounded`}
                  >
                    {char}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};



export default TypeContent;
