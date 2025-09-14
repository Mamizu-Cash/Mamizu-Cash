import { useAccount, useReadContract } from "wagmi";
import KnownCompanyUntiAbi from "../abi/KnownCompanyUnti.abi.json";
import { CONTRACT_ADDRESSES } from "../lib/web3/contracts";

export function useKnownCompanyUnti() {
  const { address: userAddress } = useAccount();

  // Read function - get token balance for a specific token ID
  const useTokenBalance = (tokenId: bigint) => {
    const {
      data: balance,
      refetch: refetchBalance,
      isLoading: isBalanceLoading,
      error: balanceError,
    } = useReadContract({
      address: CONTRACT_ADDRESSES.KNOWN_COMPANY_UNTI,
      abi: KnownCompanyUntiAbi,
      functionName: "balanceOf",
      args: userAddress && tokenId !== undefined ? [userAddress, tokenId] : undefined,
      query: {
        enabled: !!userAddress && tokenId !== undefined,
      },
    });

    return {
      balance: balance ?? 0n,
      refetchBalance,
      isBalanceLoading,
      balanceError,
    };
  };

  // Read function - check if token ID is locked
  const useTokenLocked = (tokenId: bigint) => {
    const {
      data: isLocked,
      refetch: refetchLocked,
      isLoading: isLockedLoading,
      error: lockedError,
    } = useReadContract({
      address: CONTRACT_ADDRESSES.KNOWN_COMPANY_UNTI,
      abi: KnownCompanyUntiAbi,
      functionName: "locked",
      args: tokenId !== undefined ? [tokenId] : undefined,
      query: {
        enabled: tokenId !== undefined,
      },
    });

    return {
      isLocked: isLocked ?? false,
      refetchLocked,
      isLockedLoading,
      lockedError,
    };
  };

  // Read function - get batch token balances
  const useBatchBalances = (accounts: `0x${string}`[], tokenIds: bigint[]) => {
    const {
      data: balances,
      refetch: refetchBatchBalances,
      isLoading: isBatchBalancesLoading,
      error: batchBalancesError,
    } = useReadContract({
      address: CONTRACT_ADDRESSES.KNOWN_COMPANY_UNTI,
      abi: KnownCompanyUntiAbi,
      functionName: "balanceOfBatch",
      args: accounts.length > 0 && tokenIds.length > 0 ? [accounts, tokenIds] : undefined,
      query: {
        enabled: accounts.length > 0 && tokenIds.length > 0 && accounts.length === tokenIds.length,
      },
    });

    return {
      balances: balances ?? [],
      refetchBatchBalances,
      isBatchBalancesLoading,
      batchBalancesError,
    };
  };

  // Read function - check if batch of tokens are locked
  const useBatchLocked = (tokenIds: bigint[]) => {
    const {
      data: areLocked,
      refetch: refetchBatchLocked,
      isLoading: isBatchLockedLoading,
      error: batchLockedError,
    } = useReadContract({
      address: CONTRACT_ADDRESSES.KNOWN_COMPANY_UNTI,
      abi: KnownCompanyUntiAbi,
      functionName: "lockedBatch",
      args: tokenIds.length > 0 ? [tokenIds] : undefined,
      query: {
        enabled: tokenIds.length > 0,
      },
    });

    return {
      areLocked: areLocked ?? false,
      refetchBatchLocked,
      isBatchLockedLoading,
      batchLockedError,
    };
  };

  // Read function - get token URI
  const useTokenURI = (tokenId: bigint) => {
    const {
      data: uri,
      refetch: refetchURI,
      isLoading: isURILoading,
      error: uriError,
    } = useReadContract({
      address: CONTRACT_ADDRESSES.KNOWN_COMPANY_UNTI,
      abi: KnownCompanyUntiAbi,
      functionName: "uri",
      args: tokenId !== undefined ? [tokenId] : undefined,
      query: {
        enabled: tokenId !== undefined,
      },
    });

    return {
      uri: uri ?? "",
      refetchURI,
      isURILoading,
      uriError,
    };
  };

  // Read function - get owner
  const {
    data: owner,
    refetch: refetchOwner,
    isLoading: isOwnerLoading,
    error: ownerError,
  } = useReadContract({
    address: CONTRACT_ADDRESSES.KNOWN_COMPANY_UNTI,
    abi: KnownCompanyUntiAbi,
    functionName: "owner",
  });

  // Read function - check approval for all
  const useApprovalForAll = (operator: `0x${string}`) => {
    const {
      data: isApprovedForAll,
      refetch: refetchApprovalForAll,
      isLoading: isApprovalForAllLoading,
      error: approvalForAllError,
    } = useReadContract({
      address: CONTRACT_ADDRESSES.KNOWN_COMPANY_UNTI,
      abi: KnownCompanyUntiAbi,
      functionName: "isApprovedForAll",
      args: userAddress && operator ? [userAddress, operator] : undefined,
      query: {
        enabled: !!userAddress && !!operator,
      },
    });

    return {
      isApprovedForAll: isApprovedForAll ?? false,
      refetchApprovalForAll,
      isApprovalForAllLoading,
      approvalForAllError,
    };
  };

  return {
    // Hook functions for specific use cases
    useTokenBalance,
    useTokenLocked,
    useBatchBalances,
    useBatchLocked,
    useTokenURI,
    useApprovalForAll,

    // General contract data
    owner,
    refetchOwner,
    isOwnerLoading,
    ownerError,

    // User state
    userAddress,
    isConnected: !!userAddress,

    // Contract address for reference
    contractAddress: CONTRACT_ADDRESSES.KNOWN_COMPANY_UNTI,
  };
}
