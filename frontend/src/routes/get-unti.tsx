import { createFileRoute } from "@tanstack/react-router";
import { Building, CheckCircle, Mail, Shield } from "lucide-react";
import { useState } from "react";
import {
  type CredentialInfo,
  generateMockHash,
  generateMockTokenId,
  simulateProcessingDelay,
} from "../lib/mockCredentials";

export const Route = createFileRoute("/get-unti")({
  component: GetUntiScreen,
});

type Step = "input" | "email" | "processing" | "success";

function GetUntiScreen() {
  const [currentStep, setCurrentStep] = useState<Step>("input");
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    domain: "",
  });
  const [_isProcessing, setIsProcessing] = useState(false);
  const [credential, setCredential] = useState<CredentialInfo | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName.trim() || !formData.email.trim()) return;

    setCurrentStep("email");
  };

  const handleEmailVerification = async () => {
    setIsProcessing(true);
    setCurrentStep("processing");

    await simulateProcessingDelay(3000);

    const newCredential: CredentialInfo = {
      type: "unti",
      issuedAt: Date.now(),
      transactionHash: generateMockHash(),
      tokenId: generateMockTokenId(),
      userInfo: {
        companyName: formData.companyName,
        email: formData.email,
      },
    };

    setCredential(newCredential);
    setCredential(newCredential);
    setIsProcessing(false);
    setCurrentStep("success");
  };

  const steps = [
    { key: "input", label: "企業情報", icon: Building },
    { key: "email", label: "DKIM認証", icon: Mail },
    { key: "processing", label: "処理中", icon: Shield },
    { key: "success", label: "UNTI発行", icon: CheckCircle },
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => step.key === currentStep);
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
            const isCompleted =
              index < currentIndex || (currentStep === "success" && index <= currentIndex);

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
                会社名 *
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="株式会社サンプル"
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
                  e.target.style.borderColor = "#8b5cf6";
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
                企業ドメインメール *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (e.target.value.includes("@")) {
                    const domain = e.target.value.split("@")[1];
                    setFormData((prev) => ({ ...prev, email: e.target.value, domain }));
                  }
                }}
                placeholder="admin@company.com"
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
                  e.target.style.borderColor = "#8b5cf6";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                }}
              />
            </div>

            {formData.domain && (
              <div
                style={{
                  backgroundColor: "#f3e8ff",
                  padding: "1rem",
                  borderRadius: "8px",
                  marginBottom: "2rem",
                  border: "1px solid #d8b4fe",
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
                  <Shield size={16} color="#8b5cf6" />
                  <span style={{ fontSize: "0.9rem", fontWeight: "500", color: "#6b21a8" }}>
                    検出されたドメイン: {formData.domain}
                  </span>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.85rem",
                    color: "#6b21a8",
                    lineHeight: "1.4",
                  }}
                >
                  DKIM署名の検証でこのドメインの所有権を確認します。
                </p>
              </div>
            )}

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
                <Mail size={16} color="#3b82f6" />
                <span style={{ fontSize: "0.9rem", fontWeight: "500", color: "#1e40af" }}>
                  モックデモ - 実際のDKIM認証は不要
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
                このデモでは実際のDKIM署名の検証は行いません。次のステップで自動的にUNTIが発行されます。
              </p>
            </div>

            <button
              type="submit"
              disabled={!formData.companyName.trim() || !formData.email.trim()}
              style={{
                width: "100%",
                padding: "1rem 2rem",
                backgroundColor:
                  !formData.companyName.trim() || !formData.email.trim() ? "#94a3b8" : "#8b5cf6",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "1.1rem",
                fontWeight: "600",
                cursor:
                  !formData.companyName.trim() || !formData.email.trim()
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              DKIM認証を開始
            </button>
          </form>
        )}

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
                <li>企業ドメイン（{formData.domain}）からメールを送信</li>
                <li>DKIM署名を自動検証</li>
                <li>ドメイン所有権を確認</li>
                <li>UNTI (ERC-6268) トークンを発行</li>
              </ol>
            </div>

            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  backgroundColor: "#fef3c7",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  border: "1px solid #fcd34d",
                }}
              >
                <Mail size={20} color="#d97706" />
                <span style={{ color: "#92400e", fontWeight: "500" }}>
                  {formData.email} からの認証待機中
                </span>
              </div>
            </div>

            <button
              onClick={handleEmailVerification}
              style={{
                width: "100%",
                padding: "1rem 2rem",
                backgroundColor: "#8b5cf6",
                color: "white",
                border: "none",
                borderRadius: "12px",
                fontSize: "1.1rem",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <Shield size={20} />
              認証を実行（モック）
            </button>
          </div>
        )}

        {/* Processing Step */}
        {currentStep === "processing" && (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                border: "4px solid #e2e8f0",
                borderTop: "4px solid #8b5cf6",
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
              DKIM認証処理中...
            </h2>
            <p
              style={{
                color: "#64748b",
                fontSize: "1rem",
                marginBottom: "2rem",
              }}
            >
              企業ドメインの所有権を検証してUNTIを発行しています
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
                • DKIM署名の検証中
                <br />• ドメイン所有権の確認中
                <br />• UNTI (ERC-6268) の生成中
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
              UNTI発行完了！
            </h2>

            <p
              style={{
                color: "#64748b",
                fontSize: "1.1rem",
                lineHeight: "1.6",
                marginBottom: "2rem",
              }}
            >
              企業向けUNTI (ERC-6268) が正常に発行されました
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
                <span style={{ color: "#166534", fontWeight: "500" }}>UNTIトークンID:</span>
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
                <span style={{ color: "#166534", fontWeight: "500" }}>企業名:</span>
                <span style={{ color: "#14532d" }}>{credential.userInfo?.companyName}</span>
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
                <strong>おめでとうございます！</strong> 企業としてMamizu
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
                送金を受け取る
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
      `}</style>
    </div>
  );
}
