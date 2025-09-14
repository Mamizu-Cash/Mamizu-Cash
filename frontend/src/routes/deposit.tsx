import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  Building,
  CheckCircle,
  Copy,
  FileText,
  Link2,
  Lock,
  Mail,
  QrCode,
  Share2,
  Shield,
} from "lucide-react";
import { useId, useState } from "react";
import { useToastHelpers } from "../components/ui/Toast";
import { generateShareEmailUrl } from "../lib/emailUtils";
import styles from "./deposit.module.css";

export const Route = createFileRoute("/deposit")({
  component: DepositScreen,
});

const DENOMINATIONS = [
  { value: "0.1", label: "0.1 ETH", usd: "$400" },
  { value: "1", label: "1 ETH", usd: "$4,000" },
  { value: "10", label: "10 ETH", usd: "$40,000" },
  { value: "100", label: "100 ETH", usd: "$400,000" },
];

type ProcessingState = "idle" | "generating" | "broadcasting" | "confirming" | "complete" | "error";

function DepositScreen() {
  const [selectedAmount, setSelectedAmount] = useState("1");
  const [processingState, setProcessingState] = useState<ProcessingState>("idle");
  const [progress, setProgress] = useState(0);
  const { showSuccess, showError, showInfo } = useToastHelpers();

  // Generate unique IDs for accessibility
  const privacyFeaturesId = useId();
  const amountSelectionId = useId();

  // Link generation states
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);

  // Mock withdrawal URL
  const MOCK_URL =
    "https://mamizu.cash/withdraw#eyJub3RlIjoiMHg4NGY3YjVhMjNkNGU2YzE4IiwicG9vbCI6IjB4YWJjZGVmIn0";

  const generateUrl = () => {
    setIsGeneratingLink(true);
    setTimeout(() => {
      setGeneratedUrl(MOCK_URL);
      setIsGeneratingLink(false);
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
      action: () =>
        window.open(generateShareEmailUrl(generatedUrl, "[Mamizu-Cash] Withdrawal Link")),
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

  const handleDeposit = async () => {
    showInfo("Starting Private Deposit", `Initiating secure deposit of ${selectedAmount} ETH`, {
      duration: 3000,
    });

    setProcessingState("generating");
    setProgress(25);

    try {
      // Simulate commitment generation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showInfo("Generating Proof", "Creating zero-knowledge commitment...", { duration: 2000 });

      setProcessingState("broadcasting");
      setProgress(50);

      // Simulate transaction broadcast
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showInfo("Broadcasting Transaction", "Sending to Japan Smart Chain Kaigan...", {
        duration: 2000,
      });

      setProcessingState("confirming");
      setProgress(75);

      // Simulate confirmation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setProcessingState("complete");
      setProgress(100);

      // Show success message
      showSuccess(
        "Deposit Successful!",
        `Successfully deposited ${selectedAmount} ETH with complete privacy`,
        {
          duration: 5000,
          action: {
            label: "Generate Link",
            onClick: () => {
              generateUrl();
            },
          },
        },
      );

      // Auto-generate link after deposit
      setTimeout(() => {
        generateUrl();
      }, 1000);
    } catch (error) {
      console.error("Deposit failed:", error);
      setProcessingState("error");
      setProgress(0);

      showError(
        "Deposit Failed",
        "An error occurred while processing your deposit. Please check your wallet connection and try again.",
        {
          action: {
            label: "Retry",
            onClick: () => {
              setProcessingState("idle");
              handleDeposit();
            },
          },
        },
      );

      // Reset after error display
      setTimeout(() => {
        setProcessingState("idle");
      }, 3000);
    }
  };

  const getProcessingMessage = () => {
    switch (processingState) {
      case "generating":
        return "Generating commitment and nullifier...";
      case "broadcasting":
        return "Broadcasting transaction to network...";
      case "confirming":
        return "Waiting for blockchain confirmation...";
      case "complete":
        return "Deposit completed successfully!";
      case "error":
        return "An error occurred. Please try again.";
      default:
        return "";
    }
  };

  const getProgressSteps = () => {
    const steps = [
      { id: "commitment", text: "Generating zero-knowledge commitment" },
      { id: "nullifier", text: "Creating cryptographic nullifier" },
      { id: "broadcast", text: "Broadcasting to Japan Smart Chain Kaigan" },
      { id: "confirmation", text: "Awaiting network confirmation" },
    ];

    return steps.map((step, index) => {
      const isActive = index < Math.floor(progress / 25);
      return {
        id: step.id,
        step: step.text,
        isActive,
      };
    });
  };

  const isProcessing = processingState !== "idle" && processingState !== "complete";
  const isDisabled = isProcessing || processingState === "complete";

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.iconContainer} role="img" aria-label="Security shield">
            <Shield size={40} color="white" aria-hidden="true" />
          </div>
          <h1 className={styles.title}>Private Deposit</h1>
          <p className={styles.subtitle}>
            Deposit funds into the shield pool for completely private transactions
          </p>
        </header>

        {/* Privacy Features */}
        <section className={styles.privacyFeatures} aria-labelledby={privacyFeaturesId}>
          <div className={styles.privacyHeader}>
            <Lock size={20} color="var(--color-primary-600)" aria-hidden="true" />
            <h2 id={privacyFeaturesId} className={styles.privacyTitle}>
              Enterprise-Grade Privacy
            </h2>
          </div>
          <ul className={styles.featuresList}>
            <li className={styles.featureItem}>
              <span className={styles.featureIcon} aria-hidden="true">
                ✓
              </span>
              Zero-knowledge proof technology
            </li>
            <li className={styles.featureItem}>
              <span className={styles.featureIcon} aria-hidden="true">
                ✓
              </span>
              KYC/KYB compliant transactions only
            </li>
            <li className={styles.featureItem}>
              <span className={styles.featureIcon} aria-hidden="true">
                ✓
              </span>
              Complete transaction unlinkability
            </li>
            <li className={styles.featureItem}>
              <span className={styles.featureIcon} aria-hidden="true">
                ✓
              </span>
              Auditable by authorized parties
            </li>
          </ul>
        </section>

        {/* Amount Selection */}
        <section className={styles.amountSection} aria-labelledby={amountSelectionId}>
          <label id={amountSelectionId} className={styles.amountLabel}>
            Select Deposit Amount
          </label>
          <div
            className={styles.denominationsGrid}
            role="radiogroup"
            aria-labelledby={amountSelectionId}
          >
            {DENOMINATIONS.map((denom) => (
              <button
                key={denom.value}
                onClick={() => setSelectedAmount(denom.value)}
                className={`${styles.denominationCard} ${
                  selectedAmount === denom.value ? styles.selected : ""
                }`}
                role="radio"
                aria-checked={selectedAmount === denom.value}
                aria-label={`${denom.label}, approximately ${denom.usd}`}
                disabled={isDisabled}
              >
                <div className={styles.denominationAmount}>{denom.label}</div>
                <div className={styles.denominationUsd}>≈ {denom.usd}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Trust Signals */}
        <section className={styles.trustSignals} aria-label="Security features">
          <div className={styles.trustSignal}>
            <Building size={16} className={styles.trustIcon} aria-hidden="true" />
            <span className={styles.trustText}>Enterprise Ready</span>
          </div>
          <div className={styles.trustSignal}>
            <Shield size={16} className={styles.trustIcon} aria-hidden="true" />
            <span className={styles.trustText}>Auditable</span>
          </div>
          <div className={styles.trustSignal}>
            <Lock size={16} className={styles.trustIcon} aria-hidden="true" />
            <span className={styles.trustText}>ZK Verified</span>
          </div>
        </section>

        {/* Deposit Button */}
        <button
          onClick={handleDeposit}
          disabled={isDisabled}
          className={`${styles.depositButton} ${
            isProcessing
              ? styles.processing
              : processingState === "complete"
                ? styles.successIndicator
                : styles.primary
          }`}
          aria-label={`Deposit ${selectedAmount} ETH securely`}
        >
          {processingState === "complete" ? (
            <>
              <CheckCircle size={20} aria-hidden="true" />
              Deposit Complete!
            </>
          ) : isProcessing ? (
            <>
              <div className={styles.spinner} aria-hidden="true" />
              Processing...
            </>
          ) : (
            <>
              Deposit {selectedAmount} ETH
              <ArrowRight size={20} aria-hidden="true" />
            </>
          )}
        </button>

        {/* Progress Indicator */}
        {isProcessing && (
          <section
            className={`${styles.loadingIndicator} ${
              processingState === "error" ? styles.errorIndicator : ""
            }`}
            role="status"
            aria-live="polite"
            aria-label="Transaction progress"
          >
            <div className={styles.loadingHeader}>
              {processingState !== "error" && <div className={styles.spinner} aria-hidden="true" />}
              <span className={styles.loadingTitle}>{getProcessingMessage()}</span>
            </div>
            <p className={styles.loadingDescription}>
              {processingState === "error"
                ? "Please check your wallet connection and try again."
                : "This may take a few moments as we ensure maximum privacy and security."}
            </p>

            {/* Progress Bar */}
            {processingState !== "error" && (
              <div className="progress-bar" style={{ marginTop: "var(--spacing-3)" }}>
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  role="progressbar"
                  aria-label="Processing progress"
                />
              </div>
            )}

            {/* Detailed Steps */}
            {processingState !== "error" && (
              <div className={styles.progressSteps}>
                <ul className={styles.stepsList}>
                  {getProgressSteps().map(({ id, step, isActive }) => (
                    <li
                      key={id}
                      className={styles.stepItem}
                      aria-current={isActive ? "step" : undefined}
                    >
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Link Generation Section - Show after successful deposit */}
        {processingState === "complete" && (
          <section
            style={{
              marginTop: "2rem",
              backgroundColor: "#f0fdf4",
              padding: "2rem",
              borderRadius: "12px",
              border: "1px solid #bbf7d0",
            }}
          >
            {/* Link Generation Header */}
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "60px",
                  height: "60px",
                  backgroundColor: "#10b981",
                  borderRadius: "50%",
                  marginBottom: "1rem",
                }}
              >
                <Link2 size={30} color="white" />
              </div>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#14532d",
                  marginBottom: "0.5rem",
                }}
              >
                Share Withdrawal Link
              </h2>
              <p
                style={{
                  color: "#166534",
                  fontSize: "1rem",
                  lineHeight: "1.6",
                }}
              >
                Generate a secure link for the recipient to withdraw funds privately
              </p>
            </div>

            {/* Generate Button or URL Display */}
            {!generatedUrl ? (
              <button
                onClick={generateUrl}
                disabled={isGeneratingLink}
                style={{
                  width: "100%",
                  padding: "1rem 2rem",
                  backgroundColor: isGeneratingLink ? "#94a3b8" : "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  cursor: isGeneratingLink ? "not-allowed" : "pointer",
                  marginBottom: "2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                {isGeneratingLink ? (
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
                    backgroundColor: "white",
                    border: "2px solid #bbf7d0",
                    borderRadius: "12px",
                    padding: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.9rem",
                      color: "#166534",
                      marginBottom: "0.5rem",
                      fontWeight: "500",
                    }}
                  >
                    Withdrawal URL
                  </label>
                  <div
                    style={{
                      backgroundColor: "#f8fafc",
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
                      <CheckCircle size={18} />
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
                      border: "2px solid #bbf7d0",
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
                        color: "#166534",
                      }}
                    >
                      Scan to open withdrawal link
                    </p>
                  </div>
                )}

                {/* Share Options */}
                <div style={{ marginBottom: "1rem" }}>
                  <h3
                    style={{
                      margin: "0 0 1rem 0",
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      color: "#14532d",
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
                          border: "2px solid #bbf7d0",
                          borderRadius: "8px",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "0.5rem",
                          transition: "all 0.2s",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.borderColor = "#10b981";
                          e.currentTarget.style.backgroundColor = "#f0fdf4";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.borderColor = "#bbf7d0";
                          e.currentTarget.style.backgroundColor = "white";
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = "#10b981";
                          e.currentTarget.style.backgroundColor = "#f0fdf4";
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#bbf7d0";
                          e.currentTarget.style.backgroundColor = "white";
                        }}
                      >
                        <option.icon size={24} color="#166534" />
                        <span
                          style={{
                            fontSize: "0.875rem",
                            color: "#14532d",
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
                <strong>Security:</strong> Only users with valid KYC/KYB credentials (Mizuhiki SBT
                or UNTI) can withdraw using this link. The link contains encrypted withdrawal
                information that's processed locally.
              </p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
