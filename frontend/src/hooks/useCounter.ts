import { useReadContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import CounterAbi from "../abi/Counter.abi.json";
import { CONTRACT_ADDRESSES } from "../lib/web3/contracts";

export function useCounter() {
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

  // Transaction receipts
  const { isLoading: isIncrementConfirming } = useWaitForTransactionReceipt({
    hash: incrementTxHash,
  });

  const { isLoading: isDecrementConfirming } = useWaitForTransactionReceipt({
    hash: decrementTxHash,
  });

  const { isLoading: isSetCountConfirming } = useWaitForTransactionReceipt({
    hash: setCountTxHash,
  });

  const { isLoading: isResetConfirming } = useWaitForTransactionReceipt({
    hash: resetTxHash,
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

  return {
    // Read data
    count: count ?? 0n,
    getCountValue: getCountValue ?? 0n,

    // Loading states
    isCountLoading,
    isGetCountLoading,
    isIncrementPending: isIncrementPending || isIncrementConfirming,
    isDecrementPending: isDecrementPending || isDecrementConfirming,
    isSetCountPending: isSetCountPending || isSetCountConfirming,
    isResetPending: isResetPending || isResetConfirming,

    // Actions
    increment: handleIncrement,
    decrement: handleDecrement,
    setCount: handleSetCount,
    reset: handleReset,
    refetchCount,

    // Errors
    countError,
    getCountError,
    incrementError,
    decrementError,
    setCountError,
    resetError,

    // Transaction hashes
    incrementTxHash,
    decrementTxHash,
    setCountTxHash,
    resetTxHash,
  };
}
