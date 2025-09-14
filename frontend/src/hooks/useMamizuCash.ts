import { useEffect } from "react";
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import MamizuCashAbi from "../abi/MamizuCash.abi.json";
import { useToastHelpers } from "../components/ui/Toast";
import { CONTRACT_ADDRESSES } from "../lib/web3/contracts";

export function useMamizuCash() {
  const { address: userAddress } = useAccount();
  const { showSuccess, showError } = useToastHelpers();

  // Read functions
  const { data: denominationRaw, isLoading: isDenominationLoading } = useReadContract({
    address: CONTRACT_ADDRESSES.MAMIZU_CASH,
    abi: MamizuCashAbi,
    functionName: "denomination",
  });
  const denomination = denominationRaw as unknown as bigint | undefined;

  const useIsKnownRoot = (root: `0x${string}`) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.MAMIZU_CASH,
      abi: MamizuCashAbi,
      functionName: "isKnownRoot",
      args: [root],
      query: {
        enabled: !!root,
      },
    });
  };

  const useIsSpent = (nullifierHash: `0x${string}`) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.MAMIZU_CASH,
      abi: MamizuCashAbi,
      functionName: "isSpent",
      args: [nullifierHash],
      query: {
        enabled: !!nullifierHash,
      },
    });
  };

  // Write deposit function
  const {
    data: depositTxHash,
    isPending: isDepositPending,
    writeContract: deposit,
    error: depositError,
  } = useWriteContract();

  const { isLoading: isDepositConfirming, isSuccess: isDepositSuccess } =
    useWaitForTransactionReceipt({
      hash: depositTxHash,
    });

  const handleDeposit = (commitment: `0x${string}`) => {
    if (!denomination) {
      showError("Deposit failed", "Denomination value not loaded yet.");
      return;
    }
    deposit({
      address: CONTRACT_ADDRESSES.MAMIZU_CASH,
      abi: MamizuCashAbi,
      functionName: "deposit",
      args: [commitment],
      value: denomination as bigint,
    });
  };

  useEffect(() => {
    if (isDepositSuccess) {
      showSuccess("Deposit successful!", "Your funds have been deposited privately.");
    }
  }, [isDepositSuccess, showSuccess]);

  useEffect(() => {
    if (depositError) {
      showError("Deposit failed", depositError.message);
    }
  }, [depositError, showError]);

  return {
    // Read data
    denomination,
    isDenominationLoading,

    // Read hooks
    useIsKnownRoot,
    useIsSpent,

    // Write functions
    deposit: handleDeposit,
    isDepositPending: isDepositPending || isDepositConfirming,
    isDepositSuccess,
    depositTxHash,
    depositError,

    // General info
    contractAddress: CONTRACT_ADDRESSES.MAMIZU_CASH,
    userAddress,
    isConnected: !!userAddress,
  };
}
