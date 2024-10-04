'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [text, setText] = useState(
    'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sapiente, eos cum esse laboriosam vero debitis velit, voluptatibus consectetur earum id error a odit quod. Similique tenetur minus officia unde iure'
  );
  const [started, setStarted] = useState(false);
  const [charArray, setCharArray] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(true);
  const [typedText, setTypedText] = useState('');
  const [errorIndexes, setErrorIndexes] = useState<number[]>([]);
  const [pressed, setPressed] = useState(false);
  const [selectedTime, setSelectedTime] = useState(15);
  const [remainingTime, setRemainingTime] = useState(15);

  useEffect(() => {
    setCharArray(text.split('').map((char) => (char === ' ' ? '' : char)));
  }, [text]);

  const handleKeyPress = (event: any) => {
    if(!started || remainingTime == 0) return;

    const pressedKey = event.key;

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
    setPressed(true);
  
    const expectedChar = charArray[currentIndex];
    const inputChar = pressedKey;
  
    if (pressedKey === ' ') {
      event.preventDefault();
    }
  
    if (expectedChar === inputChar) {
      setTypedText(typedText + pressedKey);
      setCurrentIndex(currentIndex + 1);
      setIsCorrect(true);
    } else {
      setErrorIndexes([...errorIndexes, currentIndex]);
      setIsCorrect(false);
      setCurrentIndex(currentIndex + 1); 
    }

    setPressed(false);
  };
  


  useEffect(() => {
    if (started) {
      window.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentIndex, charArray, typedText, started]);


  const handleStart = () => {
    if (started) {
      setStarted(false);
      setCurrentIndex(0);
      setTypedText('');
      setErrorIndexes([]);
      setRemainingTime(15);
      console.log('restarting')
    } else {
      setStarted(true);
      setRemainingTime(selectedTime);
      startTimer();
      console.log('starting')
    }
  };

  console.log(started)

  const startTimer = () => {
    console.log('im inside start timer')
    const timerInterval = setInterval(() => {
      setRemainingTime(prevTime => {
        if (prevTime === 1) {
          clearInterval(timerInterval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen">
      <div className="p-10 flex-between px-20">
        <h1 className="font-mono text-5xl">CoinType</h1>

        <div className='bg-gray-800 rounded-2xl'>
          <div className='flex gap-8 py-1 px-8'>
            <button className={`hover:text-yellow-500 ${selectedTime == 15 ? 'text-yellow-500' : ''}`} onClick={() => setSelectedTime(15)}>15s</button>
            <button className={`hover:text-yellow-500 ${selectedTime == 30 ? 'text-yellow-500' : ''}`} onClick={() => setSelectedTime(30)}>30s</button>
            <button className={`hover:text-yellow-500 ${selectedTime == 60 ? 'text-yellow-500' : ''}`} onClick={() => setSelectedTime(60)}>60s</button>
            <button className={`hover:text-yellow-500 ${selectedTime == 120 ? 'text-yellow-500' : ''}`} onClick={() =>setSelectedTime(120)}>120s</button>
          </div>   
        </div>

        <div>
          <button
            onClick={handleStart}
            className="bg-[#468286] text-white px-6 py-2 rounded-md"
          >
            {started ? 'Restart' : 'Start'}
          </button>
        </div>
      </div>

      <div className="flex-center flex-col h-[70vh]">
        <div className="max-w-[1100px] mb-20 flex flex-wrap relative">
        <div className="absolute top-[-3rem] left-[0] right-0 text-slate-200 text-3xl">
          {remainingTime}
        </div>
          {charArray.map((char: string, index: number) => (
                <span
                key={index}
                className={`mr-1 text-2xl ${
                  index === currentIndex && !pressed
                    ? 'bg-yellow-500'
                    : index < currentIndex
                    ? errorIndexes.includes(index)
                      ? 'text-red-500'
                      : 'text-green-500'
                    : 'text-white'
                } ${index === currentIndex && !isCorrect ? 'bg-red-500' : 'bg-transparent'} py-1 px-[2px] rounded`}
              >
                {char}
              </span>
          ))}
        </div>
      </div>
    </div>
  );
}
