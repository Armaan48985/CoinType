'use client'
import PlayerDetails from '@/components/PlayerDetails'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import React, { useEffect, useRef, useState } from 'react'
import { useAccount } from 'wagmi'
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Chart, ChartDataset } from 'chart.js';
import supabase from '../supabase'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface BattleHistoryItem {
    player1: string;
    player2: string;
    amount: number | string;
    date: string; 
    result: 'Won' | 'Lost';
    wpm: string;
  }

const Page = () => {
    const {address : currentUserAddress} = useAccount()
    const [historyData, setHistoryData] = useState<BattleHistoryItem[]>([]);
    const [currentSpeed, setCurrentSpeed] = useState<string>('');


    const countBattles = (history: BattleHistoryItem[]) => {
        let won = 0;
        let lost = 0;
      
        history.forEach((battle) => {
          if (battle.result === 'Won') {
            won++;
          } else {
            lost++;
          }
        });
      
        return { won, lost };
      };
      
    const { won, lost } = countBattles(historyData);
      
      const options = {
        plugins: {
          legend: {
        display: false, 
          },
          tooltip: {
        callbacks: {
          label: (tooltipItem: { label: string; raw: number }) => {
            const label = tooltipItem.label; 
            const value = tooltipItem.raw;  
            
            if (label === 'Won') {
          return `${label}: ${won} battles`;
            } else if (label === 'Lost') {
          return `${label}: ${lost} battles`;
            }
            return `${label}: ${value}`;
          },
        },
        backgroundColor: '#1f2937', 
        titleColor: '#ffffff',   
        bodyColor: '#ffffff',   
        borderColor: '#6b7280',  
        borderWidth: 1,      
        padding: 8,              
        cornerRadius: 4,  
          },
        },
        elements: {
          arc: {
        borderWidth: 0,
          },
        },
        cutout: '62%',
      };

      const chartRef = useRef<HTMLCanvasElement>(null);
      const chartInstanceRef = useRef<Chart | null>(null); 
      useEffect(() => {
        if (chartRef.current) {
          const ctx = chartRef.current.getContext('2d');
    
          if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
          }
    
          chartInstanceRef.current = new Chart(ctx, {
            type: 'doughnut',
            data: {
              datasets: [
                {
                  data: [currentSpeed, 300 - parseInt(currentSpeed)], 
                  backgroundColor: ['#E8EE3B', '#FFFFFF'], 
                  borderWidth: 0,
                },
              ],
            },
            options: {
              responsive: true,
              circumference: 180, 
              rotation: -90, 
              cutout: '70%', 
              plugins: {
                tooltip: {
                    enabled: true, 
                    callbacks: {
                      label: function () {
                        return 'Average Speed'; 
                      },
                    },
                    backgroundColor: '#1f2937',
                    titleColor: '#ffffff', 
                    bodyColor: '#ffffff', 
                    borderColor: '#6b7280', 
                    borderWidth: 1,
                    padding: 4,
                    cornerRadius: 4,
                    caretSize: 0, 
                    displayColors: false, 
                  },
                legend: {
                  display: false, 
                },
              },
              animation: {
                duration: 1500,
                easing: 'easeOutBounce',
              },
            },
          });
        }
    
        return () => {
          if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
          }
        };
      }, [currentSpeed]);
      
      const data = {
        labels: ['Won', 'Lost'],
        datasets: [
          {
            label: 'Battle Results',
            data: [won, lost], 
            backgroundColor: [
                '#2ACED9', 
                '#E86E56', 
              ],
          },
        ],
      };
    
      const centerTextPlugin = {
        id: 'centerText',
        beforeDraw: (chart: Chart) => {
          const { width, height, ctx, data } = chart;
      
          // Ensure data exists and datasets have the correct structure
          const total = (data.datasets[0] as ChartDataset).data
          .filter((value) => typeof value === 'number') // Ensure we're only working with numbers
          .reduce((sum: number, value: number) => sum + value, 0);
        
      
          ctx.save();
      
          ctx.font = 'bold 24px "JetBrains Mono", monospace';
          ctx.fillStyle = '#fff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${total}`, width / 2, height / 2);
      
          ctx.restore();
        },
      };

      useEffect(() => {
        if(currentUserAddress) fetchUserBattleHistory()
      }, [currentUserAddress])


      const fetchUserBattleHistory = async () => {
        console.log(currentUserAddress)
        try {
          const { data: battles, error } = await supabase
            .from('battle')
            .select('*')
            .or(`player1.eq.${currentUserAddress},player2.eq.${currentUserAddress}`)
      
          if (error) {
            throw error;
          }

          console.log(battles)

          const battleHistory: BattleHistoryItem[] = battles.map((battle) => {
            const isPlayer1 = battle.player1 === currentUserAddress;
            const isWinner = battle.winner === currentUserAddress;
            const result = isWinner ? 'Won' : 'Lost';
  
            const wpm = isPlayer1 ? battle.player1_result : battle.player2_result;
      
            return {
              player1: battle.player1,
              player2: battle.player2,
              amount: battle.eth_amount, 
              date: battle.created_at,
              result,
              wpm: wpm || 0,
            };
          });
          console.log(battleHistory)
          setHistoryData(battleHistory);
          return battleHistory;
        } catch (error) {
          console.error('Error fetching battle history:', error);
          return [];
        }
      };

        const formatDate = (dateString: string): string => {
            const date = new Date(dateString);
            
            // Options to display only day and month
            const options: Intl.DateTimeFormatOptions = {
              day: '2-digit', 
              month: 'short',
            };
            
            // Format the date
            return date.toLocaleDateString('en-GB', options); 
          };

        

          useEffect(() => {
            if (historyData.length > 0) {
                let totalWpm = 0;

                historyData.forEach((battle) => {
                    const wpmValue = parseFloat(battle.wpm);
                    if (!isNaN(wpmValue)) {
                        totalWpm += wpmValue;
                    } else {
                        console.warn(`Invalid WPM value: ${battle.wpm}`);
                    }
                });
        
                const averageWpm = totalWpm / historyData.length;
        
                setCurrentSpeed(averageWpm.toLocaleString('en-US', { maximumFractionDigits: 2 }));
            }
        }, [historyData]);

        if(!historyData) return (
            <div className="w-full h-screen flex items-center justify-center bg-gray-100">
            <div className="relative w-full max-w-md">
                <div className="absolute top-0 left-0 w-full h-1 bg-gray-300">
                <div className="h-full bg-blue-500 animate-progress"></div>
                </div>
                <div className="text-center text-gray-700 mt-4">Loading...</div>
            </div>
            </div>
        )

        if(!currentUserAddress) return (
            <div className="w-full h-screen flex items-center justify-center bg-gray-100">
                <ConnectButton/>
            </div>
        )
        
        
        return (
            <div className='w-full min-h-screen flex justify-center text-white font-mono px-10 gap-4'>
                <div className='flex-center flex-col w-3/4 mt-24'>
                    <h1 className='text-6xl font-bold uppercase'>Battle History</h1>
                    <div className='bg-[#2A334D] rounded-lg mx-10 mt-8 w-full min-h-[550px]'>
                            <div className='flex-between p-4 border-b-2 border-gray-800'>
                                <p className='min-w-16 flex-center'>You</p>
                                <p className='min-w-16 flex-center'>Status</p>
                                <p className='min-w-16 flex-center'>Amount</p>
                                <p className='min-w-16 flex-center'>Player2</p>
                                <p className='min-w-16 flex-center'>When</p>
                            </div>
                        
                            <div className=''>
                                {historyData.length === 0 ? (
                                    <div className="text-center text-gray-500 py-10">
                                    <h2 className="text-2xl font-bold">You have not participated in any battle.</h2>
                                    <p className="mt-2">Join a battle to see your history here!</p>
                                    </div>
                                ) : (
                                    historyData.map((battle, index) => (
                                    <div
                                        key={index}
                                        className={`border-b-2 pb-4 px-4 py-2 hover:scale-[1.009] duration-500 border-gray-800 flex-between ${
                                        battle.result === 'Won'
                                            ? 'bg-[#2ACED9] hover:bg-[#27bcc6]'
                                            : 'bg-[#E86E56] hover:bg-[#d95d45]'
                                        } rounded-sm mx-3 mb-2 mt-3 transition-colors duration-300 cursor-pointer`}
                                    >
                                        <p className="min-w-16">{currentUserAddress?.slice(0, 6)}...</p>
                                        <h2 className="min-w-16 flex-center text-2xl font-bold uppercase">
                                        {battle.result}
                                        </h2>
                                        <p className="min-w-16 flex-center">{battle.amount} eth</p>
                                        <p className="min-w-16 flex-center">
                                        {battle.player1 === currentUserAddress
                                            ? battle.player2?.slice(0, 6)
                                            : battle.player1?.slice(0, 6)}
                                        ...
                                        </p>
                                        <p className="min-w-16 flex-center">{formatDate(battle.date)}</p>
                                    </div>
                                    ))
                                )}
                            </div>
                    </div>
                </div>

                <div className='w-1/4 flex justify-center flex-col mt-20 gap-4'>
                    <div className='flex items-end flex-col mr-6 justify-center'>
                            <span>
                                {currentUserAddress ?  <PlayerDetails
                                    address={currentUserAddress}
                                    showActive={false}
                                /> : <ConnectButton />}
                            </span>
                            <p className='text-sm text-gray-300 mt-2'>{currentUserAddress?.slice(0,6)}...</p>
                    </div>

                    <div className='w-full flex-center flex-col gap-10 bg-[#2A334D] rounded-lg p-10 min-h-[550px]'>
                        <h1 className='text-4xl font-bold uppercase'>Stats</h1>
                        <div>
                            <Doughnut
                                data={data}
                                options={options}
                                plugins={[centerTextPlugin]}
                                width={160}
                                height={160}
                            />
                        </div>

                        <div style={{ position: 'relative', width: '180px', height: '180px' }}>
                            <canvas ref={chartRef}></canvas>
                            <div className="absolute top-[100px] left-[5.5rem] transform -translate-x-1/2 text-[24px] font-bold text-white flex-center flex-col">
                                {currentSpeed} <span className='text-[12px] font-normal uppercase'>wpm</span>
                            </div>
                        </div>                 
                    </div>
                </div>         
            </div>
  )
}

export default Page