import { useAccount, useBalance, useSwitchChain, useDisconnect } from "wagmi";
import { arbitrum } from "wagmi/chains";

export function useWalletBridge() {
  const { address, isConnected, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const { disconnect } = useDisconnect();

  const { data: balanceData, refetch: refetchBalance } = useBalance({
    address,
  });

  const isWrongChain = isConnected && chain?.id !== arbitrum.id;

  const switchToArbitrum = () => {
    switchChain({ chainId: arbitrum.id });
  };

  return {
    address,
    isConnected,
    chain,
    balance: balanceData?.value,
    formattedBalance: balanceData?.formatted,
    isWrongChain,
    switchToArbitrum,
    refetchBalance,
    disconnect,
  };
}
