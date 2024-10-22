'use client'
import TypeContent from '@/components/TypeContent';
import { Button } from '@/components/ui/button';
import VisualKeyboard from '@/components/VisualKeyboard';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react'
import { BattleDataType } from '@/components/self/BattleDialog';
import { getData, markReady, setStatus } from '../ImportantFunc';
import supabase from '../supabase';
import BattleResultBox from '@/components/BattleResultBox';
import PlayerDetails from '@/components/PlayerDetails';
import { TooltipDemo } from '@/components/self/ToolTip';
import { PiMoneyWavyBold } from "react-icons/pi";
import { ResultType } from '../page';

export type ParamType = { battleId: string; address: string }

const BattlePage = () => {
  const [params, setParams] = useState<ParamType>({
    battleId: '',
    address: '',
  });
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
  const [started] = useState(false);
  const [charArray, setCharArray] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(true);
  const [typedText, setTypedText] = useState('');
  const [errorIndexes, setErrorIndexes] = useState<number[]>([]);
  const [pressed, setPressed] = useState(false);
  const [selectedTime, setSelectedTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [keyPressed, setKeyPressed] = useState<string | null>(null);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [upward] = useState(0);
  const [openBattleDialog] = useState(false);
  const [battleDetails, setBattleDetails] = useState<BattleDataType>();
  const isPlayer1 = params.address == battleDetails?.player1;
  const [isPlayer2Ready, setIsPlayer2Ready] = useState(false);
  const searchParams = useSearchParams(); 
  const [message, setMessage] = useState('');
  const [battleStarted, setBattleStarted] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [count, setCount] = useState(4);
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
  
  const handleEndTest = () => {
      if(count == 0) setShowResult(true)
      clearInterval(timerInterval!);
  };

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
  


  const handleWordInput = (inputWord: string, currentIndex: number) => {
    setTypedWords((prev) => [...prev, inputWord]);

    if (inputWord === flattenWordText[currentWordIndex]) {
      setCorrectWordCount((prevCount) => prevCount + 1);
    }
  };

  function handleKeyPress (event: KeyboardEvent) {
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
        handleWordInput(currentWord, currentIndex);
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
}, [showResult, correctWordCount, typedWords]);

useEffect(() => {
  if(battleStarted){
    window.addEventListener('keydown', handleKeyPress)
  return () => {
    window.removeEventListener('keydown', handleKeyPress)
  }
}
}, [currentIndex, charArray, typedText, handleKeyPress]);

  useEffect(() => {
    const battleId = searchParams.get('battleId');
    const address = searchParams.get('address');

    if (battleId && address) {
      setParams({ battleId, address });
    } else {
      console.error('Missing battleId or address in URL params');
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData(params.battleId);

      if (data && data.length > 0) {
        setBattleDetails(data[0]); 
        setSelectedTime(data[0].typing_time)
        setRemainingTime(data[0].typing_time)
      } else {
        console.error('No battle details found');
      }
    };

    if (params) fetchData();
  }, [params]); 

  useEffect(() => {
    const subscription = supabase
      .channel('battle')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'battle' }, 
        (payload) => {
          if (payload.new.status !== payload.old.status) {
            const newStatus = payload.new.status;
            if (newStatus === 'started') {
              console.log('feelin it')
              setShowTimer(true);
            }
          }
  
          if (payload.new.ready_status) {
            console.log('working')
            setIsPlayer2Ready(true);
          }
        }
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(subscription);
    };
  });
  
  
  useEffect(() => {
    if (showTimer && count > 0 && !battleStarted) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else if (count === 0) {
      setShowTimer(false);
      setBattleStarted(true);
      if(!showResult) startTimer();
    }
  }, [showTimer, count]);

  const handleStartReady = async () => {
    if (isPlayer1) {
      if (isPlayer2Ready) {
          await setStatus('started', params.battleId);
      } else {
          setMessage('player2 is not ready yet')
      }
    } else {
      if(params) await markReady(params.battleId);
    }
  };


  return (
    <div className='text-white'>
        <div className='w-full flex-between p-6 px-16 mt-8'>
         <div>
          {!battleStarted && (
              <Button 
                onClick={handleStartReady} 
                className={`w-[150px] h-[50px] font-bold text-gray-100 text-lg rounded-md bg-[#D7B633] 
                          hover:bg-[#f3cf3f] hover:text-red-500 
                          transition-transform transform uppercase
                          ${isPlayer2Ready && params.address != battleDetails?.player1 ? 'text-red-500' : 'animate-start'}`}>
                {params.address == battleDetails?.player1 ? 'Start' : 'Ready'}
              </Button>
            )}
         </div>

          <Image src='/battle.png' width={40} height={40} alt='logo' />

          <div>
    
               <div className='flex-center gap-2'>
                      <TooltipDemo
                        hoverText={
                          <Image 
                            src='/piggy-bank2.png' 
                            alt='piggybank' 
                            width={40} 
                            height={40}
                            className=''
                          />
                        }
                        tooltipText={(
                          <div className='flex-center gap-1 font-mono'>
                            <p>Pool Money</p>
                            <span className='rotate-[90deg] text-green-600'><PiMoneyWavyBold/></span>
                          </div>
                        )}
                        hoverClass='cursor-pointer bg-transparent py-6 px-2'
                        tooltipClass=''
                      />
                    <div className='bg-gray-900 flex-center gap-2 font-mono px-6 py-3 rounded-md text-gray-500 text-sm'>
                      {battleDetails &&   (Number(battleDetails.eth_amount) * 2).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 7 })} Eth
                    </div>
               </div>
        
          </div>
        </div>

        <div className='w-full h-auto'>
          <div className='mt-16'>
              <div className='flex-center'>
                <h1 className='text-4xl'>{remainingTime}</h1>
              </div>

              <div className='mt-4'>
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
                  battle={true}
                />
              </div>

              <div className='bg-[var(--background)] z-10 h-[200px]'>
                <VisualKeyboard keyPressed={keyPressed}/>
              </div>
          </div>

          <div className='w-[350px] h-[200px] bg-gray-800 rounded-sm absolute bottom-5 right-5'>
              <div className='relative w-full h-full flex-center flex-col'>
                {battleDetails ? (
                  <div className=''>
                    {isPlayer1 && !isPlayer2Ready && message && (
                      <p className='text-sm w-full text-red-500 absolute bottom-[12.5rem] right-[-5px]'>{message}</p>
                    )}

                    {isPlayer1 && isPlayer2Ready && (
                      <Image 
                        src='/flag.png' 
                        width={28} 
                        height={28} 
                        alt='checkmark'
                        className='absolute top-[-20px] left-[10px]'  
                      />
                    )}

                   <div className='flex-center flex-col gap-2'>
                        <PlayerDetails address={isPlayer1 ? battleDetails.player2 : battleDetails.player1} />
                        <div className='text-center'>
                          <p>Player {isPlayer1 ? '2' : '1'}</p>
                          <p className='text-sm text-gray-400'>({isPlayer1 ? battleDetails.player2.slice(0, 8) : battleDetails.player1.slice(0, 8)}...)</p>
                        </div>
                   </div>

                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="w-10 h-10 border-5 border-t-5 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>

        </div>

        {showTimer && (
            <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
              <div className="text-white text-8xl font-bold animate-ping">
                {count === 1 ? 'Type !!' : count-1}
              </div>
            </div>
        )}

        {showResult && battleDetails && (
          <BattleResultBox 
            result={result}
            battleDetails={battleDetails}
            params={params}
          />
        )}


    </div>
  );
  
}

const BattlePageWithSuspense = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BattlePage />
    </Suspense>
  );
};

export default BattlePageWithSuspense;