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

export type textObject = {
  chars: string[]; 
};

export type ResultType = {
  wpm: number;
  accuracy: number;
}

export default function Home() {
  const [finalText, setFinalText] = useState<string[][]>([
    ["H", "e", "l", "l", "o"],
    [" "],
    ["w", "o", "r", "l", "d"],
    [" "],
    ["t", "h", "i", "s"],
    [" "],
    ["i", "s"],
    [" "],
    ["a"],
    [" "],
    ["t", "e", "s", "t"],
    [" "],
    ["o", "f"],
    [" "],
    ["t", "e", "x", "t"],
    [" "],
    ["o", "b", "j", "e", "c", "t", "s"],
    [" "],
    ["f", "o", "r"],
    [" "],
    ["j", "a", "v", "a"],
    [" "],
    ["e", "x", "a", "m", "p", "l", "e"],
    [" "],
    ["t", "e", "s", "t", "i", "n", "g"],
    [" "],
    ["c", "h", "a", "r", "a", "c", "t", "e", "r", "s"],
    [" "],
    ["a", "n", "d"],
    [" "],
    ["s", "t", "r", "u", "c", "t", "u", "r", "e"],
    [" "],
    ["a", "r", "r", "a", "y"],
    [" "],
    ["o", "f"],
    [" "],
    ["c", "h", "a", "r", "a", "c", "t", "e", "r", "s"],
    [" "],
    ["i", "s"],
    [" "],
    ["n", "e", "c", "e", "s", "s", "a", "r", "y"],
    [" "],
    ["f", "o", "r"],
    [" "],
    ["b", "u", "i", "l", "d", "i", "n", "g"],
    [" "],
    ["d", "a", "t", "a"],
    [" "],
    ["s", "t", "r", "u", "c", "t", "u", "r", "e", "s"],
    [" "],
    ["i", "n"],
    [" "],
    ["a", "n", "y"],
    [" "],
    ["j", "a", "v", "a"],
    [" "],
    ["a", "p", "p", "l", "i", "c", "a", "t", "i", "o", "n"],
    [" "],
    ["t", "h", "a", "t"],
    [" "],
    ["n", "e", "e", "d", "s"],
    [" "],
    ["t", "o"],
    [" "],
    ["m", "a", "n", "i", "p", "u", "l", "a", "t", "e"],
    [" "],
    ["t", "e", "x", "t"],
    [" "],
    ["f", "o", "r"],
    [" "],
    ["v", "a", "r", "i", "o", "u", "s"],
    [" "],
    ["f", "u", "n", "c", "t", "i", "o", "n", "a", "l", "i", "t", "i", "e", "s"],
    [" "],
    ["i", "n"],
    [" "],
    ["j", "a", "v", "a"],
    [" "],
    ["p", "r", "o", "g", "r", "a", "m", "m", "i", "n", "g"],
    [" "],
    ["t", "o", "d", "a", "y"],
    [" "],
    ["a", "n", "d"],
    [" "],
    ["c", "r", "e", "a", "t", "e"],
    [" "],
    ["n", "e", "w"],
    [" "],
    ["o", "p", "p", "o", "r", "t", "u", "n", "i", "t", "i", "e", "s"],
    [" "],
    ["f", "o", "r"],
    [" "],
    ["f", "u", "t", "u", "r", "e"],
    [" "],
    ["d", "e", "v", "e", "l", "o", "p", "m", "e", "n", "t"],
    ["J", "a", "v", "a"], [""], ["i", "s"], [""], ["a"], [""], ["v", "e", "r", "s", "a", "t", "i", "l", "e"], [""],
    ["p", "r", "o", "g", "r", "a", "m", "m", "i", "n", "g"], [""], ["l", "a", "n", "g", "u", "a", "g", "e"], [""],
    ["t", "h", "a", "t"], [""], ["i", "s"], [""], ["e", "a", "s", "y"], [""], ["t", "o"], [""],
    ["l", "e", "a", "r", "n"], [""], ["a", "n", "d"], [""], ["u", "s", "e"], [""], ["f", "o", "r"], [""],
    ["d", "e", "v", "e", "l", "o", "p", "i", "n", "g"], [""], ["m", "o", "b", "i", "l", "e"], [""], ["a", "n", "d"], [""],
    ["w", "e", "b"], [""], ["a", "p", "p", "s"], [""], ["o", "f"], [""], ["a", "n", "y"], [""], ["k", "i", "n", "d"], [""],
    ["T", "h", "e"], [""], ["s", "y", "n", "t", "a", "x"], [""], ["i", "s"], [""], ["s", "i", "m", "p", "l", "e"], [""],
    ["a", "n", "d"], [""], ["c", "l", "e", "a", "r"], [""], ["w", "h", "i", "l", "e"], [""], ["s", "u", "p", "p", "o", "r", "t", "s"], [""],
    ["o", "o", "l", "s"], [""], ["l", "i", "k", "e"], [""], ["E", "c", "l", "i", "p", "s", "e"], [""], ["o", "r"], [""],
    ["I", "N", "T", "E", "L", "L", "I", "J"], [""], ["m", "a", "k", "e", "s"], [""], ["d", "e", "v", "e", "l", "o", "p", "m", "e", "n", "t"], [""],
    ["e", "a", "s", "y"], [""], ["a", "n", "d"], [""], ["e", "f", "f", "i", "c", "i", "e", "n", "t"]
  ])
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
  // const fetchData = async () => {
  //   try {
  //     const data = await gen();
  //     console.log('raw data', data);
  
  //     const regex = /\[.*?\]/;
  //     const match = data.match(regex);
  
  //     if (match) {
  //       const arrayStr = match[0];
  //       // Use a type assertion to specify the type of the parsed data
  //       const arr: string[] = JSON.parse(arrayStr) as string[];
  
  //       // Create the finalText array (as before)
  //       const newCharArrays: string[][] = arr.flatMap((word: string) => [
  //         Array.from(word), 
  //         [' '] 
  //       ]).slice(0, -1); // Remove the last space added after the last word
  
  //       // Create a new charArray with characters including empty strings for spaces
  //       const charArray: string[] = arr.flatMap((word: string) => [
  //         ...Array.from(word), 
  //         ' ' // Add an empty string for the space
  //       ]);
  
  //       // Remove the last empty string added after the last word if needed
  //       if (charArray[charArray.length - 1] === '') {
  //         charArray.pop();
  //       }
  
  //       // Update the states
  //       setFinalText(newCharArrays); 
  //       setCharArray(charArray); 
  //     } else {
  //       console.log("No array found in the string.");
  //     }
  //   } catch (parseError) {
  //     console.error("Failed to parse JSON:", parseError);
  // }
  // };
  //   useEffect(() => {
  //     fetchData()
  //   }, []);


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
    

      if(!openBattleDialog){
        if (pressedKey === ' ') {
          handleWordInput(currentWord, currentWordIndex);
          setTypedText((prev) => prev + currentWord + ' ');
          setCurrentWord('');
          setCurrentWordIndex((prevIndex) => prevIndex + 1); 
        } else{
          setCurrentWord((prev) => prev + pressedKey);
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

      if(!started) {
        setStarted(true);
        handleStart(false)
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
 

// useEffect(() => {
//   if(openBattleDialog){
//     clearInterval(timerInterval!);
//   }
//   else if(!openBattleDialog && started){
//     startTimer();
//   }
// }, [openBattleDialog, started]);

 
  

//  useEffect(() => {
//   if (remainingTime === 0 || openBattleDialog) {
//     handleEndTest;
//   }
// }, [remainingTime, openBattleDialog, handleEndTest]);


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
                      hoverClass=''
                      tooltipClass='mb-4'
                    />
            </div>

          

    </div>
  );
}
