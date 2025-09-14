import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Building, Lock, Shield } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/deposit")({
  component: DepositScreen,
});

const DENOMINATIONS = [
  { value: "0.1", label: "0.1 ETH", usd: "$400" },
  { value: "1", label: "1 ETH", usd: "$4,000" },
  { value: "10", label: "10 ETH", usd: "$40,000" },
  { value: "100", label: "100 ETH", usd: "$400,000" },
];

function DepositScreen() {
  const [selectedAmount, setSelectedAmount] = useState("1");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeposit = () => {
    setIsProcessing(true);
    // Mock processing delay
    setTimeout(() => {
      setIsProcessing(false);
      // Navigate to URL generation
    }, 2000);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "2rem",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "3rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "80px",
              height: "80px",
              backgroundColor: "#3b82f6",
              borderRadius: "50%",
              marginBottom: "1rem",
            }}
          >
            <Shield size={40} color="white" />
          </div>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#1e293b",
              marginBottom: "0.5rem",
            }}
          >
            Private Deposit
          </h1>
          <p
            style={{
              color: "#64748b",
              fontSize: "1.1rem",
              lineHeight: "1.6",
            }}
          >
            Deposit funds into the shield pool for completely private transactions
          </p>
        </div>

        {/* Privacy Features */}
        <div
          style={{
            backgroundColor: "#eff6ff",
            padding: "1.5rem",
            borderRadius: "12px",
            marginBottom: "2rem",
            border: "1px solid #dbeafe",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1rem",
            }}
          >
            <Lock size={20} color="#3b82f6" />
            <span style={{ fontWeight: "600", color: "#1e293b" }}>Enterprise-Grade Privacy</span>
          </div>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              color: "#475569",
            }}
          >
            <li style={{ marginBottom: "0.5rem" }}>✓ Zero-knowledge proof technology</li>
            <li style={{ marginBottom: "0.5rem" }}>✓ KYC/KYB compliant transactions only</li>
            <li style={{ marginBottom: "0.5rem" }}>✓ Complete transaction unlinkability</li>
            <li>✓ Auditable by authorized parties</li>
          </ul>
        </div>

        {/* Amount Selection */}
        <div style={{ marginBottom: "2rem" }}>
          <label
            style={{
              display: "block",
              fontSize: "1.1rem",
              fontWeight: "600",
              color: "#1e293b",
              marginBottom: "1rem",
            }}
          >
            Select Deposit Amount
          </label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1rem",
            }}
          >
            {DENOMINATIONS.map((denom) => (
              <button
                key={denom.value}
                onClick={() => setSelectedAmount(denom.value)}
                style={{
                  padding: "1rem",
                  border:
                    selectedAmount === denom.value ? "2px solid #3b82f6" : "2px solid #e2e8f0",
                  borderRadius: "12px",
                  backgroundColor: selectedAmount === denom.value ? "#eff6ff" : "white",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    color: "#1e293b",
                    marginBottom: "0.25rem",
                  }}
                >
                  {denom.label}
                </div>
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "#64748b",
                  }}
                >
                  ≈ {denom.usd}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Trust Signals */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
            marginBottom: "2rem",
            padding: "1rem",
            backgroundColor: "#f8fafc",
            borderRadius: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Building size={16} color="#10b981" />
            <span style={{ fontSize: "0.9rem", color: "#374151" }}>Enterprise Ready</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Shield size={16} color="#10b981" />
            <span style={{ fontSize: "0.9rem", color: "#374151" }}>Auditable</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Lock size={16} color="#10b981" />
            <span style={{ fontSize: "0.9rem", color: "#374151" }}>ZK Verified</span>
          </div>
        </div>

        {/* Deposit Button */}
        <button
          onClick={handleDeposit}
          disabled={isProcessing}
          style={{
            width: "100%",
            padding: "1rem 2rem",
            backgroundColor: isProcessing ? "#94a3b8" : "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "1.1rem",
            fontWeight: "600",
            cursor: isProcessing ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            transition: "background-color 0.2s",
          }}
        >
          {isProcessing ? (
            "Processing Deposit..."
          ) : (
            <>
              Deposit {selectedAmount} ETH
              <ArrowRight size={20} />
            </>
          )}
        </button>

        {/* Progress Indicator */}
        {isProcessing && (
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              backgroundColor: "#fffbeb",
              borderRadius: "8px",
              border: "1px solid #fed7aa",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.5rem",
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid #f59e0b",
                  borderTop: "2px solid transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
              <span style={{ color: "#92400e", fontWeight: "500" }}>
                Creating secure deposit...
              </span>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "0.9rem",
                color: "#a16207",
              }}
            >
              Generating commitment and nullifier on-chain
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
