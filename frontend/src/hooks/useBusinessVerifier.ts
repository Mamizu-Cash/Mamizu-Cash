import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import BusinessVerifierAbi from "../abi/BusinessVerifier.abi.json";
import { CONTRACT_ADDRESSES } from "../lib/web3/contracts";

export function useBusinessVerifier() {
  const { address: userAddress } = useAccount();

  // Read functions
  const {
    data: isEligible,
    refetch: refetchIsEligible,
    isLoading: isEligibleLoading,
    error: isEligibleError,
  } = useReadContract({
    address: CONTRACT_ADDRESSES.BUSINESS_VERIFIER,
    abi: BusinessVerifierAbi,
    functionName: "isEligible",
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });

  const {
    data: tokenAddress,
    isLoading: isTokenLoading,
    error: tokenError,
  } = useReadContract({
    address: CONTRACT_ADDRESSES.BUSINESS_VERIFIER,
    abi: BusinessVerifierAbi,
    functionName: "token",
  });

  const {
    data: verifierAddress,
    isLoading: isVerifierLoading,
    error: verifierError,
  } = useReadContract({
    address: CONTRACT_ADDRESSES.BUSINESS_VERIFIER,
    abi: BusinessVerifierAbi,
    functionName: "verifier",
  });

  const {
    data: owner,
    isLoading: isOwnerLoading,
    error: ownerError,
  } = useReadContract({
    address: CONTRACT_ADDRESSES.BUSINESS_VERIFIER,
    abi: BusinessVerifierAbi,
    functionName: "owner",
  });

  const {
    data: computedTokenId,
    refetch: refetchComputedTokenId,
    isLoading: isComputeTokenIdLoading,
    error: computeTokenIdError,
  } = useReadContract({
    address: CONTRACT_ADDRESSES.BUSINESS_VERIFIER,
    abi: BusinessVerifierAbi,
    functionName: "computeTokenId",
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });

  // Write functions
  const {
    writeContract: stamp,
    isPending: isStampPending,
    data: stampTxHash,
    error: stampError,
  } = useWriteContract();

  const {
    writeContract: stampWithData,
    isPending: isStampWithDataPending,
    data: stampWithDataTxHash,
    error: stampWithDataError,
  } = useWriteContract();

  // Transaction receipts
  const { isLoading: isStampConfirming } = useWaitForTransactionReceipt({
    hash: stampTxHash,
  });

  const { isLoading: isStampWithDataConfirming } = useWaitForTransactionReceipt({
    hash: stampWithDataTxHash,
  });

  // Helper functions
  const handleStamp = () => {
    stamp({
      address: CONTRACT_ADDRESSES.BUSINESS_VERIFIER,
      abi: BusinessVerifierAbi,
      functionName: "stamp",
    });
  };

  const handleStampWithData = (data: `0x${string}`) => {
    stampWithData({
      address: CONTRACT_ADDRESSES.BUSINESS_VERIFIER,
      abi: BusinessVerifierAbi,
      functionName: "stamp",
      args: [data],
    });
  };

  const checkEligibilityWithData = async (_data: `0x${string}`) => {
    if (!userAddress) return false;

    // This would need to be implemented as a separate read call
    // For now, we'll use the basic isEligible check
    return isEligible;
  };

  return {
    // Read data
    isEligible: isEligible ?? false,
    tokenAddress,
    verifierAddress,
    owner,
    computedTokenId,

    // Loading states
    isEligibleLoading,
    isTokenLoading,
    isVerifierLoading,
    isOwnerLoading,
    isComputeTokenIdLoading,
    isStampPending: isStampPending || isStampConfirming,
    isStampWithDataPending: isStampWithDataPending || isStampWithDataConfirming,

    // Actions
    stamp: handleStamp,
    stampWithData: handleStampWithData,
    checkEligibilityWithData,
    refetchIsEligible,
    refetchComputedTokenId,

    // Errors
    isEligibleError,
    tokenError,
    verifierError,
    ownerError,
    computeTokenIdError,
    stampError,
    stampWithDataError,

    // Transaction hashes
    stampTxHash,
    stampWithDataTxHash,

    // User state
    userAddress,
    isConnected: !!userAddress,
  };
}
