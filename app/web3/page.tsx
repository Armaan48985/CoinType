'use client'
import { useState } from 'react';
import { useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';

export default function StartBattle() {
  const [amount, setAmount] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  
  // Use the hook
  const { sendTransaction, isPending, isSuccess, isError, error, data, submittedAt } = useSendTransaction();
  const generateInviteCode = () => {
    console.log('Generating invite code...');
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };
  const startBattle = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      console.error('Please enter a valid amount.');
      return;
    }

    try {
      // Send transaction
      const result = await sendTransaction({
        to: '0xb50c2a93683b8dA575cD8f93602f3dB89a27A1e4',
        value: parseEther(amount), // Convert amount to Wei
      });

      console.log('Transaction sent! Hash:', result.hash);
      
      console.log(isSuccess)
      if (isSuccess) {
        const code = generateInviteCode(); 
        setInviteCode(code); 
        console.log('Transaction successful! Invite Code:', code);
      } else {
        console.error('Transaction failed with status:');
      }
    } catch (err) {
      console.error('Error in startBattle:', err.message);
    }
  };

  return (
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
  
      {isSuccess && (
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
  );
  
}
