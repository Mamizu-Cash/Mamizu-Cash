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

  // Write functions for naive operations
  const {
    data: naiveDepositTxHash,
    isPending: isNaiveDepositPending,
    writeContract: naiveDeposit,
    error: naiveDepositError,
  } = useWriteContract();

  const {
    data: naiveWithdrawTxHash,
    isPending: isNaiveWithdrawPending,
    writeContract: naiveWithdraw,
    error: naiveWithdrawError,
  } = useWriteContract();

  // Write functions for compliant operations
  const {
    data: compliantDepositTxHash,
    isPending: isCompliantDepositPending,
    writeContract: compliantDeposit,
    error: compliantDepositError,
  } = useWriteContract();

  const {
    data: compliantWithdrawTxHash,
    isPending: isCompliantWithdrawPending,
    writeContract: compliantWithdraw,
    error: compliantWithdrawError,
  } = useWriteContract();

  const { isLoading: isNaiveDepositConfirming, isSuccess: isNaiveDepositSuccess } =
    useWaitForTransactionReceipt({
      hash: naiveDepositTxHash,
    });

  const { isLoading: isNaiveWithdrawConfirming, isSuccess: isNaiveWithdrawSuccess } =
    useWaitForTransactionReceipt({
      hash: naiveWithdrawTxHash,
    });

  const { isLoading: isCompliantDepositConfirming, isSuccess: isCompliantDepositSuccess } =
    useWaitForTransactionReceipt({
      hash: compliantDepositTxHash,
    });

  const { isLoading: isCompliantWithdrawConfirming, isSuccess: isCompliantWithdrawSuccess } =
    useWaitForTransactionReceipt({
      hash: compliantWithdrawTxHash,
    });

  const handleNaiveDeposit = (commitment: `0x${string}`) => {
    if (!denomination) {
      showError("Deposit failed", "Denomination value not loaded yet.");
      return;
    }
    naiveDeposit({
      address: CONTRACT_ADDRESSES.MAMIZU_CASH,
      abi: MamizuCashAbi,
      functionName: "naiveDeposit",
      args: [commitment],
      value: denomination as bigint,
    });
  };

  const handleCompliantDeposit = (commitment: `0x${string}`) => {
    if (!denomination) {
      showError("Deposit failed", "Denomination value not loaded yet.");
      return;
    }
    compliantDeposit({
      address: CONTRACT_ADDRESSES.MAMIZU_CASH,
      abi: MamizuCashAbi,
      functionName: "compliantDeposit",
      args: [commitment],
      value: denomination as bigint,
    });
  };

  const handleNaiveWithdraw = (
    proof: `0x${string}`,
    root: `0x${string}`,
    nullifierHash: `0x${string}`,
    recipient: `0x${string}`,
    relayer: `0x${string}`,
    fee: bigint,
  ) => {
    naiveWithdraw({
      address: CONTRACT_ADDRESSES.MAMIZU_CASH,
      abi: MamizuCashAbi,
      functionName: "naiveWithdraw",
      args: [proof, root, nullifierHash, recipient, relayer, fee],
    });
  };

  const handleCompliantWithdraw = (
    proof: `0x${string}`,
    root: `0x${string}`,
    nullifierHash: `0x${string}`,
    recipient: `0x${string}`,
    relayer: `0x${string}`,
    fee: bigint,
  ) => {
    compliantWithdraw({
      address: CONTRACT_ADDRESSES.MAMIZU_CASH,
      abi: MamizuCashAbi,
      functionName: "compliantWithdraw",
      args: [proof, root, nullifierHash, recipient, relayer, fee],
    });
  };

  useEffect(() => {
    if (isNaiveDepositSuccess) {
      showSuccess("Naive deposit successful!", "Your funds have been deposited privately.");
    }
  }, [isNaiveDepositSuccess, showSuccess]);

  useEffect(() => {
    if (isCompliantDepositSuccess) {
      showSuccess(
        "Compliant deposit successful!",
        "Your funds have been deposited with compliance verification.",
      );
    }
  }, [isCompliantDepositSuccess, showSuccess]);

  useEffect(() => {
    if (isNaiveWithdrawSuccess) {
      showSuccess("Naive withdraw successful!", "Your funds have been withdrawn privately.");
    }
  }, [isNaiveWithdrawSuccess, showSuccess]);

  useEffect(() => {
    if (isCompliantWithdrawSuccess) {
      showSuccess(
        "Compliant withdraw successful!",
        "Your funds have been withdrawn with compliance verification.",
      );
    }
  }, [isCompliantWithdrawSuccess, showSuccess]);

  useEffect(() => {
    if (naiveDepositError) {
      showError("Naive deposit failed", naiveDepositError.message);
    }
  }, [naiveDepositError, showError]);

  useEffect(() => {
    if (compliantDepositError) {
      showError("Compliant deposit failed", compliantDepositError.message);
    }
  }, [compliantDepositError, showError]);

  useEffect(() => {
    if (naiveWithdrawError) {
      showError("Naive withdraw failed", naiveWithdrawError.message);
    }
  }, [naiveWithdrawError, showError]);

  useEffect(() => {
    if (compliantWithdrawError) {
      showError("Compliant withdraw failed", compliantWithdrawError.message);
    }
  }, [compliantWithdrawError, showError]);

  return {
    // Read data
    denomination,
    isDenominationLoading,

    // Read hooks
    useIsKnownRoot,
    useIsSpent,

    // Naive functions
    naiveDeposit: handleNaiveDeposit,
    isNaiveDepositPending: isNaiveDepositPending || isNaiveDepositConfirming,
    isNaiveDepositSuccess,
    naiveDepositTxHash,
    naiveDepositError,

    naiveWithdraw: handleNaiveWithdraw,
    isNaiveWithdrawPending: isNaiveWithdrawPending || isNaiveWithdrawConfirming,
    isNaiveWithdrawSuccess,
    naiveWithdrawTxHash,
    naiveWithdrawError,

    // Compliant functions
    compliantDeposit: handleCompliantDeposit,
    isCompliantDepositPending: isCompliantDepositPending || isCompliantDepositConfirming,
    isCompliantDepositSuccess,
    compliantDepositTxHash,
    compliantDepositError,

    compliantWithdraw: handleCompliantWithdraw,
    isCompliantWithdrawPending: isCompliantWithdrawPending || isCompliantWithdrawConfirming,
    isCompliantWithdrawSuccess,
    compliantWithdrawTxHash,
    compliantWithdrawError,

    // Backward compatibility (use naive by default)
    deposit: handleNaiveDeposit,
    isDepositPending: isNaiveDepositPending || isNaiveDepositConfirming,
    isDepositSuccess: isNaiveDepositSuccess,
    depositTxHash: naiveDepositTxHash,
    depositError: naiveDepositError,

    // General info
    contractAddress: CONTRACT_ADDRESSES.MAMIZU_CASH,
    userAddress,
    isConnected: !!userAddress,
  };
}
