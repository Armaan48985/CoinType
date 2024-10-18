'use client'
import TypeContent from '@/components/TypeContent';
import { Button } from '@/components/ui/button';
import VisualKeyboard from '@/components/VisualKeyboard';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { textObject } from '../page';
import { BattleDataType } from '@/components/self/BattleDialog';
import { getData, markReady, setStatus } from '../ImportantFunc';
import supabase from '../supabase';
import { IoCheckmarkSharp } from "react-icons/io5";
import ResultBox from '@/components/ResultBox';
import BattleResultBox from '@/components/BattleResultBox';
import { clear } from 'console';

export type ParamType = { battleId: string; address: string }

const page = () => {
  const [params, setParams] = useState<ParamType>({
    battleId: '',
    address: '',
  });
  const [text, setText] = useState(`Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quod est iste cumque modi consequatur nam possimus facilis iusto vel aperiam neque, architecto reiciendis, laboriosam exercitationem debitis facere? Aperiam reprehenderit sapiente, voluptate explicabo voluptates laborum ratione, tempore odit non labore ipsam culpa dolores magnam cupiditate, sint ut ipsa amet rem totam`)
  const [finalText, setFinalText] = useState<textObject[]>([])
  const [started, setStarted] = useState(false);
  const [charArray, setCharArray] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(true);
  const [typedText, setTypedText] = useState('');
  const [errorIndexes, setErrorIndexes] = useState<number[]>([]);
  const [pressed, setPressed] = useState(false);
  const [selectedTime, setSelectedTime] = useState(7);
  const [remainingTime, setRemainingTime] = useState(7);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [keyPressed, setKeyPressed] = useState<string | null>(null);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [upward, setUpward] = useState(0);
  const [openBattleDialog, setOpenBattleDialog] = useState(false);
  const [battleDetails, setBattleDetails] = useState<BattleDataType>();
  const isPlayer1 = params.address == battleDetails?.player1;
  const [isPlayer2Ready, setIsPlayer2Ready] = useState(false);
  const searchParams = useSearchParams(); 
  const [message, setMessage] = useState('');
  const [battleStarted, setBattleStarted] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [count, setCount] = useState(4);

  useEffect(() => {
      if(battleStarted){
        window.addEventListener('keydown', handleKeyPress)
      return () => {
        window.removeEventListener('keydown', handleKeyPress)
    }
      }
  }, [currentIndex, charArray, typedText, battleStarted]);


  useEffect(() => {
    if (remainingTime === 0 || openBattleDialog) {
      handleEndTest();
    }
  }, [remainingTime, openBattleDialog]);

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
      clearInterval(timerInterval!);
    }
  };
  
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
    if(openBattleDialog){
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



  useEffect(() => {
    const battleId = searchParams.get('battleId');
    const address = searchParams.get('address');

    if (battleId && address) {
      setParams({ battleId, address });
    } else {
      console.error('Missing battleId or address in URL params');
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!params) return;

      const data = await getData(params.battleId);

      if (data && data.length > 0) {
        setBattleDetails(data[0]); 
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

            console.log('status', payload.old.status, payload.new.status)
            const newStatus = payload.new.status;
            if (newStatus === 'started') {
              setShowTimer(true);
            }
          }
  
          if (payload.new.ready_status !== payload.old.ready_status) {
            console.log('ready', payload.old.ready_status, payload.new.ready_status)
            setIsPlayer2Ready(true);
          }
        }
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);
  
  
  useEffect(() => {
    if (showTimer && count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else if (count === 0) {
      setShowTimer(false);
      setBattleStarted(true);
      startTimer();
    }
  }, [showTimer, count]);

  const handleStartReady = async () => {
    if (isPlayer1) {
      if (isPlayer2Ready) {
        console.log('setting status to zzzzzzzz')
          setShowTimer(true);
          setStatus('started', params.battleId);
      } else {
          setMessage('player2 is not ready yet')
      }
    } else {
      console.log('not setting status to zzzzzzzz')
      await markReady(params.battleId);
    }
  };


  return (
    <div className='text-white'>
        <div className='w-full flex-between p-6 px-16 mt-8'>
         <div>
          {!battleStarted && (
              <Button onClick={handleStartReady} className='text-white bg-yellow-400'>
                {params.address == battleDetails?.player1 ? 'Start' : 'Ready'}
              </Button>
            )}
         </div>

          <Image src='/battle.png' width={40} height={40} alt='logo' />

          <span className='bg-[#073b4c] text-sm p-3 rounded-lg'>{params.address.slice(0,9)}...</span>
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
                  setUpward={setUpward}
                  battle={true}
                />
              </div>

              <div className='bg-[var(--background)] z-10 h-[200px]'>
                <VisualKeyboard keyPressed={keyPressed}/>
              </div>
          </div>

          <div className='w-[350px] h-[200px] bg-gray-600 rounded-sm absolute bottom-5 right-5'>
              <div className='relative w-full h-full  flex-center'>
                {isPlayer1 && !isPlayer2Ready && message && (
                  <p className='text-sm w-full text-red-500 absolute bottom-[12.5rem] right-0'>* {message} *</p>
                )}
                {isPlayer1 && isPlayer2Ready && (
                  <Image 
                    src='/flag.png' 
                    width={20} 
                    height={20} 
                    alt='checkmark'
                    className='absolute top-[-25px] left-[10px] rotate-[10deg]'  
                  />
                )}
                <p>player{isPlayer1 ? '2' : '1'} detail</p>
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
            setShowResult={setShowResult} 
            typedText={typedText} 
            remainingTime={remainingTime} 
            selectedTime={selectedTime} 
            incorrectCount={incorrectCount} 
            battleDetails={battleDetails}
            setBattleDetails={setBattleDetails}
            params={params}
          />
        )}


    </div>
  );
}

export default page