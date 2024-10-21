import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import BattleDialog from './BattleDialog';

const WalletConnect = ({
  openBattleDialog,
  setOpenBattleDialog,
}: {
  openBattleDialog: boolean;
  setOpenBattleDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [openDialog, setOpenDialog] = useState(false);

  
  return (
    <ConnectButton.Custom>
      {({
          account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
    }) => {
        const isConnected = account && chain;
        const isWrongNetwork = chain?.unsupported;

        useEffect(() => {
            if (!isConnected) {
              setOpenDialog(false);
            }
          }, [isConnected]);

        return (
          <div className="relative flex items-center">
            {!isConnected ? (
              <button
                onClick={openConnectModal}
                type="button"
                className="bg-[#073b4c] flex-center gap-2 font-mono px-6 py-2 rounded-md text-white"
              >
               Start a Battle 
                  <Image 
                    src='/battle.png' 
                    alt='sword' 
                    width={15} 
                    height={1}
                    className='w-[20px] h-[20px]'
                  />
              </button>
            ) : isWrongNetwork ? (
              <button
                onClick={openChainModal}
                type="button"
                className="bg-red-500 font-mono px-6 py-2 rounded-md text-white"
              >
                Wrong Network
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div 
                  className="bg-[#073b4c] flex-center gap-2 font-mono px-4 py-2 rounded-md text-white hover:scale-105 duration-500 cursor-pointer" 
                  onClick={() => setOpenBattleDialog(true)}
                >
                  Start a Battle 
                  <Image 
                    src='/battle.png' 
                    alt='sword' 
                    width={15} 
                    height={1}
                    className='w-[20px] h-[20px]'
                  />
                </div>
                <button
                  onClick={() => setOpenDialog(!openDialog)}
                  className="bg-[#073b4c] font-mono px-2 py-[11px] rounded-md text-gray-300 hover:text-white"
                >
                  <RiLogoutBoxRLine size={16}/>
                </button>

                {isConnected && openDialog && (
                    <div className="absolute top-[50px] right-0 bg-gray-800 text-white p-4 rounded-md shadow-xl w-[240px]">
                        <button
                        onClick={openChainModal}
                        className="flex items-center mb-4 p-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-all"
                        type="button"
                        >
                        {chain?.hasIcon && (
                            <div
                            className="w-[24px] h-[24px] rounded-full overflow-hidden mr-3 border border-gray-600"
                            style={{ backgroundColor: chain.iconBackground }}
                            >
                            {chain?.iconUrl && (
                                <Image
                                alt={chain?.name ?? 'Chain icon'}
                                src={chain?.iconUrl}
                                className="w-full h-full"
                                />
                            )}
                            </div>
                        )}
                        <span className="text-sm font-semibold">{chain?.name ?? 'Switch Network'}</span>
                        </button>

                        <button
                            onClick={openAccountModal}
                            type="button"
                            className="w-full text-left p-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-all text-sm font-semibold"
                            >
                              {account.displayName}
                                {account.displayBalance
                                ? ` (${account.displayBalance})`
                                : ''}
                        </button>
                    </div>
                )}

              </div>
            )}

            {openBattleDialog && (
                <div>
                  <BattleDialog setOpenBattleDialog={setOpenBattleDialog}/>
                </div>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default WalletConnect;
