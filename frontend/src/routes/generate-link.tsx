import { createFileRoute } from "@tanstack/react-router";
import { Check, Copy, FileText, Link2, Mail, QrCode, Share2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/generate-link")({
  component: GenerateLinkScreen,
});

function GenerateLinkScreen() {
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock withdrawal URL
  const MOCK_URL =
    "https://mamizu.cash/withdraw#eyJub3RlIjoiMHg4NGY3YjVhMjNkNGU2YzE4IiwicG9vbCI6IjB4YWJjZGVmIn0";

  const generateUrl = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedUrl(MOCK_URL);
      setIsGenerating(false);
    }, 1500);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    {
      icon: Mail,
      label: "Email",
      action: () => window.open(`mailto:?body=${encodeURIComponent(generatedUrl)}`),
    },
    {
      icon: FileText,
      label: "Invoice",
      action: () => console.log("Add to invoice"),
    },
    {
      icon: Share2,
      label: "Share",
      action: () => navigator.share?.({ url: generatedUrl }),
    },
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
              backgroundColor: "#10b981",
              borderRadius: "50%",
              marginBottom: "1rem",
            }}
          >
            <Link2 size={40} color="white" />
          </div>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#1e293b",
              marginBottom: "0.5rem",
            }}
          >
            Share Withdrawal Link
          </h1>
          <p
            style={{
              color: "#64748b",
              fontSize: "1.1rem",
              lineHeight: "1.6",
            }}
          >
            Generate a secure link for the recipient to withdraw funds privately
          </p>
        </div>

        {/* Deposit Summary */}
        <div
          style={{
            backgroundColor: "#f0fdf4",
            padding: "1.5rem",
            borderRadius: "12px",
            marginBottom: "2rem",
            border: "1px solid #bbf7d0",
          }}
        >
          <h3
            style={{
              margin: "0 0 1rem 0",
              color: "#14532d",
              fontSize: "1.1rem",
              fontWeight: "600",
            }}
          >
            Deposit Successful
          </h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#166534" }}>Amount:</span>
            <span style={{ fontWeight: "bold", color: "#14532d" }}>1 ETH</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "0.5rem",
            }}
          >
            <span style={{ color: "#166534" }}>Status:</span>
            <span
              style={{
                color: "#14532d",
                backgroundColor: "#dcfce7",
                padding: "0.25rem 0.75rem",
                borderRadius: "9999px",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              Secured in Pool
            </span>
          </div>
        </div>

        {/* Generate Button or URL Display */}
        {!generatedUrl ? (
          <button
            onClick={generateUrl}
            disabled={isGenerating}
            style={{
              width: "100%",
              padding: "1rem 2rem",
              backgroundColor: isGenerating ? "#94a3b8" : "#10b981",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "1.1rem",
              fontWeight: "600",
              cursor: isGenerating ? "not-allowed" : "pointer",
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            {isGenerating ? (
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
                Generating Secure Link...
              </>
            ) : (
              <>
                <Link2 size={20} />
                Generate Withdrawal Link
              </>
            )}
          </button>
        ) : (
          <>
            {/* Generated URL */}
            <div
              style={{
                backgroundColor: "#f8fafc",
                border: "2px solid #e2e8f0",
                borderRadius: "12px",
                padding: "1rem",
                marginBottom: "1rem",
              }}
            >
              <label
                style={{
                  display: "block",
                  fontSize: "0.9rem",
                  color: "#64748b",
                  marginBottom: "0.5rem",
                  fontWeight: "500",
                }}
              >
                Withdrawal URL
              </label>
              <div
                style={{
                  backgroundColor: "white",
                  padding: "0.75rem",
                  borderRadius: "8px",
                  fontFamily: "monospace",
                  fontSize: "0.875rem",
                  wordBreak: "break-all",
                  color: "#374151",
                  border: "1px solid #d1d5db",
                }}
              >
                {generatedUrl}
              </div>
            </div>

            {/* Copy Button */}
            <button
              onClick={copyToClipboard}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                backgroundColor: copied ? "#10b981" : "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "500",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                marginBottom: "1.5rem",
                transition: "background-color 0.2s",
              }}
            >
              {copied ? (
                <>
                  <Check size={18} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={18} />
                  Copy Link
                </>
              )}
            </button>

            {/* QR Code Toggle */}
            <button
              onClick={() => setShowQR(!showQR)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                backgroundColor: showQR ? "#6366f1" : "white",
                color: showQR ? "white" : "#374151",
                border: "2px solid #6366f1",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "500",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                marginBottom: "1.5rem",
                transition: "all 0.2s",
              }}
            >
              <QrCode size={18} />
              {showQR ? "Hide QR Code" : "Show QR Code"}
            </button>

            {/* QR Code Display */}
            {showQR && (
              <div
                style={{
                  backgroundColor: "white",
                  padding: "2rem",
                  borderRadius: "12px",
                  border: "2px solid #e5e7eb",
                  textAlign: "center",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    width: "200px",
                    height: "200px",
                    backgroundColor: "#f3f4f6",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                    color: "#6b7280",
                  }}
                >
                  QR Code
                  <br />
                  (Mock)
                </div>
                <p
                  style={{
                    marginTop: "1rem",
                    fontSize: "0.9rem",
                    color: "#64748b",
                  }}
                >
                  Scan to open withdrawal link
                </p>
              </div>
            )}

            {/* Share Options */}
            <div style={{ marginBottom: "2rem" }}>
              <h3
                style={{
                  margin: "0 0 1rem 0",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  color: "#1e293b",
                }}
              >
                Quick Share
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "0.75rem",
                }}
              >
                {shareOptions.map((option) => (
                  <button
                    key={option.label}
                    onClick={option.action}
                    style={{
                      padding: "1rem",
                      backgroundColor: "white",
                      border: "2px solid #e2e8f0",
                      borderRadius: "8px",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.5rem",
                      transition: "all 0.2s",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = "#3b82f6";
                      e.currentTarget.style.backgroundColor = "#eff6ff";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = "#e2e8f0";
                      e.currentTarget.style.backgroundColor = "white";
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#3b82f6";
                      e.currentTarget.style.backgroundColor = "#eff6ff";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#e2e8f0";
                      e.currentTarget.style.backgroundColor = "white";
                    }}
                  >
                    <option.icon size={24} color="#64748b" />
                    <span
                      style={{
                        fontSize: "0.875rem",
                        color: "#374151",
                        fontWeight: "500",
                      }}
                    >
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Security Notice */}
        <div
          style={{
            backgroundColor: "#fef3c7",
            padding: "1rem",
            borderRadius: "8px",
            border: "1px solid #fcd34d",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.9rem",
              color: "#92400e",
              lineHeight: "1.5",
            }}
          >
            <strong>Security:</strong> Only users with valid KYC/KYB credentials (Mizuhiki SBT or
            UNTI) can withdraw using this link. The link contains encrypted withdrawal information
            that's processed locally.
          </p>
        </div>
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
