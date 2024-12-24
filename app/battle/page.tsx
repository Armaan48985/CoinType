"use client";
import TypeContent from "@/components/TypeContent";
import { Button } from "@/components/ui/button";
import VisualKeyboard from "@/components/VisualKeyboard";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { BattleDataType } from "@/components/BattleDialog";
import { getData, markReady, setStatus } from "../ImportantFunc";
import supabase from "../supabase";
import BattleResultBox from "@/components/BattleResultBox";
import PlayerDetails from "@/components/PlayerDetails";
import { TooltipDemo } from "@/components/self/ToolTip";
import { PiMoneyWavyBold } from "react-icons/pi";
import { ResultType } from "../page";

export type ParamType = { battleId: string; address: string };

const BattlePage = () => {
  const [params, setParams] = useState<ParamType>({
    battleId: "",
    address: "",
  });
  const [finalText] = useState<string[][]>([
    ["H", "e", "l", "l", "o"],
    [" "],
    ["w", "o", "r", "l", "d"],
    [" "],
    ["t", "h", "i", "s"],
    [" "],
    ["i", "s"],
    [" "],
    ["a"],
    [" "],
    ["t", "e", "s", "t"],
    [" "],
    ["o", "f"],
    [" "],
    ["t", "e", "x", "t"],
    [" "],
    ["o", "b", "j", "e", "c", "t", "s"],
    [" "],
    ["f", "o", "r"],
    [" "],
    ["j", "a", "v", "a"],
    [" "],
    ["e", "x", "a", "m", "p", "l", "e"],
    [" "],
    ["t", "e", "s", "t", "i", "n", "g"],
    [" "],
    ["c", "h", "a", "r", "a", "c", "t", "e", "r", "s"],
    [" "],
    ["a", "n", "d"],
    [" "],
    ["s", "t", "r", "u", "c", "t", "u", "r", "e"],
    [" "],
    ["a", "r", "r", "a", "y"],
    [" "],
    ["o", "f"],
    [" "],
    ["c", "h", "a", "r", "a", "c", "t", "e", "r", "s"],
    [" "],
    ["i", "s"],
    [" "],
    ["n", "e", "c", "e", "s", "s", "a", "r", "y"],
    [" "],
    ["f", "o", "r"],
    [" "],
    ["b", "u", "i", "l", "d", "i", "n", "g"],
    [" "],
    ["d", "a", "t", "a"],
    [" "],
    ["s", "t", "r", "u", "c", "t", "u", "r", "e", "s"],
    [" "],
    ["i", "n"],
    [" "],
    ["a", "n", "y"],
    [" "],
    ["j", "a", "v", "a"],
    [" "],
    ["a", "p", "p", "l", "i", "c", "a", "t", "i", "o", "n"],
    [" "],
    ["t", "h", "a", "t"],
    [" "],
    ["n", "e", "e", "d", "s"],
    [" "],
    ["t", "o"],
    [" "],
    ["m", "a", "n", "i", "p", "u", "l", "a", "t", "e"],
    [" "],
    ["t", "e", "x", "t"],
    [" "],
    ["f", "o", "r"],
    [" "],
    ["v", "a", "r", "i", "o", "u", "s"],
    [" "],
    ["f", "u", "n", "c", "t", "i", "o", "n", "a", "l", "i", "t", "i", "e", "s"],
    [" "],
    ["i", "n"],
    [" "],
    ["j", "a", "v", "a"],
    [" "],
    ["p", "r", "o", "g", "r", "a", "m", "m", "i", "n", "g"],
    [" "],
    ["t", "o", "d", "a", "y"],
    [" "],
    ["a", "n", "d"],
    [" "],
    ["c", "r", "e", "a", "t", "e"],
    [" "],
    ["n", "e", "w"],
    [" "],
    ["o", "p", "p", "o", "r", "t", "u", "n", "i", "t", "i", "e", "s"],
    [" "],
    ["f", "o", "r"],
    [" "],
    ["f", "u", "t", "u", "r", "e"],
    [" "],
    ["d", "e", "v", "e", "l", "o", "p", "m", "e", "n", "t"],
    ["J", "a", "v", "a"],
    [""],
    ["i", "s"],
    [""],
    ["a"],
    [""],
    ["v", "e", "r", "s", "a", "t", "i", "l", "e"],
    [""],
    ["p", "r", "o", "g", "r", "a", "m", "m", "i", "n", "g"],
    [""],
    ["l", "a", "n", "g", "u", "a", "g", "e"],
    [""],
    ["t", "h", "a", "t"],
    [""],
    ["i", "s"],
    [""],
    ["e", "a", "s", "y"],
    [""],
    ["t", "o"],
    [""],
    ["l", "e", "a", "r", "n"],
    [""],
    ["a", "n", "d"],
    [""],
    ["u", "s", "e"],
    [""],
    ["f", "o", "r"],
    [""],
    ["d", "e", "v", "e", "l", "o", "p", "i", "n", "g"],
    [""],
    ["m", "o", "b", "i", "l", "e"],
    [""],
    ["a", "n", "d"],
    [""],
    ["w", "e", "b"],
    [""],
    ["a", "p", "p", "s"],
    [""],
    ["o", "f"],
    [""],
    ["a", "n", "y"],
    [""],
    ["k", "i", "n", "d"],
    [""],
    ["T", "h", "e"],
    [""],
    ["s", "y", "n", "t", "a", "x"],
    [""],
    ["i", "s"],
    [""],
    ["s", "i", "m", "p", "l", "e"],
    [""],
    ["a", "n", "d"],
    [""],
    ["c", "l", "e", "a", "r"],
    [""],
    ["w", "h", "i", "l", "e"],
    [""],
    ["s", "u", "p", "p", "o", "r", "t", "s"],
    [""],
    ["o", "o", "l", "s"],
    [""],
    ["l", "i", "k", "e"],
    [""],
    ["E", "c", "l", "i", "p", "s", "e"],
    [""],
    ["o", "r"],
    [""],
    ["I", "N", "T", "E", "L", "L", "I", "J"],
    [""],
    ["m", "a", "k", "e", "s"],
    [""],
    ["d", "e", "v", "e", "l", "o", "p", "m", "e", "n", "t"],
    [""],
    ["e", "a", "s", "y"],
    [""],
    ["a", "n", "d"],
    [""],
    ["e", "f", "f", "i", "c", "i", "e", "n", "t"],
  ]);
  const [started] = useState(false);
  const [charArray, setCharArray] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCorrect, setIsCorrect] = useState(true);
  const [typedText, setTypedText] = useState("");
  const [errorIndexes, setErrorIndexes] = useState<number[]>([]);
  const [pressed, setPressed] = useState(false);
  const [selectedTime, setSelectedTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [keyPressed, setKeyPressed] = useState<string | null>(null);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [upward, setUpward] = useState(0);
  const [openBattleDialog] = useState(false);
  const [battleDetails, setBattleDetails] = useState<BattleDataType>();
  const isPlayer1 = params.address == battleDetails?.player1;
  const [isPlayer2Ready, setIsPlayer2Ready] = useState(false);
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");
  const [battleStarted, setBattleStarted] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [count, setCount] = useState(4);
  const [flattenWordText, setFlattenWordText] = useState<string[]>([]);
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [correctWordCount, setCorrectWordCount] = useState(0);
  const [currentWord, setCurrentWord] = useState(""); // Track the current word being typed
  const [currentWordIndex, setCurrentWordIndex] = useState(0); // Track word index
  const [typedCharactersCount, setTypedCharactersCount] = useState(0); // To track total characters typed
  const [result, setResult] = useState<ResultType>({
    wpm: 0,
    accuracy: 0,
  });

  const handleEndTest = () => {
    if (count == 0) setShowResult(true);
    clearInterval(timerInterval!);
  };

  const startTimer = useCallback(() => {
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
  }, [timerInterval, handleEndTest]);

  useEffect(() => {
    const initialCharArray = finalText.flat().join("").split("");
    setCharArray(initialCharArray);
    setFlattenWordText(flattenWords(finalText));
  }, [finalText]);

  const flattenWords = (text: string[][]): string[] => {
    return text
      .map((chars) => chars.join("")) // Join characters into strings
      .filter((word) => word.trim() !== ""); // Ignore spaces
  };

  const handleWordInput = (inputWord: string, currentWordIndex: number) => {
    setTypedWords((prev) => [...prev, inputWord]);

    if (inputWord === flattenWordText[currentWordIndex]) {
      setCorrectWordCount((prevCount) => prevCount + 1);
    }
  };

  function handleKeyPress(event: KeyboardEvent) {
    if (openBattleDialog) return;
    if (remainingTime === 0) return;
    const pressedKey = event.key;
    setKeyPressed(pressedKey);

    setTimeout(() => setKeyPressed(null), 100);

    if (pressedKey === "Backspace") {
      event.preventDefault();
      setCurrentWord((prev) => prev.slice(0, -1));
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        setTypedText(typedText.slice(0, -1));
        setErrorIndexes(
          errorIndexes.filter((index) => index !== currentIndex - 1)
        );
        setTypedCharactersCount((prevCount) => prevCount - 1);
      }

      return;
    }
    if (pressedKey.length > 1 && pressedKey !== " ") return;

    const expectedChar = charArray[currentIndex];
    const inputChar = pressedKey;

    if (!openBattleDialog) {
      if (pressedKey === " ") {
        handleWordInput(currentWord, currentWordIndex);
        setTypedText((prev) => prev + currentWord + " ");
        setCurrentWord("");
        setCurrentWordIndex((prevIndex) => prevIndex + 1);
      } else {
        setCurrentWord((prev) => prev + pressedKey);
      }

      if (pressedKey === " ") {
        if (expectedChar === " ") {
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
  }

  useEffect(() => {
    if (showResult) {
      if (correctWordCount > 0 && typedWords.length > 0) {
        const wpm = typedCharactersCount / 5 / (selectedTime / 60);
        const correctCharCount = typedCharactersCount - errorIndexes.length;
        const accuracy = Math.round(
          (correctCharCount / typedCharactersCount) * 100
        );
        setResult({ wpm, accuracy });
      } else {
        console.log("No words typed or no correct words");
      }
    }
  }, [showResult]);

  useEffect(() => {
    if (battleStarted) {
      window.addEventListener("keydown", handleKeyPress);
      return () => {
        window.removeEventListener("keydown", handleKeyPress);
      };
    }
  }, [handleKeyPress, battleStarted]);

  useEffect(() => {
    const battleId = searchParams.get("battleId");
    const address = searchParams.get("address");

    if (battleId && address) {
      setParams({ battleId, address });
    } else {
      console.error("Missing battleId or address in URL params");
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData(params.battleId);

      if (data && data.length > 0) {
        setBattleDetails(data[0]);
        setSelectedTime(data[0].typing_time);
        setRemainingTime(data[0].typing_time);
      } else {
        console.error("No battle details found");
      }
    };

    if (params) fetchData();
  }, [params]);

  useEffect(() => {
    const subscription = supabase
      .channel("battle")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "battle" },
        (payload) => {
          if (payload.new.status !== payload.old.status) {
            const newStatus = payload.new.status;
            if (newStatus === "started") {
              setShowTimer(true);
            }
          }

          setBattleDetails((prev) => {
            if (prev) {
              return {
                ...prev,
                player1_result: payload.new.player1_result,
                player2_result: payload.new.player2_result,
              };
            }
            return prev;
          });

          if (payload.new.ready_status) {
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
      if (!showResult) startTimer();
    }
  }, [showTimer, count, battleStarted, showResult]);

  const handleStartReady = async () => {
    if (isPlayer1) {
      if (isPlayer2Ready) {
        await setStatus("started", params.battleId);
      } else {
        setMessage("player2 is not ready yet :(");
      }
    } else {
      if (params) await markReady(params.battleId);
    }
  };

  return (
    <div className="text-white overflow-hidden">
      <div className="w-full flex-between px-10 mt-8 ml-9 py-10">
        <div>
          {!battleStarted && (
            <Button
              onClick={handleStartReady}
              className={`w-[150px] h-[50px] font-bold text-gray-100 text-lg rounded-md bg-[#D7B633] 
                          hover:bg-[#f3cf3f] hover:text-red-500 
                          transition-transform transform uppercase
                          ${
                            isPlayer2Ready &&
                            params.address != battleDetails?.player1
                              ? "text-red-500"
                              : "animate-start"
                          }`}
            >
              {params.address == battleDetails?.player1 ? "Start" : "Ready"}
            </Button>
          )}
        </div>

         <Image
              src="/battle.png" 
              width={50} 
              height={50} 
              alt="logo" 
              />
            
        <div>
          <div className="flex-center gap-2">
            <TooltipDemo
              hoverText={
                <div className="bg-[#073b4c] mr-10 font-semibold flex-center gap-3 font-mono px-4 py-3 rounded-md text-gray-300 hover:text-white text-sm">
                  <span>
                    <Image
                        src="/piggy-bank2.png"
                        alt="piggybank"
                        width={25}
                        height={25}
                        className=""
                      />
                    </span>
                    <span className="mt-1">
                      {battleDetails &&
                      (Number(battleDetails.eth_amount) * 2).toLocaleString("en-US", {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 7,
                      })}{" "}
                    Eth
                    </span>
                </div>
              }
              tooltipText={
                <div className="flex-center gap-1 font-mono">
                  <p>Pool Money</p>
                  <span className="rotate-[90deg] text-green-600">
                    <PiMoneyWavyBold />
                  </span>
                </div>
              }
              hoverClass="cursor-pointer bg-inherit hover:bg-inherit w-full h-full"
              tooltipClass=""
            />
            
          </div>
        </div>
      </div>

      <div className="w-full h-auto">
        <div className="mt-16">
          <div className="flex-center">
            <h1 className="text-4xl">{remainingTime}</h1>
          </div>

          <div className="mt-4">
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

          <div className="bg-[var(--background)] z-10 h-[200px]">
            <VisualKeyboard keyPressed={keyPressed} />
          </div>
        </div>

        <div className="w-[350px] h-[200px] bg-gray-800 rounded-sm absolute bottom-5 right-5">
          <div className="relative w-full h-full flex-center flex-col">
            {battleDetails ? (
              <div className="">
                {isPlayer1 && !isPlayer2Ready && message && (
                  <p className="text-sm w-full text-[#f45050] absolute bottom-[12.5rem] right-[-5px]">
                    {message}
                  </p>
                )}

                {isPlayer1 && isPlayer2Ready && (
                  <Image
                    src="/flag.png"
                    width={28}
                    height={28}
                    alt="checkmark"
                    className="absolute top-[-20px] left-[10px]"
                  />
                )}

                <div className="flex-center flex-col gap-2">
                  <PlayerDetails
                    address={
                      isPlayer1 ? battleDetails.player2 : battleDetails.player1
                    }
                    showActive={true}
                  />
                  <div className="text-center">
                    <p>Player {isPlayer1 ? "2" : "1"}</p>
                    <p className="text-sm text-gray-400">
                      (
                      {isPlayer1
                        ? battleDetails.player2.slice(0, 8)
                        : battleDetails.player1.slice(0, 8)}
                      ...)
                    </p>
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
            {count === 1 ? "Type !!" : count - 1}
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
};

const BattlePageWithSuspense = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BattlePage />
    </Suspense>
  );
};

export default BattlePageWithSuspense;
