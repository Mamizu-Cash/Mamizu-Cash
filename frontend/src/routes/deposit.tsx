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
  const linkGenerationSectionId = useId();

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
            label: "View Link",
            onClick: () => {
              // Scroll to link generation section
              document.getElementById(linkGenerationSectionId)?.scrollIntoView({
                behavior: "smooth",
              });
            },
          },
        },
      );

      // Auto-generate link after deposit success
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
            id={linkGenerationSectionId}
            className={styles.linkGenerationSection}
            aria-label="Withdrawal link generation"
          >
            {/* Link Generation Header */}
            <div className={styles.linkHeader}>
              <div className={styles.linkIconContainer}>
                <Link2 size={30} color="white" aria-hidden="true" />
              </div>
              <h2 className={styles.linkTitle}>Share Withdrawal Link</h2>
              <p className={styles.linkSubtitle}>
                Generate a secure link for the recipient to withdraw funds privately
              </p>
            </div>

            {/* Generate Button or URL Display */}
            {!generatedUrl ? (
              <button
                onClick={generateUrl}
                disabled={isGeneratingLink}
                className={`${styles.generateButton} ${isGeneratingLink ? styles.generating : ""}`}
              >
                {isGeneratingLink ? (
                  <>
                    <div className={styles.spinner} />
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
                <div className={styles.urlContainer}>
                  <label className={styles.urlLabel}>Withdrawal URL</label>
                  <div className={styles.urlDisplay}>{generatedUrl}</div>
                </div>

                {/* Copy Button */}
                <button
                  onClick={copyToClipboard}
                  className={`${styles.copyButton} ${copied ? styles.copied : ""}`}
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
                  className={`${styles.qrToggleButton} ${showQR ? styles.active : ""}`}
                >
                  <QrCode size={18} />
                  {showQR ? "Hide QR Code" : "Show QR Code"}
                </button>

                {/* QR Code Display */}
                {showQR && (
                  <div className={styles.qrCodeContainer}>
                    <div className={styles.qrCodePlaceholder}>
                      QR Code
                      <br />
                      (Mock)
                    </div>
                    <p className={styles.qrDescription}>Scan to open withdrawal link</p>
                  </div>
                )}

                {/* Share Options */}
                <div className={styles.shareSection}>
                  <h3 className={styles.shareTitle}>Quick Share</h3>
                  <div className={styles.shareGrid}>
                    {shareOptions.map((option) => (
                      <button
                        key={option.label}
                        onClick={option.action}
                        className={styles.shareButton}
                      >
                        <option.icon size={24} color="#166534" />
                        <span className={styles.shareLabel}>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Security Notice */}
            <div className={styles.securityNotice}>
              <p className={styles.securityText}>
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
