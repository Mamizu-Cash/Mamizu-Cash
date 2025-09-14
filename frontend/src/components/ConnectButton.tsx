import { useAccount, useChainId, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { KAIGAN_CHAIN_ID } from "../lib/web3/contracts";
import { Button } from "./ui/Button/Button";

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const isWrongNetwork = isConnected && chainId !== KAIGAN_CHAIN_ID;

  const handleSwitchChain = () => {
    switchChain({ chainId: KAIGAN_CHAIN_ID });
  };

  if (isConnected && address) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "14px", color: "#666" }}>
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <Button onClick={() => disconnect()} variant="secondary" size="small">
            Disconnect
          </Button>
        </div>

        {/* Chain status */}
        <div style={{ fontSize: "12px", color: isWrongNetwork ? "#ef4444" : "#10b981" }}>
          {isWrongNetwork ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>❌ Wrong Network (Chain ID: {chainId})</span>
              <Button onClick={handleSwitchChain} variant="primary" size="small">
                Switch to Kaigan
              </Button>
            </div>
          ) : (
            <span>✅ Connected to JSC Kaigan Testnet</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      {connectors.map((connector) => (
        <Button
          key={connector.uid}
          onClick={() => connect({ connector })}
          disabled={isPending}
          variant="primary"
        >
          {isPending ? "Connecting..." : `Connect ${connector.name}`}
        </Button>
      ))}
    </div>
  );
}
