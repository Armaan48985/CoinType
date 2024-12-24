import { useEnsAvatar, useEnsName } from 'wagmi';
import blockies from 'ethereum-blockies-base64';
import Image from 'next/image';


interface PlayerDetailsProps {
    address: `0x${string}`;
    showActive: boolean;
  }
  
  const PlayerDetails: React.FC<PlayerDetailsProps> = ({ address, showActive }) => {
    const { data: ensName } = useEnsName({ address });
    const { data: ensAvatar } = useEnsAvatar({ name: ensName || undefined });
  

  // Generate Identicon if ENS avatar is not available
  const identicon = blockies(address ?? '');

  return (
      <div className="relative">
        <Image
          src={ensAvatar || identicon}
          alt="Player Avatar"
          className="w-14 h-14 rounded-full border-2 border-yellow-500"
          width={10}
          height={10}
        />
        {showActive && <span className="absolute bottom-1 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>}
      </div>
  );
};

export default PlayerDetails;
