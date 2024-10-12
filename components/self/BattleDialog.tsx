import Image from 'next/image';
import { useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { FaArrowLeftLong } from "react-icons/fa6";
import { Button } from '../ui/button';
import NetworkButton from './NetworkButton';

const BattleDialog = ({setOpenBattleDialog}:any) => {
  const [step, setStep] = useState('initial');
  const [ethAmount, setEthAmount] = useState('');
  const [time, setTime] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [battleDetails, setBattleDetails] = useState(null); 

  const renderDialogContent = () => {
    switch (step) {
      case 'initial':
        return (
          <div className=''>
            <div className='z-10 flex justify-center'>
              <img src="/swords-unscreen.gif" alt="Swords Clashing" width="80" height="80" className='rotate-180' />
            </div>
            <div className='flex-center gap-10 mt-14 text-white font-bold'>
                <button
                  className="py-2 px-10 rounded-md bg-[#D7B633] border-2 border-transparent hover:scale-105 hover:text-red-500 hover:border-gray-400 box-border duration-500"
                  onClick={() => setStep('startBattle')}
                >
                  Start a Battle
                </button>
                <button
                  className="py-2 px-10 rounded-md bg-[#D7B633] border-2 border-transparent hover:scale-105 hover:text-red-500 hover:border-gray-400 box-border duration-500"
                  onClick={() => setStep('joinBattle')}
                >
                  Join a Battle
                </button>
            </div>

          </div>
        );
      case 'startBattle':
        return (
          <div className='mt-6'>
            <div className="mb-4 flex flex-col gap-4">
              <label className="font-serif text-gray-800 text-sm font-semibold">Time limit 0f battle(sec):</label>
              <div className='flex gap-5 ml-6'>
                <Button className="bg-gray-600 h-8 w-20 p-3 rounded-xl" variant='default' onClick={() => setTime('15')}>15</Button>
                <Button className="bg-gray-600 h-8 w-20 p-3 rounded-xl" variant='default' onClick={() => setTime('30')}>30</Button>
                <Button className="bg-gray-600 h-8 w-20 p-3 rounded-xl" variant='default' onClick={() => setTime('60')}>60</Button>
                <Button className="bg-gray-600 h-8 w-20 p-3 rounded-xl" variant='default' onClick={() => setTime('120')}>120</Button>
              </div>
            </div>
            <div className="my-6 flex-center">
              <label className="font-serif text-gray-800 text-sm font-semibold">Eth Amount:</label>
              <input
                type="text"
                placeholder="Enter ETH amount"
                className="w-[400px] p-2 mt-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                value={ethAmount}
                onChange={(e) => setEthAmount(e.target.value)}
              />
            </div>
             <div className='flex items-center my-6 gap-6'>
               <label className="font-serif text-gray-800 text-sm font-semibold">Choose Network:</label>
               <NetworkButton/>
             </div>
           <div className='flex-center'>
              <button className="bg-gray-700 text-white py-2 px-4 rounded-md"
                onClick={() => console.log('Start battle with time and ETH')}>Confirm</button>
            </div>

          </div>
        );
        
      case 'joinBattle':
        return (
          <>
            <div className="mb-4">
              <label className="text-white block">Invite Code:</label>
              <input
                type="text"
                placeholder="Enter invite code"
                className="w-full p-2 mt-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
              />
            </div>
            <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              onClick={() => console.log('Join battle')}>Join Battle</button>
          </>
        );
      case 'showBattleDetails':
        return (
          <>
            <div className="text-white mb-4">Battle Time: {battleDetails?.time}</div>
            <div className="text-white mb-4">ETH Amount: {battleDetails?.ethAmount}</div>
            <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              onClick={() => console.log('Confirm join battle')}>Confirm Joining Battle</button>
          </>
        );
      default:
        return null;
    }
  };

  const handleBackButton = () => {
    if (step === 'startBattle' || step === 'joinBattle') {
      setStep('initial');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#D4D4D8] relative p-8 rounded-xl shadow-lg font-mono w-[550px]">
        <div className="modal-content h-full">
          {renderDialogContent()}

          {/* Close Button */}
          <button 
            className="absolute top-4 right-4 text-gray-400  p-1 font-mono text-2xl font-bold"
            onClick={() => setOpenBattleDialog(false)}><RiCloseLine />
          </button>

          {/* Back Button */}
          {step !== 'initial' && (
            <button 
              className="absolute top-6 left-6 text-gray-400  p-1 font-mono text-xl font-bold"
              onClick={handleBackButton}><FaArrowLeftLong />
            </button>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default BattleDialog;
