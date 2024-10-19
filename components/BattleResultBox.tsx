import React, { useEffect, useState } from 'react';
import { FaRedoAlt } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { ParamType } from '@/app/battle/page';
import { BattleDataType } from './self/BattleDialog';
import supabase from '@/app/supabase';

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
      setWinner('player1');
      winner = battleDetails?.player1 ?? 'player1'; 
    } else if (wpm1 < wpm2) {
      setWinner('player2');
      winner = battleDetails?.player2 ?? 'player2'; 
    } 
  
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
  
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="relative w-[380px] min-h-[320px] p-6 bg-gray-800 rounded-xl shadow-2xl border-gray-600">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Battle Results</h1>
          <button
            className="text-gray-400 hover:bg-gray-700 rounded-full p-2 transition-colors"
            onClick={() => setShowResult(false)}
          >
            <IoMdClose size={24} />
          </button>
        </div>

        {player1WPM && player2WPM ? (
          <div className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-medium text-gray-300">Player 1 WPM:</h2>
            <p className="text-2xl font-bold text-blue-400">{player1WPM}</p>
          </div>

          <div className="flex items-center gap-3">
            <h2 className="text-xl font-medium text-gray-300">Player 2 WPM:</h2>
            <p className="text-2xl font-bold text-blue-400">{player2WPM}</p>
          </div>

          <div className="flex items-center gap-3">
            <h2 className="text-xl font-medium text-gray-300">Winner:</h2>
            <p className="text-2xl font-bold text-green-400">{winner}</p>
          </div>
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
