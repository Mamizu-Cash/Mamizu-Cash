import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  Building,
  CheckCircle,
  Download,
  Shield,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/withdraw")({
  component: WithdrawScreen,
});

type CredentialStatus = "checking" | "valid" | "invalid" | "none";

function WithdrawScreen() {
  const [credentialStatus, setCredentialStatus] = useState<CredentialStatus>("checking");
  const [credentialType, setCredentialType] = useState<"mizuhiki" | "unti" | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Mock URL parameters (in real implementation, would parse from URL fragment)
  const withdrawalInfo = {
    amount: "1 ETH",
    pool: "0xabcdef...",
    note: "0x84f7b5a23d4e6c18...",
  };

  // Mock credential verification
  useEffect(() => {
    const checkCredentials = async () => {
      setCredentialStatus("checking");

      // Simulate credential check delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock result - 70% chance of having valid credentials
      const hasValidCredentials = Math.random() > 0.3;
      const isMizuhiki = Math.random() > 0.5;

      if (hasValidCredentials) {
        setCredentialStatus("valid");
        setCredentialType(isMizuhiki ? "mizuhiki" : "unti");
      } else {
        setCredentialStatus("invalid");
      }
    };

    checkCredentials();
  }, []);

  const handleWithdraw = async () => {
    setIsWithdrawing(true);

    // Mock withdrawal process
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setIsWithdrawing(false);
    setWithdrawSuccess(true);
  };

  if (withdrawSuccess) {
    return <WithdrawSuccessScreen />;
  }

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
              backgroundColor: "#8b5cf6",
              borderRadius: "50%",
              marginBottom: "1rem",
            }}
          >
            <Download size={40} color="white" />
          </div>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#1e293b",
              marginBottom: "0.5rem",
            }}
          >
            Secure Withdrawal
          </h1>
          <p
            style={{
              color: "#64748b",
              fontSize: "1.1rem",
              lineHeight: "1.6",
            }}
          >
            Verify your credentials and withdraw funds privately
          </p>
        </div>

        {/* Withdrawal Information */}
        <div
          style={{
            backgroundColor: "#f8fafc",
            padding: "1.5rem",
            borderRadius: "12px",
            marginBottom: "2rem",
            border: "1px solid #e2e8f0",
          }}
        >
          <h3
            style={{
              margin: "0 0 1rem 0",
              color: "#1e293b",
              fontSize: "1.1rem",
              fontWeight: "600",
            }}
          >
            Withdrawal Details
          </h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ color: "#64748b" }}>Amount:</span>
            <span style={{ fontWeight: "bold", color: "#1e293b" }}>{withdrawalInfo.amount}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ color: "#64748b" }}>Pool:</span>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "0.875rem",
                color: "#6b7280",
              }}
            >
              {withdrawalInfo.pool}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#64748b" }}>Privacy:</span>
            <span
              style={{
                color: "#059669",
                backgroundColor: "#d1fae5",
                padding: "0.25rem 0.75rem",
                borderRadius: "9999px",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              Fully Anonymous
            </span>
          </div>
        </div>

        {/* Credential Verification */}
        <div
          style={{
            backgroundColor:
              credentialStatus === "valid"
                ? "#f0fdf4"
                : credentialStatus === "invalid"
                  ? "#fef2f2"
                  : "#fffbeb",
            padding: "1.5rem",
            borderRadius: "12px",
            marginBottom: "2rem",
            border: `1px solid ${
              credentialStatus === "valid"
                ? "#bbf7d0"
                : credentialStatus === "invalid"
                  ? "#fecaca"
                  : "#fed7aa"
            }`,
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
            {credentialStatus === "checking" && (
              <>
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    border: "2px solid #f59e0b",
                    borderTop: "2px solid transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                <span style={{ fontWeight: "600", color: "#92400e" }}>
                  Verifying Credentials...
                </span>
              </>
            )}
            {credentialStatus === "valid" && (
              <>
                <CheckCircle size={20} color="#059669" />
                <span style={{ fontWeight: "600", color: "#14532d" }}>Credentials Verified</span>
              </>
            )}
            {credentialStatus === "invalid" && (
              <>
                <XCircle size={20} color="#dc2626" />
                <span style={{ fontWeight: "600", color: "#991b1b" }}>Invalid Credentials</span>
              </>
            )}
          </div>

          {credentialStatus === "checking" && (
            <p
              style={{
                margin: 0,
                color: "#a16207",
                fontSize: "0.9rem",
              }}
            >
              Checking for Mizuhiki SBT or UNTI credentials...
            </p>
          )}

          {credentialStatus === "valid" && credentialType && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                {credentialType === "mizuhiki" ? (
                  <User size={16} color="#059669" />
                ) : (
                  <Building size={16} color="#059669" />
                )}
                <span style={{ color: "#166534", fontWeight: "500" }}>
                  {credentialType === "mizuhiki" ? "Mizuhiki Verified SBT" : "UNTI (Corporate KYB)"}
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  color: "#166534",
                  fontSize: "0.9rem",
                }}
              >
                You are authorized to receive this private transfer
              </p>
            </div>
          )}

          {credentialStatus === "invalid" && (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <AlertTriangle size={16} color="#dc2626" />
                <span style={{ color: "#991b1b", fontWeight: "500" }}>
                  No Valid Credentials Found
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  color: "#991b1b",
                  fontSize: "0.9rem",
                }}
              >
                You need either a Mizuhiki Verified SBT or UNTI credential to withdraw these funds.
              </p>
            </div>
          )}
        </div>

        {/* Privacy Notice */}
        <div
          style={{
            backgroundColor: "#eff6ff",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "2rem",
            border: "1px solid #dbeafe",
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
            <Shield size={16} color="#3b82f6" />
            <span style={{ color: "#1e40af", fontWeight: "500" }}>Complete Privacy Guaranteed</span>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "0.9rem",
              color: "#1e40af",
              lineHeight: "1.4",
            }}
          >
            This withdrawal uses zero-knowledge proofs. The sender's identity and transaction
            history remain completely private and unlinkable.
          </p>
        </div>

        {/* Withdraw Button */}
        <button
          onClick={handleWithdraw}
          disabled={credentialStatus !== "valid" || isWithdrawing}
          style={{
            width: "100%",
            padding: "1rem 2rem",
            backgroundColor: credentialStatus !== "valid" || isWithdrawing ? "#94a3b8" : "#8b5cf6",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "1.1rem",
            fontWeight: "600",
            cursor: credentialStatus !== "valid" || isWithdrawing ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            transition: "background-color 0.2s",
          }}
        >
          {isWithdrawing ? (
            <>
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid white",
                  borderTop: "2px solid transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
              Generating ZK Proof...
            </>
          ) : credentialStatus === "valid" ? (
            <>
              <Download size={20} />
              Withdraw {withdrawalInfo.amount}
            </>
          ) : (
            "Credential Verification Required"
          )}
        </button>

        {/* Processing Status */}
        {isWithdrawing && (
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              backgroundColor: "#fffbeb",
              borderRadius: "8px",
              border: "1px solid #fed7aa",
            }}
          >
            <p
              style={{
                margin: "0 0 0.5rem 0",
                fontSize: "0.9rem",
                color: "#92400e",
                fontWeight: "500",
              }}
            >
              Processing secure withdrawal...
            </p>
            <div
              style={{
                fontSize: "0.8rem",
                color: "#a16207",
                lineHeight: "1.4",
              }}
            >
              • Generating zero-knowledge proof
              <br />• Verifying nullifier uniqueness
              <br />• Submitting anonymous transaction
            </div>
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

function WithdrawSuccessScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "3rem",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100px",
            height: "100px",
            backgroundColor: "#10b981",
            borderRadius: "50%",
            marginBottom: "2rem",
          }}
        >
          <CheckCircle size={60} color="white" />
        </div>

        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            color: "#1e293b",
            marginBottom: "1rem",
          }}
        >
          Withdrawal Complete
        </h1>

        <p
          style={{
            color: "#64748b",
            fontSize: "1.2rem",
            lineHeight: "1.6",
            marginBottom: "2rem",
          }}
        >
          Your funds have been successfully withdrawn with complete privacy
        </p>

        <div
          style={{
            backgroundColor: "#f0fdf4",
            padding: "1.5rem",
            borderRadius: "12px",
            marginBottom: "2rem",
            border: "1px solid #bbf7d0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ color: "#166534" }}>Amount Received:</span>
            <span style={{ fontWeight: "bold", color: "#14532d" }}>1 ETH</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#166534" }}>Transaction Hash:</span>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "0.875rem",
                color: "#059669",
              }}
            >
              0x742d3...a8f1c
            </span>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#eff6ff",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "2rem",
            border: "1px solid #dbeafe",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.9rem",
              color: "#1e40af",
              lineHeight: "1.5",
            }}
          >
            <strong>Privacy Protected:</strong> The source of these funds is completely anonymous
            and unlinkable on the blockchain. Your transaction maintains full privacy compliance.
          </p>
        </div>

        <button
          onClick={() => {
            window.location.href = "/";
          }}
          style={{
            width: "100%",
            padding: "1rem 2rem",
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "1.1rem",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Start New Transaction
        </button>
      </div>
    </div>
  );
}
