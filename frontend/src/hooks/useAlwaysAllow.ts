import { useAccount, useReadContract } from "wagmi";
import AlwaysAllowAbi from "../abi/AlwaysAllow.abi.json";
import { CONTRACT_ADDRESSES } from "../lib/web3/contracts";

export function useAlwaysAllow() {
  const { address: userAddress } = useAccount();

  // Read function - check if address is eligible
  const {
    data: isEligible,
    refetch: refetchIsEligible,
    isLoading: isEligibleLoading,
    error: isEligibleError,
  } = useReadContract({
    address: CONTRACT_ADDRESSES.ALWAYS_ALLOW,
    abi: AlwaysAllowAbi,
    functionName: "isEligible",
    args: userAddress ? [userAddress, "0x"] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });

  // Helper function to check eligibility with custom data
  const checkEligibilityWithData = (_address: `0x${string}`, _data: `0x${string}`) => {
    // Since this is "AlwaysAllow", it should always return true
    // But we can still make the contract call for consistency
    return true;
  };

  return {
    // Read data
    isEligible: isEligible ?? false,

    // Loading states
    isEligibleLoading,

    // Actions
    refetchIsEligible,
    checkEligibilityWithData,

    // Errors
    isEligibleError,

    // User state
    userAddress,
    isConnected: !!userAddress,

    // Contract address for reference
    contractAddress: CONTRACT_ADDRESSES.ALWAYS_ALLOW,
  };
}
