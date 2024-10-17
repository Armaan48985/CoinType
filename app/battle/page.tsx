'use client'
import TypeContent from '@/components/TypeContent';
import { Button } from '@/components/ui/button';
import VisualKeyboard from '@/components/VisualKeyboard';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { textObject } from '../page';
import { BattleDataType } from '@/components/self/BattleDialog';
import { getData } from '../ImportantFunc';
import supabase from '../supabase';

const page = () => {
  const pathname = usePathname();
  const [params, setParams] = useState<{ battleId: string; address: string }>({
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
  const [selectedTime, setSelectedTime] = useState(15);
  const [remainingTime, setRemainingTime] = useState(15);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [keyPressed, setKeyPressed] = useState<string | null>(null);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [upward, setUpward] = useState(0);
  const [openBattleDialog, setOpenBattleDialog] = useState(false);
  const [battleDetails, setBattleDetails] = useState<BattleDataType>();

  useEffect(() => {
      window.addEventListener('keydown', handleKeyPress)
      return () => {
        window.removeEventListener('keydown', handleKeyPress)
    }
  }, [currentIndex, charArray, typedText, started, openBattleDialog]);


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

const searchParams = useSearchParams(); 

useEffect(() => {
  // Extract params from the URL on component mount
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
    if (!params) return; // Ensure params are available
    console.log('Params:', params);

    const data = await getData(params.battleId);
    console.log('fetchData result:', data);
    if (data && data.length > 0) {
      setBattleDetails(data[0]); 
    } else {
      console.error('No battle details found');
    }
  };

  if (params) fetchData();
}, [params]); // Add params as a dependency


const isPlayer1 = params.address == battleDetails?.player1;
const [isPlayer2Ready, setIsPlayer2Ready] = useState(false);


useEffect(() => {
  const subscription = supabase
  .channel('battle')
  .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'battle' }, () => {
    setIsPlayer2Ready(true);
    alert('Battle updated!');
  })
  
  .subscribe();

return () => {
  supabase.removeChannel(subscription);
};
}, []);
 

const handleStartReady = async () => {
  if (isPlayer1) {
    if (isPlayer2Ready) {
      console.log('Battle started!');
      alert('Battle started!');
    } else {
      console.log('Player 2 is not ready');
      alert('Player 2 is not ready yet.');
    }
  } else {
    await markReady();
  }
};

  const markReady = async () => {
    const data = await supabase.from('battle').update({ ready_status: true }).eq('invite_code', params.battleId).select('*');

    console.log('Marked as ready:', data);
  };

  return (
    <div className='text-white'>
        <div className='w-full flex-between p-6 px-16 mt-8'>
          <Button onClick={handleStartReady} className='text-white bg-yellow-400'>
            {params.address == battleDetails?.player1 ? 'Start' : 'Ready'}
          </Button>

          <Image src='/battle.png' width={40} height={40} alt='logo' />

          <span className='bg-[#073b4c] text-sm p-3 rounded-lg'>{params.address.slice(0,9)}...</span>
        </div>

        <div className='w-full h-auto'>
          <div className='mt-16'>

              {isPlayer2Ready && (
                <div className='flex-center'>
                  <h1 className='text-4xl'>Player2 Ready</h1>
                </div>
              )}
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

          <div className='w-[280px] flex-center h-[200px] bg-gray-600 absolute bottom-5 right-5'>
            player2 details
          </div>
        </div>
    </div>
  );
}

export default page