'use client';
import Navbar from '@/components/Navbar';
import ResultBox from '@/components/ResultBox';
import { TooltipDemo } from '@/components/self/ToolTip';
import TypeContent from '@/components/TypeContent';
import VisualKeyboard from '@/components/VisualKeyboard';
import { useCallback, useEffect, useState } from 'react';
import { FaRedoAlt } from 'react-icons/fa';
import { RiArrowRightSLine } from "react-icons/ri";

export type textObject = {
  chars: string[]; 
};

export type ResultType = {
  wpm: number;
  accuracy: number;
}

export default function Home() {
  const [finalText] = useState<string[][]>(
    [
        ['H', 'e', 'l', 'l', 'o'],
        [' '],
        ['W', 'o', 'r', 'l', 'd'],
        [' '],
        ['T', 'y', 'p', 'e'],
        [' '],
        ['F', 'a', 's', 't'],
        [' '],
        ['C', 'o', 'd', 'e'],
        [' '],
        ['R', 'e', 'a', 'c', 't'],
        [' '],
        ['B', 'a', 't', 't', 'l', 'e'],
        [' '],
        ['J', 'a', 'v', 'a', 'S', 'c', 'r', 'i', 'p', 't'],
        [' '],
        ['C', 'h', 'a', 'l', 'l', 'e', 'n', 'g', 'e'],
        [' '],
        ['D', 'e', 'b', 'u', 'g'],
        [' '],
        ['L', 'e', 'a', 'r', 'n'],
        [' '],
        ['W', 'i', 'n'],
        [' '],
        ['S', 'm', 'a', 'r', 't'],
        [' '],
        ['Q', 'u', 'i', 'c', 'k'],
        [' '],
        ['S', 'o', 'l', 'v', 'e'],
        [' '],
        ['E', 'x', 'p', 'l', 'o', 'r', 'e'],
        [' '],
        ['B', 'u', 'i', 'l', 'd'],
        [' '],
        ['I', 'n', 'v', 'e', 'n', 't'],
        [' '],
        ['I', 'n', 'i', 't', 'i', 'a', 't', 'e'],
        [' '],
        ['T', 'e', 's', 't'],
        [' '],
        ['I', 'm', 'p', 'r', 'o', 'v', 'e'],
        [' '],
        ['F', 'l', 'o', 'w'],
        [' '],
        ['D', 'e', 'v', 'e', 'l', 'o', 'p'],
        [' '],
        ['S', 'u', 'c', 'c', 'e', 's', 's'],
        [' '],
        ['P', 'r', 'o', 'g', 'r', 'e', 's', 's'],
        [' '],
        ['E', 'x', 'p', 'e', 'r', 't'],
        [' '],
        ['V', 'i', 'c', 't', 'o', 'r', 'y'],
        [' '],
        ['C', 'o', 'n', 'q', 'u', 'e', 'r'],
      ]
    )
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




    const handleNextLesson = () => {
      // fetchData();
      console.log('next lesson')
    };

    
  const handleWordInput = (inputWord: string, currentWordIndex: number) => {
    setTypedWords((prev) => [...prev, inputWord]);

    if (inputWord === flattenWordText[currentWordIndex]) {
      setCorrectWordCount((prevCount) => prevCount + 1);
    }
  };

  

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


  const handleKeyPress = useCallback((event: KeyboardEvent) => {
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
        setIncorrectCount(incorrectCount => incorrectCount + 1);
      }
      setTypedCharactersCount((prevCount) => prevCount + 1);

    }
    setPressed(false);
}, [openBattleDialog, currentIndex, typedText, errorIndexes, charArray, currentWord, currentWordIndex, typedCharactersCount, started, handleStart, handleWordInput, incorrectCount, remainingTime]);

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

 const handleEndTest = useCallback(() => {
  setShowResult(true);
}, []);

useEffect(() => {
  if (showResult) {
    if (correctWordCount > 0 && typedWords.length > 0) {
      const wpm = (typedCharactersCount / 5) / (selectedTime / 60);
      const correctCharCount = typedCharactersCount - errorIndexes.length;
      const accuracy = Math.round((correctCharCount / typedCharactersCount) * 100);
      setResult({ wpm, accuracy });
    } else {
      console.log('No words typed or no correct words');
    }
  }
}, [showResult, correctWordCount, typedWords, typedCharactersCount, selectedTime, errorIndexes]);

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
 

useEffect(() => {
  if(openBattleDialog){
    clearInterval(timerInterval!);
  }
  else if(!openBattleDialog && started){
    startTimer();
  }
}, [openBattleDialog, startTimer, timerInterval, started]);

 
  

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

    </div>
  );
}
