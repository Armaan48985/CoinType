'use client'
import { useEffect, useState } from 'react';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { checkInviteCode, sendCode } from '../supbaseFunc';

type BattleDataType = {
    invite_code: string;
    eth_amount: string;
    player1: string;
    started_by: string;
}

export default function StartBattle() {
  const [amount, setAmount] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const {address} = useAccount()
  const [checkCode, setCheckCode] = useState('');
  const [battleData, setBattleData] = useState<BattleDataType>();

  const { sendTransaction, isPending, isSuccess, isError, error, data, submittedAt, } = useSendTransaction();
  useEffect(() => {
    if(isSuccess){
        console.log(data)
        const code = generateInviteCode();
        setInviteCode(code);
        console.log(code)
        if(code && address && amount){
            sendCode({code, address, amount});
        }
    }
  }, [isSuccess, isPending, data])
  
  const generateInviteCode = () => {
    console.log('Generating invite code...');
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };
  const startBattle = async () => {
    if (!amount || isNaN(Number(amount)) || parseFloat(amount) <= 0) {
      console.error('Please enter a valid amount.');
      return;
    }

    try {
      // Send transaction
      const result = await sendTransaction({
        to: '0xb50c2a93683b8dA575cD8f93602f3dB89a27A1e4',
        value: parseEther(amount), // Convert amount to Wei
      });
      
      console.log(isSuccess)
      if (isSuccess) {
        const code = generateInviteCode(); 
        setInviteCode(code); 
        console.log('Transaction successful! Invite Code:', code);
      } else {
        console.error('Transaction failed with status:');
      }
    } catch (err) {
      console.error('Error in startBattle:', error);
    }
  };
  const JoinBattle = async () => {
    if(checkCode){
        console.log('Joining battle with code:', checkCode);

        const data = await checkInviteCode(checkCode);

        if(data) setBattleData(data[0]);
    }
  }

  console.log(battleData)

  return (
   <div className='flex'>
      <div className="bg-gray-800 p-6 rounded-lg shadow-md w-80 mx-auto my-10">
            <h2 className="text-xl font-semibold mb-4 text-center text-white">Start a Battle</h2>
            <input
                type="text"
                placeholder="ETH to pool"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 mb-4 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={startBattle}
                disabled={isPending}
                className={`w-full py-2 px-4 rounded-md font-bold transition-all ${
                isPending ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
            >
                {isPending ? 'Sending...' : 'Start Battle'}
            </button>
        
            {inviteCode && (
                <p className="mt-4 text-green-500 font-semibold text-center">
                Transaction Successful! Invite Code: <span className="font-mono">{inviteCode}</span>
                </p>
            )}
        
            {isError && (
                <p className="mt-4 text-red-500 font-semibold text-center">
                Transaction Failed: {error.message}
                </p>
            )}
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-md w-80 mx-auto my-10">
            <h2 className="text-xl font-semibold mb-4 text-center text-white">Join a Battle</h2>
            <input
                type="text"
                placeholder="Enter Invite Code"
                value={checkCode}
                onChange={(e) => setCheckCode(e.target.value)}
                className="w-full p-3 mb-4 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={JoinBattle}
                disabled={isPending}
                className={`w-full py-2 px-4 rounded-md font-bold transition-all ${
                isPending ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
            >
                {isPending ? 'Sending...' : 'Join Battle'}
            </button>
        
            {battleData && (
                <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md">
                    <p className="text-sm font-bold mb-2">
                        This person is challenging you: <span className="text-blue-400">{battleData.started_by}</span>
                    </p>
                    <p className="text-lg">
                        Amount to submit for battle: <span className="font-semibold text-green-400">{battleData.eth_amount} ETH</span>
                    </p>
                </div>
            )}

            </div>

          
   </div>
  );
  
}
