import React, { useEffect, useState } from 'react';
import { FaRedoAlt } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { ParamType } from '@/app/battle/page';
import { BattleDataType } from './self/BattleDialog';
import supabase from '@/app/supabase';
import { Button } from './ui/button';
import { useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';

interface BattleResultBoxProps {
  setShowResult: (show: boolean) => void;
  typedText: string;
  remainingTime: number;
  selectedTime: number;
  incorrectCount: number;
  setBattleDetails: (details: BattleDataType) => void;
  params: ParamType;
  battleDetails: BattleDataType;
}

const BattleResultBox: React.FC<BattleResultBoxProps> = ({
  setShowResult,
  typedText,
  remainingTime,
  selectedTime,
  incorrectCount,
  setBattleDetails,
  params,
  battleDetails,
}) => {
  const [wpm, setWpm] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [player1WPM, setPlayer1WPM] = useState<number | null>(null);
  const [player2WPM, setPlayer2WPM] = useState<number | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [prizeSent, setPrizeSent] = useState(false);
  const isPlayer1 = params.address == battleDetails?.player1;
  const {
    sendTransaction ,
    status
  } = useSendTransaction();
  const [isLoading, setIsLoading] = useState(false); // Track if the transaction is in progress

  const handleClaimPrize = async () => {
    setIsLoading(true); // Start loading when the button is clicked
    try {
      await sendPrize(); // Call the function to send the prize
    } catch (error) {
      console.error('Transaction failed:', error);
    } finally {
      setIsLoading(false); // Stop loading when transaction completes
    }
  };


  const calculateWPM = () => {
    const totalWords = typedText.trim().split(/\s+/).length;
    const timeTakenInSeconds = selectedTime - remainingTime;
    const timeTakenInMinutes = timeTakenInSeconds / 60;
    const calculatedWPM = timeTakenInMinutes > 0 ? Math.round(totalWords / timeTakenInMinutes) : 0;
    setWpm(calculatedWPM);
  };

  const calculateAccuracy = () => {
    const totalChars = typedText.length;
    const correctChars = totalChars - incorrectCount;
    const calculatedAccuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;
    setAccuracy(calculatedAccuracy);
  };

  const sendResult = async () => {
    const isPlayer1 = params.address === battleDetails?.player1;
    const currentResult = isPlayer1 ? battleDetails?.player1_result : battleDetails?.player2_result;
  
    if (Number(currentResult) === wpm) return; // Avoid unnecessary updates
  
    const updateColumn = isPlayer1 ? 'player1_result' : 'player2_result';
  
    const { error } = await supabase
      .from('battle')
      .update({ [updateColumn]: wpm })
      .eq('invite_code', params.battleId)
      .eq(isPlayer1 ? 'player1' : 'player2', params.address);
  
    if (error) console.error('Error updating result:', error);
    else {
      
    }
  };
  


  const updateWinner = async (winnerName: string) => {
    try {
      const { error } = await supabase
        .from('battle')
        .update({ winner: winnerName, status: 'completed' })
        .eq('invite_code', params.battleId);
  
      if (error) throw error;
  
      console.log('Winner and status updated successfully');
    } catch (error) {
      console.error('Error updating winner:', error);
    }
  };
  
  const determineWinner = (wpm1: number, wpm2: number) => {
    let winner = '';
  
    if (wpm1 > wpm2) {
      setWinner(battleDetails?.player1)
      winner = battleDetails?.player1; 
    } else if (wpm1 < wpm2) {
      setWinner(battleDetails?.player2)
      winner = battleDetails?.player2; 
    } 

    console.log(wpm1, wpm2, winner);
  
    updateWinner(winner);
  };
  
  
  useEffect(() => {
    calculateWPM();
    calculateAccuracy();
  }, []);

  useEffect(() => {
    if (wpm !== null && accuracy !== null) sendResult();
  }, [wpm, accuracy]);

  useEffect(() => {
    const subscription = supabase
      .channel('battle')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'battle' },
        (payload) => {
          const { player1_result, player2_result } = payload.new;
  
          const isPlayer1Changed = player1_result !== player1WPM;
          const isPlayer2Changed = player2_result !== player2WPM;
  
          if (player1_result && player2_result && (isPlayer1Changed || isPlayer2Changed)) {
            console.log('Both players submitted:', payload.new);
  
            setPlayer1WPM(player1_result);
            setPlayer2WPM(player2_result);
            determineWinner(player1_result, player2_result);
          } else {
            console.log('No change in player results.');
          }
        }
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [player1WPM, player2WPM]);

  const { ethers } = require('ethers');


  const provider = new ethers.JsonRpcProvider('https://rpc.walletconnect.com/v1/?chainId=eip155:11155111&projectId=735705f1a66fe187ed955c8f9e16164d');
  const wallet = new ethers.Wallet('6b145441a2d76c3202b4bdebc6d66466c031d9890ccaec7ed90b5775603ee460', provider);
  const router = useRouter()

  async function sendPrize() {
    if (!winner) return;
    if(prizeSent){
      router.push('/')
      return;
    }
    const a = Number(battleDetails.eth_amount) * 2;
    const amount = a.toFixed(10);
    const tx = await wallet.sendTransaction({
      to: winner,
      value: ethers.parseEther(amount.toString()),
    });
  
    console.log(`Transaction Hash: ${tx.hash}`);
    await tx.wait();
    console.log('Transaction confirmed');
    setPrizeSent(true)
  }

  
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      {(winner === '' || winner === null) && (player1WPM && player2WPM) ? (
        // Loading Spinner
        <div className="flex items-center justify-center h-48">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-b-cyan-400 animate-spin"></div>
            <div className="absolute inset-0 rounded-full border-4 border-l-transparent border-r-pink-500 animate-spin-slow"></div>
          </div>
        </div>
      ) : winner === params.address ? (
        // Winner Box
        <div className="relative w-[450px]  p-8 bg-gray-800 rounded-2xl shadow-2xl font-mono">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-green-400">You Won!! 🎉😺</h1>
          </div>

          <div>
            <h1>Your Score : {wpm}</h1>
            <h1>{isPlayer1 ? `Player2 Score: ${battleDetails.player2_result}` : `Player1 Score: ${battleDetails.player1_result}`}</h1>
          </div>

          <div className="space-y-4">
            <p className="text-lg text-gray-300">
              You earned {" "}
              <span className="font-bold text-cyan-300">
                {(Number(battleDetails.eth_amount) * 2).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 7 })} ETH
              </span>!
            </p>
            <Button
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
            onClick={handleClaimPrize}
            disabled={isLoading}
          >
            {isLoading
              ? 'Wait for transaction...'
              : prizeSent
              ? 'Go to Home Page'
              : 'Claim Prize'}
          </Button>
            {prizeSent && (
              <p className="text-center text-green-400 mt-4">Prize sent successfully!</p>
            )}
          </div>
        </div>
      ) : (
        // Loser Box
        <div className="relative w-[450px] p-8 bg-gray-800 rounded-2xl shadow-2xl font-mono">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-red-400">You Lost!! 😿</h1>
          </div>

          <div>
            <h1>Your Score : {wpm}</h1>
            <h1>{isPlayer1 ? `Player2 Score: ${player2WPM}` : `Player1 Score: ${battleDetails.player1_result}`}</h1>
          </div>


          <div className="space-y-4">
            <p className="text-lg text-gray-300">Better luck next time!</p>
            <Button
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
              onClick={() => router.push('/')}
            >
              Go to Home Page
            </Button>
          </div>
        </div>
      )}
    </div>
  );
  
  
};

export default BattleResultBox;
