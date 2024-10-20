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
  const {
    sendTransaction ,
    status
  } = useSendTransaction();

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
  
          // Check if the new results are different from the existing ones
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
    <div className="relative w-[450px] min-h-[340px] p-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700">
      <div className="flex-center mb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-wide">
          Battle Results
        </h1>
      </div>
  
      {player1WPM && player2WPM ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-300">Player 1 WPM:</h2>
            <p className="text-2xl font-bold text-cyan-400">{player1WPM}</p>
          </div>
  
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-300">Player 2 WPM:</h2>
            <p className="text-2xl font-bold text-cyan-400">{player2WPM}</p>
          </div>
  
          <div className="flex-center flex-col">
            <p className={`text-4xl font-bold ${winner === params.address ? 'text-green-400' : 'text-red-400'}`}>
              {winner === params.address ? 'You Won!' : 'You Lost'}
             
            </p>
            {winner === params.address && (
                <p className="text-sm text-white">
                  (You get <span className="font-bold text-cyan-300">{(Number(battleDetails.eth_amount) * 2).toFixed()}</span> ETH)
                </p>
              )}
          </div>
  
          {winner === params.address ? (
            <div className="text-center">
              <Button
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
                onClick={sendPrize}
              >
                {prizeSent ? 'Go to Home Page' : 'Send Prize'}
              </Button>
            </div>
          ) : (
              <Button
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
                onClick={() => router.push('/')}
                >Go to Home Page
                </Button>
          )}

          {prizeSent && (
            <div className="text-center">
              <p className="text-green-400">Prize sent successfully</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center h-48">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-b-cyan-400 animate-spin"></div>
            <div className="absolute inset-0 rounded-full border-4 border-l-transparent border-r-pink-500 animate-spin-slow"></div>
          </div>
        </div>
      )}
    </div>
  </div>
  
  );
};

export default BattleResultBox;
