import React from 'react'
import { FaCoins } from 'react-icons/fa'
import WalletConnect from './self/WalletConnect'

const Navbar = ({selectedTime, setSelectedTime, openBattleDialog, setOpenBattleDialog}:{
    selectedTime: number;
    setSelectedTime: React.Dispatch<React.SetStateAction<number>>;
    openBattleDialog: boolean;
    setOpenBattleDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  
  return (
    <div className="p-10 flex-between px-28 mt-10 text-gray-300">
        <h1 className="font-mono text-5xl flex-center gap-2">CoinType <span className='text-3xl mt-2 text-[#ffb700] text-opacity-70'><FaCoins /></span></h1>

        <div className='bg-[var(--primary-blue)] rounded-2xl'>
        <div className='flex gap-8 py-1 px-8 text-sm'>
            <button className={`hover:text-yellow-500 hover:font-semibold ${selectedTime == 15 ? 'text-yellow-500' : ''}`} onClick={() => setSelectedTime(15)}>15s</button>
            <button className={`hover:text-yellow-500 hover:font-semibold ${selectedTime == 30 ? 'text-yellow-500' : ''}`} onClick={() => setSelectedTime(30)}>30s</button>
            <button className={`hover:text-yellow-500 hover:font-semibold ${selectedTime == 60 ? 'text-yellow-500' : ''}`} onClick={() => setSelectedTime(60)}>60s</button>
            <button className={`hover:text-yellow-500 hover:font-semibold ${selectedTime == 120 ? 'text-yellow-500' : ''}`} onClick={() =>setSelectedTime(120)}>120s</button>
        </div>   
        </div>

        <div>

            <div>
                <WalletConnect  
                    openBattleDialog={openBattleDialog}
                    setOpenBattleDialog={setOpenBattleDialog}
                />
            </div>
        </div>
  </div>
  )
}

export default Navbar