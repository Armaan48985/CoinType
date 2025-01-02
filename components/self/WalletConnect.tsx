import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { RiLogoutBoxRLine } from "react-icons/ri";
import BattleDialog from "../BattleDialog";
import supabase from "@/app/supabase";
import { useAccount} from "wagmi";
import { ethers } from "ethers";import { toast } from "react-toastify";

const WalletConnect = ({
  openBattleDialog,
  setOpenBattleDialog,
}: {
  openBattleDialog: boolean;
  setOpenBattleDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const { address } = useAccount();
  const notify = () =>
    toast("Sent 0.01 SepoliaEth to your account!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark", // Options: "light", "dark", "colored"
    });

  const giveEthtoUser = async () => {
    if (!address) {
      console.error("Recipient address is required.");
      return;
    }
     const provider = new ethers.JsonRpcProvider(
        "https://rpc.walletconnect.com/v1/?chainId=eip155:11155111&projectId=735705f1a66fe187ed955c8f9e16164d"
      );
      const wallet = new ethers.Wallet(
        process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY || '',
        provider
      );
      const tx = await wallet.sendTransaction({
          to: address,
          value: ethers.parseEther('0.01'),
        });

        await tx.wait();
        // alert('Sent 0.01 ETH to your account')
        notify()
  };

  useEffect(() => {
    console.log('im running')
    if(address) requestEth();
  }, [address])

  const requestEth = async () => {
    try {
        const response = await fetch("https://api64.ipify.org?format=json");
        const { ip } = await response.json();

        const { data: existingRequest, error: fetchError } = await supabase
            .from("ip_requests")
            .select("*")
            .eq("ip_address", ip.trim())
            .single();

        const now = new Date();

        if (fetchError && fetchError.code !== "PGRST116") {
            throw new Error("Error fetching IP data.");
        }
        if (!address) {
          console.error("Recipient address is required.");
          return;
        }

        if (existingRequest) {
            const timeDiff = now.getTime() - new Date(existingRequest.last_request).getTime();
            console.log('Now', now, now.getTime())
            console.log('Last Request', new Date(existingRequest.last_request), new Date(existingRequest.last_request).getTime())
            console.log('Diff', timeDiff)

            if (timeDiff > 24 * 60 * 60 * 1000) {
                console.log("giving eth, 24 hours passed");
                const { error: updateError } = await supabase
                    .from("ip_requests")
                    .update({ last_request: now })
                    .eq("ip_address", ip);

                if (updateError) {
                    throw new Error("Error updating request timestamp.");
                }
                giveEthtoUser();
            } else {
                console.log("24 hours not passed yet, not giving eth");
            }
        } else {
            console.log("Inserting new IP record, giving eth to new user");
            const { error: insertError } = await supabase
                .from("ip_requests")
                .insert([{ ip_address: ip, last_request: now }]);

            if (insertError) {
                throw new Error("Error logging new IP request.");
            }
            giveEthtoUser();
        }
    } catch (error) {
        console.error(error);
    }
};

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
                  src="/battle.png"
                  alt="sword"
                  width={15}
                  height={1}
                  className="w-[20px] h-[20px]"
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
                  onClick={() => setOpenBattleDialog(true)  }
                >
                  Start a Battle
                  <Image
                    src="/battle.png"
                    alt="sword"
                    width={15}
                    height={1}
                    className="w-[20px] h-[20px]"
                  />
                </div>
                <button
                  onClick={() => setOpenDialog(!openDialog)}
                  className="bg-[#073b4c] font-mono px-2 py-[11px] rounded-md text-gray-300 hover:text-white"
                >
                  <RiLogoutBoxRLine size={16} />
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
                              alt={chain?.name ?? "Chain icon"}
                              src={chain?.iconUrl}
                              className="w-full h-full"
                              width={5}
                              height={5}
                            />
                          )}
                        </div>
                      )}
                      <span className="text-sm font-semibold">
                        {chain?.name ?? "Switch Network"}
                      </span>
                    </button>

                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="w-full text-left p-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-all text-sm font-semibold"
                    >
                      {account.displayName}
                      {account.displayBalance
                        ? ` (${account.displayBalance})`
                        : ""}
                    </button>
                  </div>
                )}
              </div>
            )}

            {openBattleDialog && (
              <div>
                <BattleDialog setOpenBattleDialog={setOpenBattleDialog} />
              </div>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default WalletConnect;
