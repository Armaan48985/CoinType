import React, { useCallback, useEffect, useState } from "react";
import { ParamType } from "@/app/battle/page";
import { BattleDataType } from "./self/BattleDialog";
import supabase from "@/app/supabase";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { ResultType } from "@/app/page";

interface BattleResultBoxProps {
  result: ResultType;
  params: ParamType;
  battleDetails: BattleDataType;
}

const BattleResultBox: React.FC<BattleResultBoxProps> = ({
  result,
  params,
  battleDetails,
}) => {
  const {wpm , accuracy} = result;
  const [player1WPM, setPlayer1WPM] = useState<string | null>(null);
  const [player2WPM, setPlayer2WPM] = useState<string | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [prizeSent, setPrizeSent] = useState(false);
  const isPlayer1 = params.address == battleDetails?.player1;
  const [isLoading, setIsLoading] = useState(false); 
  const [newBattleDetails, setNewBattleDetails] = useState<BattleDataType>();


  const handleClaimPrize = async () => {
    setIsLoading(true); // Start loading when the button is clicked
    try {
      await sendPrize(); // Call the function to send the prize
    } catch (error) {
      console.error("Transaction failed:", error);
    } finally {
      setIsLoading(false); // Stop loading when transaction completes
    }
  };

  useEffect(() => {
    const fetchResult = async () => {
      const { data, error } = await supabase.from("battle").select('*').eq("invite_code", params.battleId); 
      
      if(data){
        const a = data[0].player1_result;
        const b = data[0].player2_result;
        setNewBattleDetails(data[0]);

        if(a && b) {
          setPlayer1WPM(a);
          setPlayer2WPM(b);
          determineWinner(Number(a), Number(b));
        }
      }
    }

      if(battleDetails?.player1_result&& battleDetails?.player2_result) {
        console.log('taking from battleDetails becoz i ended first')
        setPlayer1WPM(battleDetails.player1_result);
        setPlayer2WPM(battleDetails.player2_result);
        determineWinner(Number(battleDetails.player1_result), Number(battleDetails.player2_result));
      }

      else {
        console.log('fetching data becoz i ended second')
        fetchResult()
      }

      
  }, [battleDetails])


  const sendResult = async () => {
    const isPlayer1 = params.address === battleDetails?.player1;
    const currentResult = isPlayer1
      ? battleDetails?.player1_result
      : battleDetails?.player2_result;

    if (Number(currentResult) === wpm) return; // Avoid unnecessary updates

    const updateColumn = isPlayer1 ? "player1_result" : "player2_result";

    const { error } = await supabase
      .from("battle")
      .update({ [updateColumn]: wpm })
      .eq("invite_code", params.battleId)
      .eq(isPlayer1 ? "player1" : "player2", params.address)

    if (error) console.error("Error updating result:", error);
    else {
    }
  };

  const updateWinner =  async(winnerName: string) => {
    try {
      const { error } = await supabase
        .from("battle")
        .update({ winner: winnerName, status: "completed" })
        .eq("invite_code", params.battleId);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating winner:", error);
    }
  };

  const determineWinner = (wpm1: number, wpm2: number) => {
    let winner = "";

    if (wpm1 > wpm2) {
      setWinner(battleDetails?.player1);
      winner = battleDetails?.player1;
    } else if (wpm1 < wpm2) {
      setWinner(battleDetails?.player2);
      winner = battleDetails?.player2;
    }

    if(!newBattleDetails?.winner) updateWinner(winner);
  };

  useEffect(() => {
    if (wpm !== null && accuracy !== null) sendResult();
  }, [wpm, accuracy]);



  useEffect(() => {
    const subscription = supabase
      .channel('battle')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'battle' }, 
        (payload) => {
          if ((payload.new.player1_result !== payload.old.player1_result) && (payload.new.player2_result !== payload.old.player2_result)) {
            console.log('causing infinte loop')
            setPlayer1WPM(payload.new.player1_result);
            setPlayer2WPM(payload.new.player2_result);
            determineWinner(payload.new.player1_result, payload.new.player2_result);
          }
  
        }
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(subscription);
    };
  });
  

  const provider = new ethers.JsonRpcProvider(
    "https://rpc.walletconnect.com/v1/?chainId=eip155:11155111&projectId=735705f1a66fe187ed955c8f9e16164d"
  );
  const wallet = new ethers.Wallet(
    "6b145441a2d76c3202b4bdebc6d66466c031d9890ccaec7ed90b5775603ee460",
    provider
  );
  const router = useRouter();

  async function sendPrize() {
    if (!winner) return;
    if (prizeSent) {
      router.push("/");
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
    console.log("Transaction confirmed");
    setPrizeSent(true);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      {winner == null && !player1WPM && !player2WPM ? (
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
            <h1 className="text-4xl font-bold text-green-400">
              You Won!! 🎉😺
            </h1>
          </div>

          <div>
            <h1>Your Score : {wpm}</h1>
            <h1>
              {isPlayer1
                ? `Player2 Score: ${player2WPM}`
                : `Player1 Score: ${player1WPM}`}
            </h1>
          </div>

          <div className="space-y-4">
            <p className="text-lg text-gray-300">
              You earned{" "}
              <span className="font-bold text-cyan-300">
                {(Number(battleDetails.eth_amount) * 2).toLocaleString(
                  "en-US",
                  { minimumFractionDigits: 0, maximumFractionDigits: 7 }
                )}{" "}
                ETH
              </span>
              !
            </p>
            <Button
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
              onClick={handleClaimPrize}
              disabled={isLoading}
            >
              {isLoading
                ? "Wait for transaction..."
                : prizeSent
                ? "Go to Home Page"
                : "Claim Prize"}
            </Button>
            {prizeSent && (
              <p className="text-center text-green-400 mt-4">
                Prize sent successfully!
              </p>
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
            <h1>
              {isPlayer1
                ? `Player2 Score: ${player2WPM}`
                : `Player1 Score: ${player1WPM}`}
            </h1>
          </div>

          <div className="space-y-4">
            <p className="text-lg text-gray-300">Better luck next time!</p>
            <Button
              className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg shadow-md transition-transform transform hover:scale-105"
              onClick={() => router.push("/")}
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
