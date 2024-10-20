import { useAccount, useEnsAvatar, useEnsName } from 'wagmi';
import blockies from 'ethereum-blockies-base64';


interface PlayerDetailsProps {
    address: `0x${string}`;
  }
  
  const PlayerDetails: React.FC<PlayerDetailsProps> = ({ address }) => {
    const { data: ensName } = useEnsName({ address });
    const { data: ensAvatar } = useEnsAvatar({ name: ensName || undefined });
  

  // Generate Identicon if ENS avatar is not available
  const identicon = blockies(address ?? '');

  return (
    <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-lg flex items-center space-x-4">
      {/* Avatar */}
      <div className="relative">
        <img
          src={ensAvatar || identicon}
          alt="Player Avatar"
          className="w-12 h-12 rounded-full border-2 border-yellow-500"
        />
        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
      </div>

      {/* Player Info */}
      <div>
        <p className="text-white font-semibold">{ensName || 'Player'}</p>
        <p className="text-sm text-gray-300">Ready for battle</p>
      </div>
    </div>
  );
};

export default PlayerDetails;
