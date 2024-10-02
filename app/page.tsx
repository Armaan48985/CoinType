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

  // Split the text into an array of characters
  useEffect(() => {
    setCharArray(text.split('').map((char) => (char === ' ' ? '' : char)));
  }, [text]);

  const handleKeyPress = (event: any) => {
    const pressedKey = event.key;
    setPressed(true);
  
    // Ignore non-character keys
    if (pressedKey.length > 1 && pressedKey !== ' ') return;
  
    // Normalize both the input and the expected character to lowercase
    const expectedChar = charArray[currentIndex].toLowerCase();
    const inputChar = pressedKey.toLowerCase();
  
    if (pressedKey === ' ') {
      event.preventDefault();
    }
  
    if (!started) setStarted(true);
  
    if (expectedChar === inputChar) {
      setTypedText(typedText + pressedKey);
      setCurrentIndex(currentIndex + 1);
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
      setCurrentIndex(currentIndex + 1); 
      console.log('incorrect');
    }

    setPressed(false);
  };
  

  // Add and remove the event listener for keydown
  useEffect(() => {
    if (started) {
      window.addEventListener('keydown', handleKeyPress);
    }

    // Clean up the event listener when component unmounts or stops
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentIndex, charArray, typedText, started]);

  // Handle start/restart button click
  const handleStart = () => {
    if (started) {
      // Restart logic
      setStarted(false);
      setCurrentIndex(0);
      setTypedText('');
      setErrorIndexes([]);
    } else {
      setStarted(true);
    }
  };

  return (
    <div className="w-full min-h-screen">
      <div className="p-10 flex-between px-20">
        <h1 className="font-mono text-5xl">MonkeyType</h1>

        <div>
          {/* Start/Restart button */}
          <button
            onClick={handleStart}
            className="bg-[#468286] text-white px-6 py-2 rounded-md"
          >
            {started ? 'Restart' : 'Start'}
          </button>
        </div>
      </div>

      <div className="flex-center flex-col h-[70vh]">
        {/* Text display */}
        <div className="max-w-[1100px] mb-20 flex flex-wrap">
          {charArray.map((char: string, index: number) => (
                <span
                key={index}
                className={`mr-1 text-2xl ${
                  index === currentIndex && !pressed
                    ? 'text-yellow-500' // Highlight current letter in yellow
                    : index < currentIndex
                    ? errorIndexes.includes(index)
                      ? 'text-red-500' // Incorrect letters in red
                      : 'text-green-500' // Correct letters in green
                    : 'text-white' // Unreached letters in white
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
