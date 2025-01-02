'use client';
import Navbar from '@/components/Navbar';
import ResultBox from '@/components/ResultBox';
import { TooltipDemo } from '@/components/self/ToolTip';
import TypeContent from '@/components/TypeContent';
import VisualKeyboard from '@/components/VisualKeyboard';
import { useCallback, useEffect, useState } from 'react';
import { FaRedoAlt } from 'react-icons/fa';
import { RiArrowRightSLine } from "react-icons/ri";
import supabase from './supabase';
import Image from 'next/image';
import Link from 'next/link';
import { ToastContainer } from 'react-toastify';
import finalText from './data/finalText';

export type textObject = {
  chars: string[]; 
};

export type ResultType = {
  wpm: number;
  accuracy: number;
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [charArray, setCharArray] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(true);
  const [typedText, setTypedText] = useState('');
  const [errorIndexes, setErrorIndexes] = useState<number[]>([]);
  const [pressed, setPressed] = useState(false);
  const [selectedTime, setSelectedTime] = useState(30);
  const [remainingTime, setRemainingTime] = useState(30);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [keyPressed, setKeyPressed] = useState<string | null>(null);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [upward, setUpward] = useState(0);
  const [openBattleDialog, setOpenBattleDialog] = useState(false);
  const [flattenWordText, setFlattenWordText] = useState<string[]>([]);
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [correctWordCount, setCorrectWordCount] = useState(0);
  const [currentWord, setCurrentWord] = useState(''); // Track the current word being typed
  const [currentWordIndex, setCurrentWordIndex] = useState(0); // Track word index
  const [typedCharactersCount, setTypedCharactersCount] = useState(0); // To track total characters typed
  const [result, setResult] = useState<ResultType>({
    wpm: 0,
    accuracy: 0
  })  

  useEffect(() => {
    const initialCharArray = finalText.flat().join('').split('');
    setCharArray(initialCharArray);
    setFlattenWordText(flattenWords(finalText));
  }, [finalText]);

  const flattenWords = (text: string[][]): string[] => {
    return text
      .map((chars) => chars.join('')) // Join characters into strings
      .filter((word) => word.trim() !== ''); // Ignore spaces
  };

  interface TextData {
    text: string[][];
}

    const getTextData = async (): Promise<void> => {
        const { data, error } = await supabase
            .from('typetext')
            .select('text')
            .eq('id', 1)
            .single();

        if (error) {
            console.error('Error fetching data:', error);
            return;
        }

        if (data) {
            const array: TextData[] = data.text; 

            if (Array.isArray(array) && array.length > 0) {
                const getRandomElement = (arr: TextData[]): TextData => {
                    const randomIndex = Math.floor(Math.random() * arr.length);
                    return arr[randomIndex];
                };

                const randomElement = getRandomElement(array);
                const randomElement2 = getRandomElement(array);
                const randomElement3 = getRandomElement(array);

                if (
                    randomElement.text !== finalText &&
                    randomElement2.text !== finalText &&
                    randomElement3.text !== finalText
                ) {
                    const formatTextArray = (textArray: string[][]): string[][] => {
                        const newArr: string[][] = [];
                        textArray.forEach((item, index) => {
                            newArr.push(item);
                            if (index < textArray.length - 1) {
                                newArr.push([" "]);
                            }
                        });
                        return newArr;
                    };

                    const finalArr: string[][] = [
                        ...formatTextArray(randomElement.text),
                        ...formatTextArray(randomElement2.text),
                        ...formatTextArray(randomElement3.text),
                    ];

                    setFinalText(finalArr);
                }
            }
        }
    };


    const handleNextLesson = () => {
      restart()
      getTextData();
    };

    
    const handleWordInput = (inputWord: string, currentWordIndex: number) => {
      setTypedWords((prev) => [...prev, inputWord]);

      if (inputWord === flattenWordText[currentWordIndex]) {
        setCorrectWordCount((prevCount) => prevCount + 1);
      }
    };

    function handleKeyPress(event: KeyboardEvent) {
      if(openBattleDialog) return;
      if (remainingTime === 0) return;
      const pressedKey = event.key;
      setKeyPressed(pressedKey);

      setTimeout(() => setKeyPressed(null), 100);

      if (pressedKey === 'Backspace') {
        event.preventDefault();
        setCurrentWord((prev) => prev.slice(0, -1));
        if (currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
          setTypedText(typedText.slice(0, -1));
          setErrorIndexes(errorIndexes.filter(index => index !== currentIndex - 1));
          setTypedCharactersCount((prevCount) => prevCount - 1);
        }

        return;
      } 
      if (pressedKey.length > 1 && pressedKey !== ' ') return;
      
      const expectedChar = charArray[currentIndex];
      const inputChar = pressedKey;
      
      
      if (event.ctrlKey) return;
    

      if(!openBattleDialog){
        if (pressedKey === ' ') {
          handleWordInput(currentWord, currentWordIndex);
          setTypedText((prev) => prev + currentWord + ' ');
          setCurrentWord('');
          setCurrentWordIndex((prevIndex) => prevIndex + 1); 
        } else{
          setCurrentWord((prev) => prev + pressedKey);
        }
        
              if(!started) {
                setStarted(true);
                handleStart(false)
              }

        if (pressedKey === ' ') {
          if (expectedChar === ' ') {
              setCurrentIndex(currentIndex + 1);
              setIsCorrect(true);
            } else {
              setErrorIndexes([...errorIndexes, currentIndex]);
              setIsCorrect(false);
              setCurrentIndex(currentIndex + 1); 
            }
            setTypedCharactersCount((prevCount) => prevCount + 1);
            event.preventDefault();
            setPressed(false);
            return;
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
        setTypedCharactersCount((prevCount) => prevCount + 1);

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
      setShowResult(false)
      setCorrectWordCount(0)
      setCurrentWordIndex(0)
      setCurrentWord('')
      setTypedWords([])
      setTypedCharactersCount(0)
    }
  }

  useEffect(() => {
    if(!openBattleDialog){
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [openBattleDialog, handleKeyPress]);


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
    }
 };

 const handleEndTest = () => {
  setShowResult(true);
};


useEffect(() => {
  if (showResult) {
    if (correctWordCount > 0 && typedWords.length > 0) {
      const correctCharCount = typedCharactersCount - errorIndexes.length;
      const wpm = (correctCharCount / 5) * (60 / selectedTime);
      const accuracy = Math.round((correctCharCount / typedCharactersCount) * 100);
      setResult({ wpm, accuracy });
    } else {
      console.log('No words typed or no correct words');
    }
  }
}, [showResult]);

const startTimer = useCallback(() => {
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
}, [handleEndTest, timerInterval]);
 


  return (
    <div className="w-full">
        <Navbar 
          selectedTime={selectedTime} 
          setSelectedTime={setSelectedTime} 
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
                    onClick={restart}
                    className=''
                  >
                    <TooltipDemo 
                      hoverText={<FaRedoAlt/>} 
                      tooltipText='Restart Test' 
                      hoverClass='border-none rounded-lg bg-[#073b4c] text-white px-4 duration-500'
                    />
                  </div>

                  <div onClick={handleNextLesson}>
                    <TooltipDemo 
                      hoverText={<RiArrowRightSLine />} 
                      tooltipText='Next Test'
                      hoverClass='border-none rounded-lg text-2xl font-bold bg-[#073b4c] text-white px-3 duration-500'
                    />
                  </div>
              </div>

            {showResult && (
              <ResultBox setShowResult={setShowResult} result={result} restart={restart}/>
            )}

            <div className='flex justify-end mt-8 mr-6'>
                  <TooltipDemo 
                      hoverText={
                        <Link href='/battle-history' className=''>
                          <div className=' p-4 bg-[#ffb700] rounded-full cursor-pointer hover:scale-[1.08] duration-700'>
                            <span> <Image src='/battle.png' width={30} height={30} alt='keyboard' className=''/></span>
                          </div>
                        </Link>
                      } 
                      tooltipText='Battle History'
                      hoverClass='bg-transparent hover:bg-transparent border-none'
                      tooltipClass='mb-4'
                    />
              <ToastContainer
                position="bottom-center"
                autoClose={3000}
                hideProgressBar
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            </div>
    </div>
  );
}
