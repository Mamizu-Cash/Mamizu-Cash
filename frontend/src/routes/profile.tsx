import { createFileRoute } from "@tanstack/react-router";
import { Copy, ExternalLink, Shield, User } from "lucide-react";
import { useAccount } from "wagmi";
import { SBTStatus } from "../components/SBTStatus";
import { useMizuhikiSBT } from "../hooks/useMizuhikiSBT";
import { CONTRACT_ADDRESSES, KAIGAN_EXPLORER_URL } from "../lib/web3/contracts";

export const Route = createFileRoute("/profile")({
  component: ProfileScreen,
});

function ProfileScreen() {
  const { address: userAddress, isConnected } = useAccount();
  const { hasSBT, sbtBalance, isLoading } = useMizuhikiSBT();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // TODO: Add toast notification
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

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

        {/* SBT Status */}
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
            Mizuhiki Verified SBT
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

          {!hasSBT && (
            <div
              style={{
                marginTop: "1.5rem",
                padding: "1rem",
                backgroundColor: "#fef3c7",
                border: "1px solid #f59e0b",
                borderRadius: "8px",
              }}
            >
              <p
                style={{
                  margin: "0 0 0.5rem 0",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#92400e",
                }}
              >
                SBTを保有していません
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  color: "#a16207",
                  lineHeight: "1.4",
                }}
              >
                Mamizu Cashのプライベート送金機能を利用するにはMizuhiki Verified SBTが必要です。
                <br />
                <a
                  href="/get-mizuhiki"
                  style={{
                    color: "#a16207",
                    textDecoration: "underline",
                    fontWeight: "500",
                  }}
                >
                  こちらからSBTを取得してください
                </a>
              </p>
            </div>
          )}

          {hasSBT && (
            <div
              style={{
                marginTop: "1.5rem",
                padding: "1rem",
                backgroundColor: "#d1fae5",
                border: "1px solid #10b981",
                borderRadius: "8px",
              }}
            >
              <p
                style={{
                  margin: "0 0 0.5rem 0",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#065f46",
                }}
              >
                認証済みユーザー
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  color: "#047857",
                  lineHeight: "1.4",
                }}
              >
                Mizuhiki Verified SBTを保有しています。プライベート送金機能をご利用いただけます。
              </p>
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

            {!hasSBT && (
              <a
                href="/get-mizuhiki"
                style={{
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#10b981",
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
                SBTを取得する
              </a>
            )}

            {hasSBT && (
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
          </div>
        </div>
      </div>
    </div>
  );
}
