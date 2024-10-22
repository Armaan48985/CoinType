import React from 'react'
import { FaRedoAlt } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io'
import { MdOutlineNavigateNext } from 'react-icons/md';
import { TooltipDemo } from './self/ToolTip';
import { ResultType } from '@/app/page';


const ResultBox = ({setShowResult,  result, restart}:{
  setShowResult: (show: boolean) => void;
  result: ResultType;
  restart: () => void;
}) => {

     return (
        <div className="fixed inset-0 bg-black font-mono bg-opacity-70 flex items-center justify-center z-50">
            <div className="relative rounded-xl bg-gray-800 p-6 shadow-2xl flex justify-center flex-col w-[380px] min-h-[280px] max-w-lg mx-auto  border-gray-600">
              <div className='flex-between'>
                  <h1 className="text-4xl font-bold  text-white text-center mb-8">Your Results</h1>
                <button
                    className="absolute top-3 right-3 text-gray-400 mb-6 hover:bg-gray-700 rounded-full p-2 transition-colors duration-200"
                    onClick={() => setShowResult(false)}
                >
                    <span><IoMdClose size={24} /></span>
                </button>
              </div>
              <div className="space-y-6">
                <div className="flex gap-3 items-center">
                  <h2 className="text-xl font-medium text-gray-300">Words Per Minute :</h2>
                  <p className="text-2xl font-bold text-blue-400">{result.wpm}</p>
                </div>
                <div className="flex gap-3 items-center">
                  <h2 className="text-xl font-medium text-gray-300">Accuracy :</h2>
                  <p className="text-2xl font-bold text-blue-400">{result.accuracy}%</p>
                </div>
              </div>

                <div className='flex-center gap-10 mt-7'>
                    <div 
                      onClick={() => {setShowResult(false); restart()}}
                      className=''
                    >
                      <TooltipDemo 
                        hoverText={<FaRedoAlt/>} 
                        tooltipText='Restart Test' 
                        hoverClass='border-none rounded-lg bg-white text-black px-8 hover:bg-white hover:scale-105 duration-500'
                      />
                    </div>

                    <div>
                      <TooltipDemo 
                        hoverText={<MdOutlineNavigateNext />} 
                        tooltipText='Next Test'
                        hoverClass='border-none text-xl font-bold rounded-lg bg-white text-black px-8 hover:bg-white hover:scale-105 duration-500'
                      />
                    </div>
                </div>
            </div>
        </div>
     )
}

export default ResultBox