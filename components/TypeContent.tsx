import React from 'react'

const TypeContent = ({started, remainingTime, selectedTime, charArray, currentIndex, pressed, errorIndexes, isCorrect}:any) => {
  return (
    <div className="flex-center flex-col mt-20">
        <div className="max-w-[1100px] flex flex-wrap relative">
        <div className="absolute top-[-3rem] left-[0] right-0 text-slate-200 text-3xl">
          {started ? remainingTime : selectedTime}
        </div>
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
                } ${index === currentIndex && !isCorrect ? 'bg-red-500' : 'bg-transparent'} py-1 duration-100 px-[2px] rounded ${char == '' && 'mx-[8px]'}`}
              >
                {char}
              </span>
          ))}
        </div>
      </div>
  )
}

export default TypeContent