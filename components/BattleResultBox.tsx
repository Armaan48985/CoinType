import React, { useEffect, useState } from "react";
import { ParamType } from "@/app/battle/page";
import { BattleDataType } from "./BattleDialog";
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
  const { wpm, accuracy } = result;
  const [player1WPM, setPlayer1WPM] = useState<string | null>(null);
  const [player2WPM, setPlayer2WPM] = useState<string | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [prizeSent, setPrizeSent] = useState(false);
  const isPlayer1 = params.address == battleDetails?.player1;
  const [isLoading, setIsLoading] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  const router = useRouter();
  
  const handleClaimPrize = async () => {
    setIsLoading(true);
    try {
      await sendPrize();
    } catch (error) {
      console.error("Transaction failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const determineWinner = (wpm1: number, wpm2: number) => {
    let winner = "";

    if (wpm1 > wpm2) winner = battleDetails?.player1;
    else if (wpm1 < wpm2) winner = battleDetails?.player2;
    setWinner(winner);
    updateWinner(winner);
  };

  // Polling function to check for result updates
  const pollForResult = async () => {
    const { data, error } = await supabase
      .from("battle")
      .select("*")
      .eq("invite_code", params.battleId)
      .single();

    if (error) {
      console.error("Polling failed:", error);
      return;
    }

    if (data && data.player1_result && data.player2_result) {
      setPlayer1WPM(data.player1_result);
      setPlayer2WPM(data.player2_result);
      determineWinner(Number(data.player1_result), Number(data.player2_result));
    }
  };

  useEffect(() => {
    if (player1WPM && player2WPM && winner) return;

    const subscription = supabase
      .channel("battle")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "battle" },
        (payload) => {
          if (!payload.new) return;

          const { player1_result, player2_result } = payload.new;

          if (player1_result && player2_result) {
            setPlayer1WPM((prev) => (prev !== player1_result ? player1_result : prev));
            setPlayer2WPM((prev) => (prev !== player2_result ? player2_result : prev));

            determineWinner(Number(player1_result), Number(player2_result));
          }
        }
      )
      .subscribe();

    // Start polling after 5 seconds if subscription data is not updated
    const pollTimeout = setTimeout(() => {
      pollForResult();
      setPollingInterval(
        setInterval(() => {
          pollForResult();
        }, 5000) // Poll every 5 seconds after initial check
      );
    }, 5000); // Start polling if no result after 5 seconds

    return () => {
      supabase.removeChannel(subscription);
      if (pollingInterval) clearInterval(pollingInterval);
      clearTimeout(pollTimeout);
    };
  }, [player1WPM, player2WPM, winner, battleDetails]);

  const sendResult = async () => {
    const isPlayer1 = params.address === battleDetails?.player1;
    const currentResult = isPlayer1
      ? battleDetails?.player1_result
      : battleDetails?.player2_result;

    if (Number(currentResult) === wpm) return;

    const updateColumn = isPlayer1 ? "player1_result" : "player2_result";

    const { error } = await supabase
      .from("battle")
      .update({ [updateColumn]: wpm })
      .eq("invite_code", params.battleId)
      .eq(isPlayer1 ? "player1" : "player2", params.address);

    if (error) console.error("Error updating result:", error);
  };

  const updateWinner = async (winnerName: string) => {
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

  useEffect(() => {
    if (battleDetails?.player1_result && battleDetails?.player2_result) {
      setPlayer1WPM(battleDetails.player1_result);
      setPlayer2WPM(battleDetails.player2_result);
      determineWinner(
        Number(battleDetails.player1_result),
        Number(battleDetails.player2_result)
      );
    }
  }, [battleDetails]);

  useEffect(() => {
    if (wpm !== null && accuracy !== null) sendResult();
  }, [wpm, accuracy]);

  const provider = new ethers.JsonRpcProvider(
    "https://rpc.walletconnect.com/v1/?chainId=eip155:11155111&projectId=735705f1a66fe187ed955c8f9e16164d"
  );
  const wallet = new ethers.Wallet(
    process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY || '',
    provider
  );

  async function sendPrize() {
    if (!winner || prizeSent) {
      router.push("/");
      return;
    }

    try {
      const amount = (Number(battleDetails.eth_amount) * 2).toFixed(10);
      const tx = await wallet.sendTransaction({
        to: winner,
        value: ethers.parseEther(amount),
      });

      console.log(`Transaction Hash: ${tx.hash}`);
      await tx.wait();
      setPrizeSent(true);
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
     {!winner && (!player1WPM || !player2WPM) ? (
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
