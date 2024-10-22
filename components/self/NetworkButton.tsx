import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import { MdKeyboardArrowDown } from 'react-icons/md';

export default function NetworkButton() {
  return (
    <ConnectButton.Custom>
      {({
        chain,
        openChainModal,  // To open the network modal
        mounted,
      }) => {
        const ready = mounted && chain;

        return (
          <>
            {ready ? (
              <button
                onClick={openChainModal}
                className="bg-gray-700 text-white py-4 px-4 rounded-md flex"
                style={{ cursor: 'pointer' }}
              >
                {chain.hasIcon && (
                  <div
                    style={{
                      background: chain.iconBackground,
                      width: 24,
                      height: 24,
                      borderRadius: 999,
                      overflow: 'hidden',
                      marginRight: 8,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <Image
                      alt={chain.name ?? 'Chain icon'}
                      src={chain.iconUrl || ''}
                      style={{ width: 24, height: 24 }}
                      width={24}
                      height={24}
                    />
                  </div>
                )}
                {chain.name}

                <span className='text-xl'><MdKeyboardArrowDown /></span>
              </button>
            ) : (
              <button className="bg-gray-700 text-white py-2 px-4 rounded-md">
                No Network
              </button>
            )}
          </>
        );
      }}
    </ConnectButton.Custom>
  );
}
