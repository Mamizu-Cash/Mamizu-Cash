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
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { generateShareEmailUrl } from "../lib/emailUtils";

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
    toast.success("Link copied to clipboard!");
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
    toast.info(`Initiating secure deposit of ${selectedAmount} ETH`);

    setProcessingState("generating");
    setProgress(25);

    try {
      // Simulate commitment generation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.info("Creating zero-knowledge commitment...");

      setProcessingState("broadcasting");
      setProgress(50);

      // Simulate transaction broadcast
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.info("Broadcasting to Japan Smart Chain Kaigan...");

      setProcessingState("confirming");
      setProgress(75);

      // Simulate confirmation
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setProcessingState("complete");
      setProgress(100);

      // Show success message
      toast.success(`Successfully deposited ${selectedAmount} ETH with complete privacy`, {
        duration: 5000,
      });

      // Auto-generate link after deposit success
      setTimeout(() => {
        generateUrl();
      }, 1000);
    } catch (error) {
      console.error("Deposit failed:", error);
      setProcessingState("error");
      setProgress(0);

      toast.error(
        "An error occurred while processing your deposit. Please check your wallet connection and try again.",
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <Card className="w-full border-0 bg-background/95 shadow-xl backdrop-blur">
          <CardHeader className="space-y-4 pb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary">
              <Shield size={40} className="text-white" />
            </div>
            <div className="space-y-2">
              <CardTitle className="bg-gradient-to-r from-primary to-secondary bg-clip-text font-bold text-3xl text-transparent">
                プライベート送金
              </CardTitle>
              <CardDescription className="text-lg">
                競争優位を守る企業向けシールドプール入金
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Practical Use Cases */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Building size={20} className="text-primary" />
                <h2 className="font-semibold text-xl">実務への組み込み</h2>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Invoice Integration */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="space-y-4 pt-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <FileText size={24} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary">請求書統合</h3>
                        <p className="text-primary text-sm">既存の業務フローにシームレス組み込み</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-primary" />
                        <span>請求書PDF内に支払いURL自動挿入</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-primary" />
                        <span>QRコード付きでモバイル対応</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-primary" />
                        <span>ワンタイム表示で情報漏洩防止</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Email Integration */}
                <Card className="border-secondary/20 bg-secondary/5">
                  <CardContent className="space-y-4 pt-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                        <Mail size={24} className="text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-secondary">メール連携</h3>
                        <p className="text-secondary text-sm">企業間コミュニケーション強化</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-secondary" />
                        <span>メールテンプレートに支払いリンク埋込</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-secondary" />
                        <span>受取側の資格確認を自動実行</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-secondary" />
                        <span>相手国情報の完全秘匿を保証</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Business Scenario Example */}
              <Alert className="border-primary/30 bg-primary/5">
                <Building size={16} className="text-primary" />
                <AlertTitle className="text-primary">実際の利用シーン例</AlertTitle>
                <AlertDescription className="text-primary">
                  <div className="mt-2 space-y-2">
                    <p><strong>クロスボーダー決済：</strong> 海外サプライヤーへの支払いで、相手国や取引額の相関を競合他社に推測されるリスクを排除</p>
                    <p><strong>戦略的取引：</strong> M&A検討時の機密費用や、新規事業パートナーとの協業費用を完全に秘匿</p>
                    <p><strong>内部統制：</strong> 規制当局による完全監査は可能だが、日常的な取引詳細は外部から観測不能</p>
                  </div>
                </AlertDescription>
              </Alert>
            </div>

            {/* Privacy Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Lock size={20} className="text-primary" />
                <h2 id={privacyFeaturesId} className="font-semibold text-xl">
                  経営機密保護技術
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                  <CheckCircle size={16} className="shrink-0 text-success" />
                  <span className="font-medium text-sm">ゼロ知識証明で取引先を完全秘匿</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                  <CheckCircle size={16} className="shrink-0 text-success" />
                  <span className="font-medium text-sm">KYC/KYB認証済み参加者のみ</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                  <CheckCircle size={16} className="shrink-0 text-success" />
                  <span className="font-medium text-sm">金額・相手国の相関を排除</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                  <CheckCircle size={16} className="shrink-0 text-success" />
                  <span className="font-medium text-sm">規制当局による完全監査対応</span>
                </div>
              </div>
            </div>

            {/* Amount Selection */}
            <div className="space-y-4">
              <h2 id={amountSelectionId} className="font-semibold text-xl">
                Select Deposit Amount
              </h2>
              <div
                className="grid grid-cols-2 gap-4 md:grid-cols-4"
                role="radiogroup"
                aria-labelledby={amountSelectionId}
              >
                {DENOMINATIONS.map((denom) => (
                  <Button
                    key={denom.value}
                    variant={selectedAmount === denom.value ? "default" : "outline"}
                    size="lg"
                    onClick={() => setSelectedAmount(denom.value)}
                    disabled={isDisabled}
                    className={`flex h-auto flex-col space-y-2 px-6 py-4 transition-all ${
                      selectedAmount === denom.value
                        ? "scale-105 bg-primary ring-2 ring-primary hover:bg-primary/90"
                        : "border-secondary text-secondary hover:scale-102 hover:bg-secondary/10 hover:shadow-md"
                    }`}
                    role="radio"
                    aria-checked={selectedAmount === denom.value}
                    aria-label={`${denom.label}, approximately ${denom.usd}`}
                  >
                    <div className="font-bold text-lg">{denom.label}</div>
                    <div className="text-sm opacity-75">≈ {denom.usd}</div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap justify-center gap-6" aria-label="Security features">
              <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
                <Building size={16} />
                <span>Enterprise Ready</span>
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
                <Shield size={16} />
                <span>Auditable</span>
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2">
                <Lock size={16} />
                <span>ZK Verified</span>
              </Badge>
            </div>

            {/* Deposit Button */}
            <Button
              onClick={handleDeposit}
              disabled={isDisabled}
              size="lg"
              className={`w-full py-6 font-semibold text-lg transition-all ${
                processingState === "complete"
                  ? "bg-success hover:bg-success/90"
                  : isProcessing
                    ? "cursor-not-allowed bg-muted"
                    : "hover:scale-102 hover:shadow-lg"
              }`}
              aria-label={`Deposit ${selectedAmount} ETH securely`}
            >
              {processingState === "complete" ? (
                <>
                  <CheckCircle size={20} className="mr-2" />
                  Deposit Complete!
                </>
              ) : isProcessing ? (
                <>
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Processing...
                </>
              ) : (
                <>
                  Deposit {selectedAmount} ETH
                  <ArrowRight size={20} className="ml-2" />
                </>
              )}
            </Button>

            {/* Progress Indicator */}
            {isProcessing && (
              <Alert
                className={processingState === "error" ? "border-destructive" : "border-primary"}
                role="status"
                aria-live="polite"
                aria-label="Transaction progress"
              >
                <div className="mb-3 flex items-center gap-3">
                  {processingState !== "error" && (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  )}
                  <AlertTitle className="text-lg">{getProcessingMessage()}</AlertTitle>
                </div>
                <AlertDescription className="mb-4">
                  {processingState === "error"
                    ? "Please check your wallet connection and try again."
                    : "This may take a few moments as we ensure maximum privacy and security."}
                </AlertDescription>

                {/* Progress Bar */}
                {processingState !== "error" && (
                  <div className="space-y-4">
                    <Progress value={progress} className="h-2" />

                    {/* Detailed Steps */}
                    <div className="space-y-2">
                      {getProgressSteps().map(({ id, step, isActive }) => (
                        <div
                          key={id}
                          className={`flex items-center gap-2 text-sm ${
                            isActive ? "font-medium text-primary" : "text-muted-foreground"
                          }`}
                          aria-current={isActive ? "step" : undefined}
                        >
                          <div
                            className={`h-2 w-2 rounded-full ${
                              isActive ? "bg-primary" : "bg-muted-foreground"
                            }`}
                          />
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Alert>
            )}

            {/* Link Generation Section - Show after successful deposit */}
            {processingState === "complete" && (
              <Card
                id={linkGenerationSectionId}
                className="border-success/20 bg-success/5"
                aria-label="Withdrawal link generation"
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-success to-emerald-600">
                    <Link2 size={30} className="text-white" />
                  </div>
                  <CardTitle className="text-2xl text-success">Share Withdrawal Link</CardTitle>
                  <CardDescription className="text-lg">
                    Generate a secure link for the recipient to withdraw funds privately
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Generate Button or URL Display */}
                  {!generatedUrl ? (
                    <Button
                      onClick={generateUrl}
                      disabled={isGeneratingLink}
                      size="lg"
                      className="w-full bg-success py-6 hover:bg-success/90"
                    >
                      {isGeneratingLink ? (
                        <>
                          <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Generating Secure Link...
                        </>
                      ) : (
                        <>
                          <Link2 size={20} className="mr-2" />
                          Generate Withdrawal Link
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      {/* Generated URL */}
                      <div className="space-y-2">
                        <label className="font-medium text-sm">Withdrawal URL</label>
                        <div className="break-all rounded-lg border bg-muted p-4 font-mono text-sm">
                          {generatedUrl}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        <Button
                          onClick={copyToClipboard}
                          variant={copied ? "default" : "outline"}
                          className={copied ? "bg-success hover:bg-success/90" : ""}
                        >
                          {copied ? (
                            <>
                              <CheckCircle size={18} className="mr-2" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy size={18} className="mr-2" />
                              Copy Link
                            </>
                          )}
                        </Button>

                        <Button
                          onClick={() => setShowQR(!showQR)}
                          variant="outline"
                          className={showQR ? "bg-muted" : ""}
                        >
                          <QrCode size={18} className="mr-2" />
                          {showQR ? "Hide QR Code" : "Show QR Code"}
                        </Button>
                      </div>

                      {/* QR Code Display */}
                      {showQR && (
                        <Card className="p-6 text-center">
                          <div className="mx-auto mb-4 flex h-48 w-48 items-center justify-center rounded-lg bg-muted">
                            <div className="text-muted-foreground">
                              <QrCode size={64} />
                              <div className="mt-2 text-sm">QR Code (Mock)</div>
                            </div>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            Scan to open withdrawal link
                          </p>
                        </Card>
                      )}

                      {/* Share Options */}
                      <div className="space-y-3">
                        <h3 className="font-semibold">Quick Share</h3>
                        <div className="grid grid-cols-3 gap-3">
                          {shareOptions.map((option) => (
                            <Button
                              key={option.label}
                              onClick={option.action}
                              variant="outline"
                              size="sm"
                              className="flex h-auto flex-col space-y-2 px-3 py-4"
                            >
                              <option.icon size={24} className="text-success" />
                              <span className="font-medium text-xs">{option.label}</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security Notice */}
                  <Alert className="border-blue-200 bg-blue-50">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-900">Security Notice</AlertTitle>
                    <AlertDescription className="text-blue-800">
                      Only users with valid KYC/KYB credentials (Mizuhiki SBT or UNTI) can withdraw
                      using this link. The link contains encrypted withdrawal information that's
                      processed locally.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
