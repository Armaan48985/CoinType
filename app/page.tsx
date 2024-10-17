'use client';
import Navbar from '@/components/Navbar';
import ResultBox from '@/components/ResultBox';
import BattleDialog from '@/components/self/BattleDialog';
import { TooltipDemo } from '@/components/self/ToolTip';
import TypeContent from '@/components/TypeContent';
import VisualKeyboard from '@/components/VisualKeyboard';
import { open } from 'node:inspector/promises';
import { useEffect, useState } from 'react';
import { FaCoins, FaRedoAlt } from 'react-icons/fa';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { RiArrowRightSLine } from "react-icons/ri";

export type textObject = {
  chars: string[]; // Array of characters for each line/block
};

export default function Home() {
  const [text, setText] = useState(`Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quod est iste cumque modi consequatur nam possimus facilis iusto vel aperiam neque, architecto reiciendis, laboriosam exercitationem debitis facere? Aperiam reprehenderit sapiente, voluptate explicabo voluptates laborum ratione, tempore odit non labore ipsam culpa dolores magnam cupiditate, sint ut ipsa amet rem totam`)
  const [finalText, setFinalText] = useState<textObject[]>([])
  const [started, setStarted] = useState(false);
  const [charArray, setCharArray] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(true);
  const [typedText, setTypedText] = useState('');
  const [errorIndexes, setErrorIndexes] = useState<number[]>([]);
  const [pressed, setPressed] = useState(false);
  const [selectedTime, setSelectedTime] = useState(15);
  const [remainingTime, setRemainingTime] = useState(15);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [keyPressed, setKeyPressed] = useState<string | null>(null);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [upward, setUpward] = useState(0);
  const [openBattleDialog, setOpenBattleDialog] = useState(false);


  useEffect(() => {
    const maxCharsPerBlock = 60;
    const formattedText: textObject[] = [];

    for (let i = 0; i < text.length; i += maxCharsPerBlock) {
      const block = text.slice(i, i + maxCharsPerBlock).split(''); 
      formattedText.push({ chars: block }); 
    }

    setFinalText(formattedText);

    setCharArray(text.split(''));

  }, [text])

  const handleKeyPress = (event: any) => {
    console.log('open battle dialog', openBattleDialog) 
    if(openBattleDialog){
      console.log('fku')
      return;
    };
    if (remainingTime === 0) return;
    const pressedKey = event.key;
    setKeyPressed(pressedKey);

    setTimeout(() => {
        setKeyPressed(null);
    }, 100);

    if (pressedKey === 'Backspace') {
        event.preventDefault();
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setTypedText(typedText.slice(0, -1));
            setErrorIndexes(errorIndexes.filter(index => index !== currentIndex - 1));
        }
        return;
    }

    
    if (pressedKey.length > 1 && pressedKey !== ' ') return;
    
    const expectedChar = charArray[currentIndex];
    const inputChar = pressedKey;

    if(!openBattleDialog){
      if (pressedKey === ' ') {
        if (expectedChar === ' ') {
            setTypedText(typedText + ' ');
            setCurrentIndex(currentIndex + 1);
            setIsCorrect(true);
        } else {
            setErrorIndexes([...errorIndexes, currentIndex]);
            setIsCorrect(false);
            setCurrentIndex(currentIndex + 1); 
        }
        event.preventDefault();
        setPressed(false);
        return;
    }

    if(!started) {
      setStarted(true);
      handleStart(started)
    }

    setPressed(true);

    if (expectedChar === inputChar) {
        setTypedText(typedText + pressedKey);
        setCurrentIndex(currentIndex + 1);
        setIsCorrect(true);
    } else {
        setErrorIndexes([...errorIndexes, currentIndex]);
        setIsCorrect(false);
        setCurrentIndex(currentIndex + 1); 
        setIncorrectCount(incorrectCount + 1);
    }

    }
    setPressed(false);
};

  const restart = () => {
    if(started){
      clearInterval(timerInterval!);
      setStarted(false);
      setCurrentIndex(0);
      setTypedText('');
      setErrorIndexes([]);
      setRemainingTime(selectedTime);
      setUpward(0);
    }
  }

  useEffect(() => {
    if(!openBattleDialog){
      console.log('lksjdlfkjsdlkj')
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [currentIndex, charArray, typedText, started, openBattleDialog]);


  const handleStart = (start:boolean) => {
    if (start) {
       clearInterval(timerInterval!);
       setStarted(false);
       setCurrentIndex(0);
       setTypedText('');
       setErrorIndexes([]);
       setRemainingTime(selectedTime);
       setUpward(0);
    } else {
       setStarted(true);
       setRemainingTime(selectedTime);
       startTimer();
       console.log('again wrong')
    }
 };
 
 useEffect(() => {
  if (remainingTime === 0 || openBattleDialog) {
    handleEndTest();
  }
}, [remainingTime, openBattleDialog]);

useEffect(() => {
  if(openBattleDialog){
    clearInterval(timerInterval!);
  }
  else if(!openBattleDialog && started){
    startTimer();
  }
}, [openBattleDialog]);

  const startTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    const interval = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime === 1) {
          handleEndTest();
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    setTimerInterval(interval);
  };
  
  const handleEndTest = () => {
    if(typedText){
      setShowResult(true)
    }
  };

  return (
    <div className="w-full">
        <Navbar 
          selectedTime={selectedTime} 
          setSelectedTime={setSelectedTime} 
          handleStart={handleStart} 
          started={started}
          openBattleDialog={openBattleDialog}
          setOpenBattleDialog={setOpenBattleDialog}
        />

        <div className='mt-20'>
          <TypeContent 
            started={started}
            remainingTime={remainingTime} 
            selectedTime={selectedTime} 
            finalText={finalText}
            currentIndex={currentIndex} 
            pressed={pressed} 
            errorIndexes={errorIndexes} 
            isCorrect={isCorrect}
            upward={upward}
            setUpward={setUpward}
            battle={false}
          />
        </div>

        <div className='bg-[var(--background)] z-10 h-[200px]'>
          <VisualKeyboard keyPressed={keyPressed}/>
        </div>

        <div className='flex-center gap-6 mt-7'>
                  <div 
                    onClick={() => {setShowResult(false); restart()}}
                    className=''
                  >
                    <TooltipDemo 
                      hoverText={<FaRedoAlt/>} 
                      tooltipText='Restart Test' 
                      hoverClass='border-none rounded-lg bg-[#073b4c] text-white px-4 duration-500'
                    />
                  </div>

                  <div>
                    <TooltipDemo 
                      hoverText={<RiArrowRightSLine />} 
                      tooltipText='Next Test'
                      hoverClass='border-none rounded-lg text-2xl font-bold bg-[#073b4c] text-white px-3 duration-500'
                    />
                  </div>
              </div>

        {showResult && (
          <ResultBox setShowResult={setShowResult} typedText={typedText} remainingTime={remainingTime} selectedTime={selectedTime} incorrectCount={incorrectCount} restart={restart}/>
        )}

    </div>
  );
}
