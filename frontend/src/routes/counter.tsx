import { createFileRoute } from "@tanstack/react-router";
import { useAccount } from "wagmi";
import { ConnectButton } from "../components/ConnectButton";
import { Button } from "../components/ui/Button/Button";
import { useCounter } from "../hooks/useCounter";
import { CONTRACT_ADDRESSES } from "../lib/web3/contracts";
import styles from "./counter.module.css";

export const Route = createFileRoute("/counter")({
  component: CounterPage,
});

function CounterPage() {
  const { isConnected } = useAccount();
  const {
    count,
    increment,
    decrement,
    setCount,
    reset,
    isIncrementPending,
    isDecrementPending,
    isSetCountPending,
    isResetPending,
    incrementTxHash,
    decrementTxHash,
    setCountTxHash,
    resetTxHash,
    incrementError,
    decrementError,
    setCountError,
    resetError,
    refetchCount,
  } = useCounter();

  const handleSetCount = () => {
    const newValue = prompt("Enter new count value:");
    if (newValue !== null) {
      const value = BigInt(newValue);
      setCount(value);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Counter Contract</h1>
        <p className={styles.description}>
          Interact with the Counter smart contract on Kaigan Chain
        </p>

        {/* Wallet Connection */}
        <div className={styles.connectSection}>
          <h3 className={styles.connectTitle}>Wallet Connection</h3>
          <ConnectButton />
        </div>

        {/* Counter Interface */}
        {isConnected ? (
          <div className={styles.counterSection}>
            <div className={styles.counterValue}>{count.toString()}</div>

            <div className={styles.buttonGroup}>
              <Button onClick={increment} disabled={isIncrementPending} variant="primary">
                {isIncrementPending ? "Incrementing..." : "Increment"}
              </Button>

              <Button onClick={decrement} disabled={isDecrementPending} variant="secondary">
                {isDecrementPending ? "Decrementing..." : "Decrement"}
              </Button>

              <Button onClick={handleSetCount} disabled={isSetCountPending} variant="secondary">
                {isSetCountPending ? "Setting..." : "Set Count"}
              </Button>

              <Button onClick={reset} disabled={isResetPending} variant="danger">
                {isResetPending ? "Resetting..." : "Reset"}
              </Button>

              <Button onClick={() => refetchCount()} variant="secondary">
                Refresh
              </Button>
            </div>

            {/* Transaction Status */}
            <div className={styles.statusSection}>
              {isIncrementPending && (
                <div className={`${styles.status} ${styles.loading}`}>
                  <span>⏳</span>
                  <span>Increment transaction pending...</span>
                </div>
              )}

              {isDecrementPending && (
                <div className={`${styles.status} ${styles.loading}`}>
                  <span>⏳</span>
                  <span>Decrement transaction pending...</span>
                </div>
              )}

              {isSetCountPending && (
                <div className={`${styles.status} ${styles.loading}`}>
                  <span>⏳</span>
                  <span>Set count transaction pending...</span>
                </div>
              )}

              {isResetPending && (
                <div className={`${styles.status} ${styles.loading}`}>
                  <span>⏳</span>
                  <span>Reset transaction pending...</span>
                </div>
              )}

              {incrementTxHash && !isIncrementPending && (
                <div className={`${styles.status} ${styles.success}`}>
                  <span>✅</span>
                  <span>Increment successful!</span>
                  <div className={styles.txHash}>Tx: {incrementTxHash}</div>
                </div>
              )}

              {decrementTxHash && !isDecrementPending && (
                <div className={`${styles.status} ${styles.success}`}>
                  <span>✅</span>
                  <span>Decrement successful!</span>
                  <div className={styles.txHash}>Tx: {decrementTxHash}</div>
                </div>
              )}

              {setCountTxHash && !isSetCountPending && (
                <div className={`${styles.status} ${styles.success}`}>
                  <span>✅</span>
                  <span>Set count successful!</span>
                  <div className={styles.txHash}>Tx: {setCountTxHash}</div>
                </div>
              )}

              {resetTxHash && !isResetPending && (
                <div className={`${styles.status} ${styles.success}`}>
                  <span>✅</span>
                  <span>Reset successful!</span>
                  <div className={styles.txHash}>Tx: {resetTxHash}</div>
                </div>
              )}

              {incrementError && (
                <div className={`${styles.status} ${styles.error}`}>
                  <span>❌</span>
                  <span>Increment failed: {incrementError.message}</span>
                </div>
              )}

              {decrementError && (
                <div className={`${styles.status} ${styles.error}`}>
                  <span>❌</span>
                  <span>Decrement failed: {decrementError.message}</span>
                </div>
              )}

              {setCountError && (
                <div className={`${styles.status} ${styles.error}`}>
                  <span>❌</span>
                  <span>Set count failed: {setCountError.message}</span>
                </div>
              )}

              {resetError && (
                <div className={`${styles.status} ${styles.error}`}>
                  <span>❌</span>
                  <span>Reset failed: {resetError.message}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", color: "#6b7280" }}>
            Please connect your wallet to interact with the contract
          </div>
        )}

        {/* Contract Info */}
        <div className={styles.contractInfo}>
          <div className={styles.contractTitle}>Contract Information</div>
          <div className={styles.contractAddress}>Address: {CONTRACT_ADDRESSES.COUNTER}</div>
          <div className={styles.contractAddress}>Chain: JSC Kaigan Testnet (ID: 5278000)</div>
        </div>
      </div>
    </div>
  );
}
