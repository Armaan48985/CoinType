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
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);
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

  console.log('wpm:', wpm);


  const sendResult = async () => {
    const isPlayer1 = params.address === battleDetails?.player1;
    const updateColumn = isPlayer1 ? 'player1_result' : 'player2_result';

    const { data, error } = await supabase
      .from('battle')
      .update({ [updateColumn]: wpm })
      .eq('invite_code', params.battleId)
      .eq(isPlayer1 ? 'player1' : 'player2', params.address)
      .select('*'); 

    if (error) console.error('Error updating result:', error);
    else {
      console.log('Result updated successfully:', data);
      setBattleDetails(data[0])
    };
  };

  const fetchResults = async () => {
    const { data, error } = await supabase
      .from('battle')
      .select('player1_result, player2_result')
      .eq('invite_code', params.battleId);

    if (error) {
      console.error('Error fetching results:', error);
    } else if (data && data.length > 0) {
      console.log('results:', data[0]);
      const { player1_result, player2_result } = data[0];
      setPlayer1WPM(player1_result);
      setPlayer2WPM(player2_result);
      determineWinner(player1_result, player2_result);

      await supabase.from('battles').update({ winner: winner, status: 'completed' }).eq('invite_code', params.battleId);
    }
  };
  
  const determineWinner = (wpm1: number, wpm2: number) => {
    if (wpm1 > wpm2) setWinner('Player 1');
    else if (wpm1 < wpm2) setWinner('Player 2');
    else setWinner('It’s a tie');
  };
  
  useEffect(() => {
    calculateWPM();
    calculateAccuracy();
  }, []);

  useEffect(() => {
    sendResult();
    fetchResults();
  }, [wpm, accuracy]);

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

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-medium text-gray-300">Player 1 WPM:</h2>
            <p className="text-2xl font-bold text-blue-400">{player1WPM ?? 'N/A'}</p>
          </div>

          <div className="flex items-center gap-3">
            <h2 className="text-xl font-medium text-gray-300">Player 2 WPM:</h2>
            <p className="text-2xl font-bold text-blue-400">{player2WPM ?? 'N/A'}</p>
          </div>

          <div className="flex items-center gap-3">
            <h2 className="text-xl font-medium text-gray-300">Winner:</h2>
            <p className="text-2xl font-bold text-green-400">{winner}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleResultBox;
