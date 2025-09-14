import { useEffect, useState } from "react";
import { useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import CounterAbi from "../abi/Counter.abi.json";
import { useToastHelpers } from "../components/ui/Toast";
import { CONTRACT_ADDRESSES } from "../lib/web3/contracts";

export function useCounter() {
  const { showSuccess, showError } = useToastHelpers();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Read functions
  const {
    data: count,
    refetch: refetchCount,
    isLoading: isCountLoading,
    error: countError,
  } = useReadContract({
    address: CONTRACT_ADDRESSES.COUNTER,
    abi: CounterAbi,
    functionName: "count",
  });

  const {
    data: getCountValue,
    isLoading: isGetCountLoading,
    error: getCountError,
  } = useReadContract({
    address: CONTRACT_ADDRESSES.COUNTER,
    abi: CounterAbi,
    functionName: "getCount",
  });

  // Write functions
  const {
    writeContract: increment,
    isPending: isIncrementPending,
    data: incrementTxHash,
    error: incrementError,
  } = useWriteContract();

  const {
    writeContract: decrement,
    isPending: isDecrementPending,
    data: decrementTxHash,
    error: decrementError,
  } = useWriteContract();

  const {
    writeContract: setCount,
    isPending: isSetCountPending,
    data: setCountTxHash,
    error: setCountError,
  } = useWriteContract();

  const {
    writeContract: reset,
    isPending: isResetPending,
    data: resetTxHash,
    error: resetError,
  } = useWriteContract();

  const {
    writeContract: mizuhikiIncrement,
    isPending: isMizuhikiIncrementPending,
    data: mizuhikiIncrementTxHash,
    error: mizuhikiIncrementError,
  } = useWriteContract();

  // Transaction receipts
  const { isLoading: isIncrementConfirming, isSuccess: isIncrementSuccess } =
    useWaitForTransactionReceipt({
      hash: incrementTxHash,
    });

  const { isLoading: isDecrementConfirming, isSuccess: isDecrementSuccess } =
    useWaitForTransactionReceipt({
      hash: decrementTxHash,
    });

  const { isLoading: isSetCountConfirming, isSuccess: isSetCountSuccess } =
    useWaitForTransactionReceipt({
      hash: setCountTxHash,
    });

  const { isLoading: isResetConfirming, isSuccess: isResetSuccess } = useWaitForTransactionReceipt({
    hash: resetTxHash,
  });

  const { isLoading: isMizuhikiIncrementConfirming, isSuccess: isMizuhikiIncrementSuccess } =
    useWaitForTransactionReceipt({
      hash: mizuhikiIncrementTxHash,
    });

  // Helper functions
  const handleIncrement = () => {
    increment({
      address: CONTRACT_ADDRESSES.COUNTER,
      abi: CounterAbi,
      functionName: "increment",
    });
  };

  const handleDecrement = () => {
    decrement({
      address: CONTRACT_ADDRESSES.COUNTER,
      abi: CounterAbi,
      functionName: "decrement",
    });
  };

  const handleSetCount = (newCount: bigint) => {
    setCount({
      address: CONTRACT_ADDRESSES.COUNTER,
      abi: CounterAbi,
      functionName: "setCount",
      args: [newCount],
    });
  };

  const handleReset = () => {
    reset({
      address: CONTRACT_ADDRESSES.COUNTER,
      abi: CounterAbi,
      functionName: "reset",
    });
  };

  const handleMizuhikiIncrement = () => {
    mizuhikiIncrement({
      address: CONTRACT_ADDRESSES.COUNTER,
      abi: CounterAbi,
      functionName: "mizuhikiIncrement",
    });
  };

  // Effect for handling transaction success
  useEffect(() => {
    if (isIncrementSuccess) {
      setIsRefreshing(true);
      refetchCount().finally(() => {
        setIsRefreshing(false);
        showSuccess("Success!", "Counter incremented successfully");
      });
    }
  }, [isIncrementSuccess, refetchCount, showSuccess]);

  useEffect(() => {
    if (isDecrementSuccess) {
      setIsRefreshing(true);
      refetchCount().finally(() => {
        setIsRefreshing(false);
        showSuccess("Success!", "Counter decremented successfully");
      });
    }
  }, [isDecrementSuccess, refetchCount, showSuccess]);

  useEffect(() => {
    if (isSetCountSuccess) {
      setIsRefreshing(true);
      refetchCount().finally(() => {
        setIsRefreshing(false);
        showSuccess("Success!", "Counter value set successfully");
      });
    }
  }, [isSetCountSuccess, refetchCount, showSuccess]);

  useEffect(() => {
    if (isResetSuccess) {
      setIsRefreshing(true);
      refetchCount().finally(() => {
        setIsRefreshing(false);
        showSuccess("Success!", "Counter reset successfully");
      });
    }
  }, [isResetSuccess, refetchCount, showSuccess]);

  useEffect(() => {
    if (isMizuhikiIncrementSuccess) {
      setIsRefreshing(true);
      refetchCount().finally(() => {
        setIsRefreshing(false);
        showSuccess("Success!", "Mizuhiki increment completed successfully");
      });
    }
  }, [isMizuhikiIncrementSuccess, refetchCount, showSuccess]);

  // Effect for handling transaction errors
  useEffect(() => {
    if (incrementError) {
      showError("Transaction Failed", incrementError.message);
    }
  }, [incrementError, showError]);

  useEffect(() => {
    if (decrementError) {
      showError("Transaction Failed", decrementError.message);
    }
  }, [decrementError, showError]);

  useEffect(() => {
    if (setCountError) {
      showError("Transaction Failed", setCountError.message);
    }
  }, [setCountError, showError]);

  useEffect(() => {
    if (resetError) {
      showError("Transaction Failed", resetError.message);
    }
  }, [resetError, showError]);

  useEffect(() => {
    if (mizuhikiIncrementError) {
      showError("Mizuhiki Increment Failed", mizuhikiIncrementError.message);
    }
  }, [mizuhikiIncrementError, showError]);

  return {
    // Read data
    count,
    getCountValue,

    // Loading states
    isCountLoading: isCountLoading || isRefreshing,
    isGetCountLoading,
    isIncrementPending: isIncrementPending || isIncrementConfirming,
    isDecrementPending: isDecrementPending || isDecrementConfirming,
    isSetCountPending: isSetCountPending || isSetCountConfirming,
    isResetPending: isResetPending || isResetConfirming,
    isMizuhikiIncrementPending: isMizuhikiIncrementPending || isMizuhikiIncrementConfirming,

    // Actions
    increment: handleIncrement,
    decrement: handleDecrement,
    setCount: handleSetCount,
    reset: handleReset,
    mizuhikiIncrement: handleMizuhikiIncrement,
    refetchCount,

    // Errors
    countError,
    getCountError,
  };
}
