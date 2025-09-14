"use client";

import { useAccount } from "wagmi";
import { appKit } from "../lib/web3/wagmi-config";

export function ConnectButton() {
  const { address, isConnected } = useAccount();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <button
      onClick={() => appKit.open()}
      style={{
        padding: "0 8px",
        fontWeight: "bold",
        backgroundColor: isConnected ? "#3b82f6" : "#f8fafc",
        color: isConnected ? "white" : "#3b82f6",
        border: isConnected ? "none" : "2px solid #3b82f6",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "0.875rem",
        transition: "all 0.2s ease",
        height: "32px",
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
      }}
      onMouseEnter={(e) => {
        const target = e.target as HTMLButtonElement;
        if (isConnected) {
          target.style.backgroundColor = "#2563eb";
        } else {
          target.style.backgroundColor = "#3b82f6";
          target.style.color = "white";
        }
      }}
      onMouseLeave={(e) => {
        const target = e.target as HTMLButtonElement;
        if (isConnected) {
          target.style.backgroundColor = "#3b82f6";
        } else {
          target.style.backgroundColor = "#f8fafc";
          target.style.color = "#3b82f6";
        }
      }}
    >
      {isConnected && address ? formatAddress(address) : "ウォレット接続"}
    </button>
  );
}
