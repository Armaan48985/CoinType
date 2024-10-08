'use client';
import Navbar from '@/components/Navbar';
import ResultBox from '@/components/ResultBox';
import TypeContent from '@/components/TypeContent';
import VisualKeyboard from '@/components/VisualKeyboard';
import { useEffect, useState } from 'react';
import { FaCoins } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

export default function Home() {
  const [text, setText] = useState(`Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quod est iste cumque modi consequatur nam possimus facilis iusto vel aperiam neque, architecto reiciendis, laboriosam exercitationem debitis facere? Aperiam reprehenderit sapiente, voluptate explicabo voluptates laborum ratione, tempore odit non labore ipsam culpa dolores magnam cupiditate, sint ut ipsa amet rem totam`)
  const [started, setStarted] = useState(false);
  const [charArray, setCharArray] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(true);
  const [typedText, setTypedText] = useState('');
  const [errorIndexes, setErrorIndexes] = useState<number[]>([]);
  const [pressed, setPressed] = useState(false);
  const [selectedTime, setSelectedTime] = useState(8);
  const [remainingTime, setRemainingTime] = useState(15);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [keyPressed, setKeyPressed] = useState<string | null>(null);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [showResult, setShowResult] = useState(true);
  const [upward, setUpward] = useState(0);

  useEffect(() => {
    const maxCharsPerLine = 58; // Define max characters per line
    const formattedCharArray: string[] = [];
  
    // Split the text into lines of maxCharsPerLine
    for (let i = 0; i < text.length; i += maxCharsPerLine) {
      const line = text.slice(i, i + maxCharsPerLine);
      // Ensure the line only contains 58 characters or less
      formattedCharArray.push(...line.split('').map((char) => (char === ' ' ? '' : char)));
    }
  
    setCharArray(formattedCharArray);
  }, []);
  
  

  const handleKeyPress = (event: any) => {
    if (!started || remainingTime === 0) return;

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

    // Check for non-character keys
    if (pressedKey.length > 1 && pressedKey !== ' ') return;
  
    setPressed(true);

    const expectedChar = charArray[currentIndex];
    const inputChar = pressedKey;

    if (pressedKey === ' ') {
        console.log('Space key pressed');
        if (expectedChar === '') {
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

    setPressed(false);
};

  useEffect(() => {
    if (started) {
      window.addEventListener('keydown', handleKeyPress);
    } else {
      window.removeEventListener('keydown', handleKeyPress);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentIndex, charArray, typedText, started]);


  const handleStart = () => {
    if (started) {
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
 
 useEffect(() => {
  if (remainingTime === 0) {
    handleEndTest();
  }
}, [remainingTime]);

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


  console.log(currentIndex)


  return (
    <div className="w-full">
        <Navbar 
          selectedTime={selectedTime} 
          setSelectedTime={setSelectedTime} 
          handleStart={handleStart} 
          started={started}
        />

        <TypeContent 
          started={started}
          remainingTime={remainingTime} 
          selectedTime={selectedTime} 
          charArray={charArray}
          currentIndex={currentIndex} 
          pressed={pressed} 
          errorIndexes={errorIndexes} 
          isCorrect={isCorrect}
          upward={upward}
          setUpward={setUpward}
        />

        <div className='bg-[var(--background)] z-10 h-[500px]'>
        <VisualKeyboard keyPressed={keyPressed}/>
        </div>

        {showResult && (
          <ResultBox setShowResult={setShowResult} typedText={typedText} remainingTime={remainingTime} selectedTime={selectedTime} incorrectCount={incorrectCount}/>
        )}

    </div>
  );
}
