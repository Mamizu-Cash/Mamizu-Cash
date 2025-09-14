import { createFileRoute } from "@tanstack/react-router";
import { Building, CheckCircle, FileUp, Mail } from "lucide-react";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useBusinessVerifier } from "../hooks/useBusinessVerifier";
import { generateBusinessVerificationEmailUrl } from "../lib/emailUtils";

export const Route = createFileRoute("/get-unti")({
  component: GetUntiScreen,
});

type Step = "email" | "sent";

function GetUntiScreen() {
  const [currentStep, setCurrentStep] = useState<Step>("email");

  // Wallet integration
  const { isConnected } = useAccount();
  const { isEligible } = useBusinessVerifier();

  const handleEmailSent = () => {
    setCurrentStep("sent");
  };

  const steps = [
    { key: "email", label: "メール送信", icon: Mail },
    { key: "sent", label: "送信完了", icon: CheckCircle },
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => step.key === currentStep);
  };

  return (
    <div
      className="main-container"
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "1rem",
      }}
    >
      <div
        className="main-card"
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "2rem",
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
            <Building size={40} color="white" />
          </div>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#1e293b",
              marginBottom: "0.5rem",
            }}
          >
            UNTI取得
          </h1>
          <p
            style={{
              color: "#64748b",
              fontSize: "1.1rem",
              lineHeight: "1.6",
            }}
          >
            企業向けKYB認証でプライベート送金に参加
          </p>
        </div>

        {/* UNTI Status Check */}
        {isConnected && (
          <div
            style={{
              backgroundColor: isEligible ? "#f0fdf4" : "#fefce8",
              padding: "1rem",
              borderRadius: "8px",
              border: `1px solid ${isEligible ? "#bbf7d0" : "#fef08a"}`,
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            {isEligible ? (
              <div>
                <p style={{ margin: "0 0 0.5rem 0", color: "#166534", fontWeight: "500" }}>
                  ✅ UNTIトークン保有済み
                </p>
                <p style={{ margin: "0", color: "#047857", fontSize: "0.875rem" }}>
                  既に企業認証が完了しています。
                  <a
                    href="/profile"
                    style={{ color: "#047857", textDecoration: "underline", marginLeft: "4px" }}
                  >
                    プロフィールページで確認
                  </a>
                </p>
              </div>
            ) : (
              <div>
                <p style={{ margin: "0 0 0.5rem 0", color: "#ca8a04", fontWeight: "500" }}>
                  ⚠️ UNTI未取得
                </p>
                <p style={{ margin: "0", color: "#a16207", fontSize: "0.875rem" }}>
                  プライベート送金を利用するには企業認証が必要です
                </p>
              </div>
            )}
          </div>
        )}

        {/* Progress Steps */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "3rem",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          {steps.map((step, index) => {
            const currentIndex = getCurrentStepIndex();
            const isActive = step.key === currentStep;
            const isCompleted = index < currentIndex;

            return (
              <div key={step.key} style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "48px",
                      height: "48px",
                      backgroundColor: isCompleted ? "#8b5cf6" : isActive ? "#8b5cf6" : "#e2e8f0",
                      borderRadius: "50%",
                      color: isCompleted || isActive ? "white" : "#64748b",
                    }}
                  >
                    <step.icon size={24} />
                  </div>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      color: isCompleted || isActive ? "#1e293b" : "#64748b",
                      fontWeight: isActive ? "600" : "normal",
                    }}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    style={{
                      width: "30px",
                      height: "2px",
                      backgroundColor: isCompleted ? "#8b5cf6" : "#e2e8f0",
                      marginTop: "-24px",
                      marginLeft: "0.5rem",
                      marginRight: "0.5rem",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Email Verification Step */}
        {currentStep === "email" && (
          <div>
            <div
              style={{
                backgroundColor: "#f3e8ff",
                padding: "1.5rem",
                borderRadius: "12px",
                marginBottom: "2rem",
                border: "1px solid #d8b4fe",
              }}
            >
              <h3
                style={{
                  margin: "0 0 1rem 0",
                  color: "#6b21a8",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                }}
              >
                DKIM認証の手順
              </h3>
              <ol
                style={{
                  margin: 0,
                  paddingLeft: "1.5rem",
                  color: "#6b21a8",
                  fontSize: "0.9rem",
                  lineHeight: "1.6",
                }}
              >
                <li>企業ドメインからメールを送信</li>
                <li>DKIM署名を自動検証</li>
                <li>ドメイン所有権を確認</li>
                <li>UNTI (ERC-6268) トークンを発行</li>
              </ol>
            </div>

            {/* Email Sending Section */}
            <div
              style={{
                backgroundColor: "#eff6ff",
                padding: "1.5rem",
                borderRadius: "12px",
                marginBottom: "2rem",
                border: "1px solid #dbeafe",
              }}
            >
              <h3
                style={{
                  margin: "0 0 1rem 0",
                  color: "#1e40af",
                  fontSize: "1rem",
                  fontWeight: "600",
                }}
              >
                1. 企業メールで認証メールを送信
              </h3>
              <p
                style={{
                  margin: "0 0 1.5rem 0",
                  color: "#1e40af",
                  fontSize: "0.9rem",
                  lineHeight: "1.6",
                }}
              >
                以下のボタンをクリックして、企業ドメインのメールアドレスから認証メールを送信してください。
              </p>

              <a
                href={generateBusinessVerificationEmailUrl()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  width: "100%",
                  padding: "1rem 2rem",
                  backgroundColor: "#3b82f6",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#2563eb";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#3b82f6";
                }}
                onFocus={(e) => {
                  e.currentTarget.style.backgroundColor = "#2563eb";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.backgroundColor = "#3b82f6";
                }}
              >
                <Mail size={20} />
                企業メールで認証メールを送信
              </a>
            </div>

            {/* Verification Section */}
            <div
              style={{
                backgroundColor: "#fef3c7",
                padding: "1.5rem",
                borderRadius: "12px",
                marginBottom: "2rem",
                border: "1px solid #fcd34d",
              }}
            >
              <h3
                style={{
                  margin: "0 0 1rem 0",
                  color: "#92400e",
                  fontSize: "1rem",
                  fontWeight: "600",
                }}
              >
                2. 認証の確認
              </h3>
              <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    backgroundColor: "white",
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    border: "1px solid #fcd34d",
                  }}
                >
                  <Mail size={16} color="#d97706" />
                  <span style={{ color: "#92400e", fontSize: "0.9rem" }}>
                    企業メールからの認証待機中
                  </span>
                </div>
              </div>
              <p
                style={{
                  margin: "0 0 1.5rem 0",
                  color: "#92400e",
                  fontSize: "0.9rem",
                  lineHeight: "1.6",
                  textAlign: "center",
                }}
              >
                メール送信後、下のボタンで認証を確認してください。
              </p>

              <button
                onClick={handleEmailSent}
                style={{
                  width: "100%",
                  padding: "1rem 2rem",
                  backgroundColor: "#8b5cf6",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <Mail size={20} />
                メール送信完了（次へ）
              </button>
            </div>
          </div>
        )}

        {/* Email Sent Step */}
        {currentStep === "sent" && (
          <div style={{ textAlign: "center" }}>
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

            <h2
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: "#1e293b",
                marginBottom: "1rem",
              }}
            >
              メール送信完了！
            </h2>

            <p
              style={{
                color: "#64748b",
                fontSize: "1.1rem",
                lineHeight: "1.6",
                marginBottom: "2rem",
              }}
            >
              企業ドメインから認証メールの送信が完了しました。
            </p>

            <div
              style={{
                backgroundColor: "#eff6ff",
                padding: "1.5rem",
                borderRadius: "12px",
                marginBottom: "2rem",
                border: "1px solid #dbeafe",
                textAlign: "left",
              }}
            >
              <h3
                style={{
                  margin: "0 0 1rem 0",
                  color: "#1e40af",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                }}
              >
                次のステップ
              </h3>
              <div
                style={{
                  fontSize: "0.95rem",
                  color: "#1e40af",
                  lineHeight: "1.6",
                }}
              >
                1. 送信したメールのEMLファイルをダウンロード
                <br />
                2. Attestorページでファイルをアップロード
                <br />
                3. DKIM検証とUNTI発行を完了
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <a
                href="/attestor"
                style={{
                  padding: "1rem 2rem",
                  backgroundColor: "#8b5cf6",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FileUp size={20} />
                Attestorページへ
              </a>
              <a
                href="/"
                style={{
                  padding: "1rem 2rem",
                  backgroundColor: "white",
                  color: "#8b5cf6",
                  textDecoration: "none",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  border: "2px solid #8b5cf6",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                ホームに戻る
              </a>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .main-container {
            padding: 0.5rem !important;
          }
          .main-card {
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
