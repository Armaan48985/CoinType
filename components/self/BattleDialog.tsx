import Image from 'next/image';
import { useEffect, useState } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { FaArrowLeftLong } from "react-icons/fa6";
import { Button } from '../ui/button';
import NetworkButton from './NetworkButton';
import { Span } from 'next/dist/trace';
import { checkInviteCode, sendCode } from '@/app/ImportantFunc';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { MdContentCopy, MdFileCopy } from 'react-icons/md';
import { Input } from '../ui/input';
import {ethers} from 'ethers';


type BattleDataType = {
  invite_code: string;
  eth_amount: string;
  player1: string;
  started_by: string;
  time: string;
  chain: string;
}

const BattleDialog = ({setOpenBattleDialog}:any) => {
  const [step, setStep] = useState('initial');
  const [ethAmount, setEthAmount] = useState('');
  const [time, setTime] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [enteredInviteCode, setEnteredInviteCode] = useState('');
  const [battleDetails, setBattleDetails] = useState<BattleDataType>(); 
  const [invalid, setInvalid] = useState(false);
  const [inviteCodeError, setInviteCodeError] = useState(false);
  const { sendTransaction,isPending, isSuccess, isError, error, data, submittedAt, } = useSendTransaction();
  const {address, isConnected, chain} = useAccount();
  const [isStartBattleSuccess, setIsStartBattleSuccess] = useState(false);
  const [isJoinBattleSuccess, setIsJoinBattleSuccess] = useState(false);
  

  const startBattle = async () => {
    if (!ethAmount || isNaN(Number(ethAmount)) || parseFloat(ethAmount) <= 0) {
      console.error('Please enter a valid amount.');
      return false;
    }
  
    try {
      const {hash} = await sendTransaction({
          to: '0xb50c2a93683b8dA575cD8f93602f3dB89a27A1e4',
          value: parseEther(ethAmount),
      });
  
      if(hash) return true;;
    } catch (error) {
      console.error('Error in startBattle:', error);
      return false;
    }
  };
  const startBattleConfirm = async () => {
    if (!ethAmount || !time) {
      setInvalid(true);
      return;
    }
  
    try {
      const a : boolean = startBattle();
      if(a){
        console.log('isSueccess:', isSuccess) 
        setIsStartBattleSuccess(true);
      }
    } catch (err) {
      console.error('Error confirming start battle:', err);
    }
  };

  useEffect(() => {
    console.log('isStartBattleSuccess:', isStartBattleSuccess);
    if (isStartBattleSuccess && address && chain) {
      const code = generateInviteCode();
      setInviteCode(code);
      console.log('Generated Invite Code:', code);
      console.log('lskdjfjlksjf')
      sendCode({
        code,
        address,
        amount: ethAmount,
        time,
        chainName: chain?.name,
      });
  
      setStep('confirmedStartBattle');
    }
  }, [isStartBattleSuccess, address]);
  
  
    
  
  const checkInviteCodee = async () => {
    if (!enteredInviteCode.trim() || !address) {
      setInviteCodeError(true);
      return;
    }
  
    try {
      const data = await checkInviteCode(enteredInviteCode, address);
      if (data && data?.length > 0) {
        setInviteCodeError(false);
        setEnteredInviteCode('');
        setBattleDetails(data[0]);
        setStep('joiningDetails');
      } else {
        setInviteCodeError(true);
      }
    } catch (error) {
      console.error('Error checking invite code:', error);
      setInviteCodeError(true);
    }
  };
  

  const confirmJoinBattle = () => {

  }
  
  console.log(battleDetails)

  // useEffect(() => {
  //   if(isSuccess){
  //       console.log(data)
  //       const code = generateInviteCode();
  //       setInviteCode(code);
  //       console.log(code)
        // if(code && address && ethAmount && chain){
        //     sendCode({code, address, amount: ethAmount, chainName: chain.name});
        // }
  //   }
  // }, [isSuccess, isPending, data])
  

  const generateInviteCode = () => {
    console.log('Generating invite code...');
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };


  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText('mf')
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      })
      .catch((err) => console.error('Failed to copy text: ', err));
  };

  const handleBackButton = () => {
    if (step === 'startBattle' || step === 'joinBattle') {
      setStep('initial');
    }
    else if(step == 'joiningDetails'){
      setStep('joinBattle');
    }
  };


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
                  className="py-3 px-10 rounded-md bg-[#D7B633] border-2 border-transparent hover:scale-105 hover:text-red-500 hover:border-yellow-300 hover:font-extrabold box-border duration-500"
                  onClick={() => setStep('startBattle')}
                >
                  Start a Battle
                </button>
                <button
                  className="py-3 px-10 rounded-md bg-[#D7B633] border-2 border-transparent hover:scale-105 hover:text-red-500 hover:border-yellow-300 hover:font-extrabold box-border duration-500"
                  onClick={() => setStep('joinBattle')}
                >
                  Join a Battle
                </button>
            </div>

          </div>
        );
      case 'startBattle':
        return (
          <div className='mt-8'>
            <div className="mb-4 flex flex-col items-center gap-6">
              <label className="text-gray-800 font-semibold relative">
                {invalid && time == '' && <span className='absolute top-[-5px] left-[-8px] text-red-500'>*</span>}
                Time limit 0f battle(sec)
              </label>
              <div className='flex gap-6 ml-6 font-bold'>
                <Button className={`bg-gray-600 h-8 w-[5.35rem] p-3 rounded-xl ${time == '15' ? 'bg-yellow-500 hover:bg-yellow-500 font-bold text-red-500' : ''}`} variant='default' onClick={() => setTime('15')}>15</Button>
                <Button className={`bg-gray-600 h-8 w-[5.35rem] p-3 rounded-xl ${time == '30' ? 'bg-yellow-500 hover:bg-yellow-500 font-bold text-red-500' : ''}`} variant='default' onClick={() => setTime('30')}>30</Button>
                <Button className={`bg-gray-600 h-8 w-[5.35rem] p-3 rounded-xl ${time == '60' ? 'bg-yellow-500 hover:bg-yellow-500 font-bold text-red-500' : ''}`} variant='default' onClick={() => setTime('60')}>60</Button>
                <Button className={`bg-gray-600 h-8 w-[5.35rem] p-3 rounded-xl ${time == '120' ? 'bg-yellow-500 hover:bg-yellow-500 font-bold text-red-500' : ''}`} variant='default' onClick={() => setTime('120')}>120</Button>
              </div>
            </div>
            <div className='flex-center gap-6 mt-10'>
              <div className="flex flex-col mr-8 gap-2">
                <label className="text-gray-800 font-bold relative">
                  {invalid && ethAmount == '' && <span className='absolute top-[-5px] left-[-8px] text-red-500'>*</span>}
                  Eth Amount:
                </label>
                <input
                  type="text"
                  placeholder="Enter ETH amount"
                  className="w-[150px] pl-3 p-2 py-4 placeholder:text-sm text-xl bg-gray-700 outline-none rounded-md text-white"
                  value={ethAmount}
                  onChange={(e) => setEthAmount(e.target.value)}
                />
              </div>

              <div className='w-[2px] bg-yellow-600 h-[100px]'></div>

              <div className='flex flex-col ml-8 gap-2'>
                <label className=" text-gray-800 font-bold">Choose Chain:</label>
                <NetworkButton/>
              </div>
            </div>
           <div className='flex-center mt-10'>
              <button className="w-[430px] uppercase font-semibold bg-[#32435D] text-white py-3 rounded-md hover:bg-[#1D2635] duration-500"
                onClick={startBattleConfirm}>Confirm</button>
            </div>

          </div>
        );
        case 'confirmedStartBattle':
          return (
            <div className='flex flex-col items-center'>
              <div className='flex items-center mt-4 gap-4 text-black'>
                <div className="text-md">Invite Code:</div>
                <div className='bg-[#b5b5ba] rounded-xl py-3 px-24 flex items-center gap-2'>
                  <h1 className='text-2xl font-bold text-red-500'>XBT45Q6</h1>
                </div>
                <button onClick={handleCopy} className='relative'>
                  <MdContentCopy className='text-xl text-gray-600 hover:text-black cursor-pointer' />
                  {copied && (
                    <span className='absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-sm rounded-lg py-1 px-2'>
                      Copied!
                    </span>
                  )}
                </button>
              </div>
                <div className='w-[380px] text-center flex-center mt-8'>
                  <p className='text-sm text-gray-600'>
                    Share this code with ur friend and wait for him to join the battle 
                  </p>
                </div>
            </div>
          );
      case 'joinBattle':
        return (
          <div className='flex flex-col items-center'>
            <div className='flex items-center mt-8 gap-4 text-black'>
                <div className="text-md">Invite Code:</div>
                <div className='bg-[#b5b5ba] rounded-xl py-3 px-12 flex items-center gap-2'>
                  <input
                    value={enteredInviteCode}
                    onChange={(e) => setEnteredInviteCode(e.target.value)} 
                    placeholder="Enter Invite Code" 
                    className='bg-transparent focus:outline-none border-none outline-none text-xl font-bold text-red-500'
                  />  
                </div>
            </div>
                {inviteCodeError && <div className='text-red-500'>Code Invalid</div>}
              <div className='text-center flex-center mt-8'>
              <Button 
                className='py-6 px-16 font-bold text-gray-100 text-lg duration-700 rounded-md bg-[#D7B633] 
                          hover:bg-[#D7B633] hover:scale-105 hover:text-red-500 
                          transition-transform transform'
                onClick={checkInviteCodee}>
                  Join Battle
              </Button>

              </div>
          </div>
        );
      case 'joiningDetails':
        return (
          <div className='text-gray-900 mt-6'>
            <div className='flex-center text-center'>
              <h1 className='text-gray-500'><span className='text-red-500'>0xb50c2a93683b8dA575cD8f93602f3dB89a27A1e4</span> <br/> is challenging you to a battle</h1>
            </div>
            <div className="mb-4 mt-8">Time limit of battle: {battleDetails?.time}</div>
            <div className="mb-4">ETH Amount: {battleDetails?.eth_amount}</div>
            <div className="mb-4">Chain: {battleDetails?.chain}</div>
            <div className='flex-center mt-8'>
                <button className="w-[430px] uppercase font-semibold bg-[#32435D] text-white py-3 rounded-md hover:bg-[#1D2635] duration-500"
                    onClick={confirmJoinBattle}>Confirm
                </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#D4D4D8] relative p-8 rounded-xl shadow-lg font-mono w-[550px]">
        <div className="modal-content h-full">
          {renderDialogContent()}

          {/* Close Button */}
         {step != 'confirmedStartBattle' && (
            <button 
              className="absolute top-4 right-4 text-gray-400  p-1 font-mono text-2xl font-bold"
              onClick={() => {
                setOpenBattleDialog(false)
                setStep('initial')
              }}><RiCloseLine />
            </button>
          )
         }

          {/* Back Button */}
          {step !== 'initial' && step != 'confirmedStartBattle' && (
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
