import { createFileRoute } from "@tanstack/react-router";
import { Building, CheckCircle, Copy, ExternalLink, Shield, User, XCircle } from "lucide-react";
import { useAccount } from "wagmi";
import { SBTStatus } from "../components/SBTStatus";
import { useBusinessVerifier } from "../hooks/useBusinessVerifier";
import { useMizuhikiSBT } from "../hooks/useMizuhikiSBT";
import { CONTRACT_ADDRESSES, KAIGAN_EXPLORER_URL } from "../lib/web3/contracts";

export const Route = createFileRoute("/profile")({
  component: ProfileScreen,
});

function ProfileScreen() {
  const { address: userAddress, isConnected } = useAccount();
  const { hasSBT, sbtBalance, isLoading } = useMizuhikiSBT();
  const { isEligible: hasUNTI } = useBusinessVerifier();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // TODO: Add toast notification
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Determine verification status
  const isFullyVerified = hasSBT && hasUNTI;
  const hasAnyVerification = hasSBT || hasUNTI;

  if (!isConnected) {
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
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "3rem",
            textAlign: "center",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", color: "#1e293b", marginBottom: "1rem" }}>
            ウォレット未接続
          </h1>
          <p style={{ color: "#64748b" }}>プロフィールを表示するにはウォレットを接続してください</p>
        </div>
      </div>
    );
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
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "2rem",
            marginBottom: "2rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "60px",
                height: "60px",
                backgroundColor: "#3b82f6",
                borderRadius: "50%",
              }}
            >
              <User size={30} color="white" />
            </div>
            <div>
              <h1
                style={{
                  fontSize: "1.75rem",
                  fontWeight: "bold",
                  color: "#1e293b",
                  margin: "0 0 0.5rem 0",
                }}
              >
                プロフィール
              </h1>
              <p style={{ color: "#64748b", margin: 0 }}>アカウント情報とMizuhiki SBT状態</p>
            </div>
          </div>
        </div>

        {/* Wallet Info */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "2rem",
            marginBottom: "2rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "#1e293b",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <User size={20} />
            ウォレット情報
          </h2>

          <div style={{ marginBottom: "1rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "0.5rem",
              }}
            >
              ウォレットアドレス
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1rem",
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            >
              <span style={{ fontFamily: "monospace", fontSize: "0.875rem" }}>{userAddress}</span>
              <button
                onClick={() => userAddress && copyToClipboard(userAddress)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#6b7280",
                  padding: "0.25rem",
                }}
                title="コピー"
              >
                <Copy size={16} />
              </button>
              <a
                href={`${KAIGAN_EXPLORER_URL}/address/${userAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#6b7280",
                  padding: "0.25rem",
                  textDecoration: "none",
                }}
                title="エクスプローラーで見る"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Verification Status Overview */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "2rem",
            marginBottom: "2rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "#1e293b",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Shield size={20} />
            認証状態
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            {/* Mizuhiki SBT Badge */}
            <div
              style={{
                padding: "1.5rem",
                backgroundColor: hasSBT ? "#f0fdf4" : "#f8fafc",
                border: `2px solid ${hasSBT ? "#10b981" : "#e2e8f0"}`,
                borderRadius: "12px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "48px",
                  height: "48px",
                  backgroundColor: hasSBT ? "#10b981" : "#94a3b8",
                  borderRadius: "50%",
                  marginBottom: "1rem",
                }}
              >
                {hasSBT ? (
                  <CheckCircle size={24} color="white" />
                ) : (
                  <User size={24} color="white" />
                )}
              </div>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: hasSBT ? "#065f46" : "#64748b",
                  marginBottom: "0.5rem",
                }}
              >
                個人認証 (SBT)
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: hasSBT ? "#047857" : "#64748b",
                  margin: "0 0 1rem 0",
                }}
              >
                {hasSBT ? "認証済み" : "未認証"}
              </p>
              {!hasSBT && (
                <a
                  href="/get-mizuhiki"
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "6px",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    display: "inline-block",
                  }}
                >
                  取得する
                </a>
              )}
            </div>

            {/* UNTI Badge */}
            <div
              style={{
                padding: "1.5rem",
                backgroundColor: hasUNTI ? "#f0fdf4" : "#f8fafc",
                border: `2px solid ${hasUNTI ? "#10b981" : "#e2e8f0"}`,
                borderRadius: "12px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "48px",
                  height: "48px",
                  backgroundColor: hasUNTI ? "#10b981" : "#94a3b8",
                  borderRadius: "50%",
                  marginBottom: "1rem",
                }}
              >
                {hasUNTI ? (
                  <CheckCircle size={24} color="white" />
                ) : (
                  <Building size={24} color="white" />
                )}
              </div>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: hasUNTI ? "#065f46" : "#64748b",
                  marginBottom: "0.5rem",
                }}
              >
                企業認証 (UNTI)
              </h3>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: hasUNTI ? "#047857" : "#64748b",
                  margin: "0 0 1rem 0",
                }}
              >
                {hasUNTI ? "認証済み" : "未認証"}
              </p>
              {!hasUNTI && (
                <a
                  href="/get-unti"
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#8b5cf6",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "6px",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    display: "inline-block",
                  }}
                >
                  取得する
                </a>
              )}
            </div>
          </div>

          {/* Overall Status Message */}
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              backgroundColor: isFullyVerified
                ? "#f0fdf4"
                : hasAnyVerification
                  ? "#fef3c7"
                  : "#fef2f2",
              border: `1px solid ${isFullyVerified ? "#10b981" : hasAnyVerification ? "#f59e0b" : "#ef4444"}`,
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                marginBottom: "0.5rem",
              }}
            >
              {isFullyVerified ? (
                <CheckCircle size={18} color="#10b981" />
              ) : hasAnyVerification ? (
                <Shield size={18} color="#f59e0b" />
              ) : (
                <XCircle size={18} color="#ef4444" />
              )}
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: isFullyVerified ? "#065f46" : hasAnyVerification ? "#92400e" : "#dc2626",
                }}
              >
                {isFullyVerified ? "完全認証済み" : hasAnyVerification ? "部分認証済み" : "未認証"}
              </span>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "0.8rem",
                color: isFullyVerified ? "#047857" : hasAnyVerification ? "#a16207" : "#dc2626",
                lineHeight: "1.4",
              }}
            >
              {isFullyVerified
                ? "すべての認証が完了しています。すべての機能をご利用いただけます。"
                : hasAnyVerification
                  ? "一部の認証が完了しています。すべての機能を利用するには両方の認証が必要です。"
                  : "プライベート送金機能を利用するには認証が必要です。"}
            </p>
          </div>
        </div>

        {/* Detailed SBT Information */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "2rem",
            marginBottom: "2rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "#1e293b",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <User size={20} />
            Mizuhiki SBT 詳細
          </h2>

          <div style={{ marginBottom: "1.5rem" }}>
            <SBTStatus />
          </div>

          {isLoading ? (
            <div style={{ color: "#64748b", fontSize: "0.875rem" }}>SBT情報を読み込み中...</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "0.5rem",
                  }}
                >
                  SBT保有数
                </label>
                <div
                  style={{
                    padding: "0.75rem 1rem",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                  }}
                >
                  {sbtBalance?.toString() ?? "0"}
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "0.5rem",
                  }}
                >
                  SBTコントラクト
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.75rem 1rem",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                >
                  <span style={{ fontFamily: "monospace", fontSize: "0.875rem" }}>
                    {formatAddress(CONTRACT_ADDRESSES.MIZUHIKI_SBT)}
                  </span>
                  <button
                    onClick={() => copyToClipboard(CONTRACT_ADDRESSES.MIZUHIKI_SBT)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#6b7280",
                      padding: "0.25rem",
                    }}
                    title="コピー"
                  >
                    <Copy size={14} />
                  </button>
                  <a
                    href={`${KAIGAN_EXPLORER_URL}/address/${CONTRACT_ADDRESSES.MIZUHIKI_SBT}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#6b7280",
                      padding: "0.25rem",
                      textDecoration: "none",
                    }}
                    title="エクスプローラーで見る"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "2rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "#1e293b",
              marginBottom: "1.5rem",
            }}
          >
            アクション
          </h2>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <a
              href="/"
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#3b82f6",
                color: "white",
                textDecoration: "none",
                borderRadius: "8px",
                fontSize: "0.875rem",
                fontWeight: "500",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              ホームに戻る
            </a>

            {/* Authentication Actions */}
            {!hasSBT && (
              <a
                href="/get-mizuhiki"
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <User size={16} />
                個人認証を取得
              </a>
            )}

            {!hasUNTI && (
              <a
                href="/get-unti"
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#8b5cf6",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Building size={16} />
                企業認証を取得
              </a>
            )}

            {/* Service Actions - Only available with verification */}
            {hasAnyVerification && (
              <>
                <a
                  href="/deposit"
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#059669",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  プライベート送金
                </a>

                <a
                  href="/withdraw"
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#dc2626",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  資金引き出し
                </a>
              </>
            )}

            {/* Message when no verification */}
            {!hasAnyVerification && (
              <div
                style={{
                  padding: "0.75rem 1rem",
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "8px",
                  fontSize: "0.875rem",
                  color: "#dc2626",
                  fontStyle: "italic",
                }}
              >
                認証後に送金機能が利用可能になります
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
