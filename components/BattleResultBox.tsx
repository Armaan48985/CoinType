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

  const determineWinner = (wpm1: number, wpm2: number) => {
    let winner = "";

    if (wpm1 > wpm2) {
      setWinner(battleDetails?.player1);
      winner = battleDetails?.player1;
    } else if (wpm1 < wpm2) {
      setWinner(battleDetails?.player2);
      winner = battleDetails?.player2;
    }

    if (!newBattleDetails?.winner) updateWinner(winner);
  };

  useEffect(() => {
    const fetchResult = async () => {
      console.log("Fetching data because I ended second");
      const { data, error } = await supabase
        .from("battle")
        .select("*")
        .eq("invite_code", params.battleId);

      if (error) {
        console.error("Error fetching battle data:", error);
        return;
      }

      if (data && data.length > 0) {
        const battleData = data[0];
        setNewBattleDetails(battleData);

        const { player1_result: a, player2_result: b } = battleData;

        if (a && b) {
          setPlayer1WPM(a);
          setPlayer2WPM(b);
          determineWinner(Number(a), Number(b));
        }
      }
    };

    // If both results are available, use them directly from state.
    if (battleDetails?.player1_result && battleDetails?.player2_result) {
      console.log("Using data from battleDetails because I ended first");
      setPlayer1WPM(battleDetails.player1_result);
      setPlayer2WPM(battleDetails.player2_result);
      determineWinner(
        Number(battleDetails.player1_result),
        Number(battleDetails.player2_result)
      );
    } else if (params.battleId) {
      fetchResult();
    }
  }, [params.battleId]);

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
      .eq(isPlayer1 ? "player1" : "player2", params.address);

    if (error) console.error("Error updating result:", error);
    else {
    }
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
  }, [wpm, accuracy, sendResult]);

  // useEffect(() => {
  //   const subscription = supabase
  //     .channel('battle')
  //     .on('postgres_changes',
  //       { event: 'UPDATE', schema: 'public', table: 'battle' },
  //       (payload) => {
  //         if ((payload.new.player1_result !== payload.old.player1_result) && (payload.new.player2_result !== payload.old.player2_result)) {
  //           console.log('causing infinte loop')
  //           setPlayer1WPM(payload.new.player1_result);
  //           setPlayer2WPM(payload.new.player2_result);
  //           determineWinner(payload.new.player1_result, payload.new.player2_result);
  //         }

  //       }
  //     )
  //     .subscribe();

  //   return () => {
  //     supabase.removeChannel(subscription);
  //   };
  // });

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
