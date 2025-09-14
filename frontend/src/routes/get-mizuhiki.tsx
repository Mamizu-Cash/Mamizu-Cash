import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle, FileText, Shield, User } from "lucide-react";
import { useState } from "react";
import {
  type CredentialInfo,
  generateMockHash,
  generateMockTokenId,
  simulateProcessingDelay,
} from "../lib/mockCredentials";

export const Route = createFileRoute("/get-mizuhiki")({
  component: GetMizuhikiScreen,
});

type Step = "input" | "processing" | "success";

function GetMizuhikiScreen() {
  const [currentStep, setCurrentStep] = useState<Step>("input");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [_isProcessing, setIsProcessing] = useState(false);
  const [credential, setCredential] = useState<CredentialInfo | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    setIsProcessing(true);
    setCurrentStep("processing");

    await simulateProcessingDelay(2000);

    const newCredential: CredentialInfo = {
      type: "mizuhiki",
      issuedAt: Date.now(),
      transactionHash: generateMockHash(),
      tokenId: generateMockTokenId(),
      userInfo: {
        name: formData.name,
        email: formData.email,
      },
    };

    setCredential(newCredential);
    setCredential(newCredential);
    setIsProcessing(false);
    setCurrentStep("success");
  };

  const steps = [
    { key: "input", label: "情報入力", icon: User },
    { key: "processing", label: "本人確認", icon: Shield },
    { key: "success", label: "SBT発行", icon: CheckCircle },
  ];

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
            <User size={40} color="white" />
          </div>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#1e293b",
              marginBottom: "0.5rem",
            }}
          >
            Mizuhiki SBT取得
          </h1>
          <p
            style={{
              color: "#64748b",
              fontSize: "1.1rem",
              lineHeight: "1.6",
            }}
          >
            個人向けKYC認証でプライベート送金に参加
          </p>
        </div>

        {/* Progress Steps */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "3rem",
            gap: "1rem",
          }}
        >
          {steps.map((step, index) => {
            const isActive = step.key === currentStep;
            const isCompleted =
              (step.key === "input" && ["processing", "success"].includes(currentStep)) ||
              (step.key === "processing" && currentStep === "success") ||
              (step.key === "success" && currentStep === "success");

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
                      backgroundColor: isCompleted ? "#10b981" : isActive ? "#3b82f6" : "#e2e8f0",
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
                      width: "40px",
                      height: "2px",
                      backgroundColor: isCompleted ? "#10b981" : "#e2e8f0",
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

        {/* Input Step */}
        {currentStep === "input" && (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "2rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#1e293b",
                  marginBottom: "0.5rem",
                }}
              >
                お名前 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="山田 太郎"
                required
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "2px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3b82f6";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                }}
              />
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#1e293b",
                  marginBottom: "0.5rem",
                }}
              >
                メールアドレス *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="yamada@example.com"
                required
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  border: "2px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#3b82f6";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                }}
              />
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                <FileText size={16} color="#3b82f6" />
                <span style={{ fontSize: "0.9rem", fontWeight: "500", color: "#1e40af" }}>
                  モックデモ - 実際の書類提出は不要
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.85rem",
                  color: "#1e40af",
                  lineHeight: "1.4",
                }}
              >
                このデモでは実際の本人確認書類の提出は必要ありません。フォーム送信後、自動的にSBTが発行されます。
              </p>
            </div>

            <button
              type="submit"
              disabled={!formData.name.trim() || !formData.email.trim()}
              style={{
                width: "100%",
                padding: "1rem 2rem",
                backgroundColor:
                  !formData.name.trim() || !formData.email.trim() ? "#94a3b8" : "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "1.1rem",
                fontWeight: "600",
                cursor: !formData.name.trim() || !formData.email.trim() ? "not-allowed" : "pointer",
              }}
            >
              本人確認を開始
            </button>
          </form>
        )}

        {/* Processing Step */}
        {currentStep === "processing" && (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                border: "4px solid #e2e8f0",
                borderTop: "4px solid #3b82f6",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "2rem auto",
              }}
            />
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#1e293b",
                marginBottom: "1rem",
              }}
            >
              本人確認処理中...
            </h2>
            <p
              style={{
                color: "#64748b",
                fontSize: "1rem",
                marginBottom: "2rem",
              }}
            >
              情報を検証してSBTを発行しています
            </p>

            <div
              style={{
                backgroundColor: "#fffbeb",
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid #fed7aa",
                textAlign: "left",
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
                処理中...
              </p>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#a16207",
                  lineHeight: "1.4",
                }}
              >
                • 提出情報の検証中
                <br />• Mizuhiki SBTの生成中
                <br />• ブロックチェーンへの記録中
              </div>
            </div>
          </div>
        )}

        {/* Success Step */}
        {currentStep === "success" && credential && (
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
              SBT発行完了！
            </h2>

            <p
              style={{
                color: "#64748b",
                fontSize: "1.1rem",
                lineHeight: "1.6",
                marginBottom: "2rem",
              }}
            >
              Mizuhiki Verified SBTが正常に発行されました
            </p>

            <div
              style={{
                backgroundColor: "#f0fdf4",
                padding: "1.5rem",
                borderRadius: "12px",
                marginBottom: "2rem",
                border: "1px solid #bbf7d0",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.75rem",
                }}
              >
                <span style={{ color: "#166534", fontWeight: "500" }}>SBTトークンID:</span>
                <span style={{ fontFamily: "monospace", color: "#14532d" }}>
                  {credential.tokenId}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.75rem",
                }}
              >
                <span style={{ color: "#166534", fontWeight: "500" }}>トランザクション:</span>
                <span style={{ fontFamily: "monospace", fontSize: "0.875rem", color: "#059669" }}>
                  {credential.transactionHash?.slice(0, 10)}...
                  {credential.transactionHash?.slice(-8)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "#166534", fontWeight: "500" }}>発行日時:</span>
                <span style={{ color: "#14532d" }}>
                  {new Date(credential.issuedAt).toLocaleString("ja-JP")}
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
                <strong>おめでとうございます！</strong> これでMamizu
                Cashのプライベート送金機能を利用できます。
              </p>
            </div>

            <div
              style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}
            >
              <a
                href="/withdraw"
                style={{
                  padding: "1rem 2rem",
                  backgroundColor: "#3b82f6",
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
                送金を受け取る
              </a>
              <a
                href="/"
                style={{
                  padding: "1rem 2rem",
                  backgroundColor: "white",
                  color: "#3b82f6",
                  textDecoration: "none",
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  border: "2px solid #3b82f6",
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
      `}</style>
    </div>
  );
}
