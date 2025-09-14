import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle, ExternalLink, FileUp, Key, Shield } from "lucide-react";
import { useState } from "react";
import { useAccount } from "wagmi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useBusinessVerifier } from "../hooks/useBusinessVerifier";
import {
  type CredentialInfo,
  generateMockHash,
  simulateProcessingDelay,
} from "../lib/mockCredentials";
import { KAIGAN_EXPLORER_URL } from "../lib/web3/contracts";

export const Route = createFileRoute("/attestor")({
  component: AttestorScreen,
});

type Step = "upload" | "proof" | "verify";

function AttestorScreen() {
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [isProcessing, setIsProcessing] = useState(false);
  const [credential, setCredential] = useState<CredentialInfo | null>(null);
  const [emlFile, setEmlFile] = useState<File | null>(null);
  const [zkProof, setZkProof] = useState<string | null>(null);

  // Wallet and BusinessVerifier integration
  const { address: userAddress, isConnected } = useAccount();
  const {
    isEligible,
    computedTokenId,
    stampWithData,
    isStampWithDataPending,
    stampWithDataTxHash,
    stampWithDataError,
    refetchIsEligible,
    refetchComputedTokenId,
  } = useBusinessVerifier();

  const handleEmlUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file?.name.endsWith(".eml")) {
      setEmlFile(file);
    }
  };

  const handleProofGeneration = async () => {
    setIsProcessing(true);
    setCurrentStep("proof");

    await simulateProcessingDelay(2000);

    // Mock ZK proof generation
    const mockProof = generateMockHash();
    setZkProof(mockProof);
    setIsProcessing(false);
    setCurrentStep("verify");
  };

  const handleVerification = async () => {
    if (!isConnected || !userAddress) {
      alert("ウォレットを接続してください");
      return;
    }

    if (isEligible) {
      alert("既にUNTIトークンを保有しています。重複発行はできません。");
      return;
    }

    if (!zkProof) {
      alert("ZK Proofが生成されていません");
      return;
    }

    try {
      setIsProcessing(true);

      // Convert zkProof to hex bytes for contract call
      const zkProofHex = zkProof.startsWith("0x") ? zkProof : `0x${zkProof}`;

      // Call BusinessVerifier.stamp(data) with ZK proof
      await stampWithData(zkProofHex as `0x${string}`);

      // Wait for transaction confirmation is handled by the hook
      // After successful transaction, refetch data and create credential
      await refetchIsEligible();
      await refetchComputedTokenId();

      const newCredential: CredentialInfo = {
        type: "unti",
        issuedAt: Date.now(),
        transactionHash: stampWithDataTxHash ?? "0x...",
        tokenId: computedTokenId?.toString() ?? "0",
        userInfo: {
          companyName: "Verified Company", // Could be extracted from DKIM data
          email: "company@example.com", // Could be extracted from DKIM data
        },
      };

      setCredential(newCredential);
      setIsProcessing(false);
    } catch (error) {
      console.error("Verification failed:", error);
      alert("検証に失敗しました。詳細はコンソールをご確認ください。");
      setIsProcessing(false);
    }
  };

  const steps = [
    { key: "upload", label: "EMLアップロード", icon: FileUp },
    { key: "proof", label: "ZK Proof生成", icon: Key },
    { key: "verify", label: "検証&発行", icon: CheckCircle },
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => step.key === currentStep);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8">
      <div className="container mx-auto max-w-4xl space-y-8 px-4">
        {/* Header */}
        <Card className="border-0 bg-background/95 shadow-xl backdrop-blur">
          <CardHeader className="space-y-6 pb-8 text-center">
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary">
                <Shield size={40} className="text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="bg-gradient-to-r from-primary to-secondary bg-clip-text font-bold text-3xl text-transparent">
                UNTI Attestor
              </CardTitle>
              <CardDescription className="text-lg">EML検証とUNTI発行</CardDescription>
            </div>
          </CardHeader>
        </Card>

        {/* UNTI Status Check */}
        {isConnected && (
          <Alert
            className={isEligible ? "border-success bg-success/5" : "border-warning bg-warning/5"}
          >
            <div className="flex items-center gap-2">
              {isEligible ? (
                <CheckCircle size={18} className="text-success" />
              ) : (
                <Shield size={18} className="text-warning" />
              )}
              <AlertTitle className={isEligible ? "text-success" : "text-warning-foreground"}>
                {isEligible ? "UNTIトークン保有済み" : "UNTI未取得"}
              </AlertTitle>
            </div>
            <AlertDescription className={isEligible ? "text-success" : "text-warning-foreground"}>
              {isEligible ? (
                <>
                  既に企業認証が完了しています。
                  <Button variant="link" asChild className="ml-1 h-auto p-0 text-success underline">
                    <a href="/profile">プロフィールページで確認</a>
                  </Button>
                </>
              ) : (
                "プライベート送金を利用するには企業認証が必要です"
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Progress Steps */}
        <Card className="border-0 bg-background/95 shadow-xl backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {steps.map((step, index) => {
                const currentIndex = getCurrentStepIndex();
                const isActive = step.key === currentStep;
                const isCompleted = index < currentIndex;

                return (
                  <div key={step.key} className="flex items-center">
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                          isCompleted || isActive
                            ? "bg-gradient-to-r from-primary to-secondary text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <step.icon size={24} />
                      </div>
                      <span
                        className={`text-sm ${
                          isCompleted || isActive
                            ? "font-semibold text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <Separator
                        orientation="horizontal"
                        className={`-mt-8 mx-2 w-8 ${
                          isCompleted ? "bg-gradient-to-r from-primary to-secondary" : "bg-muted"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* EML Upload Step */}
        {currentStep === "upload" && (
          <Card className="border-primary bg-primary/5 shadow-xl">
            <CardContent className="pt-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                  <FileUp size={32} className="text-white" />
                </div>
              </div>
              <CardTitle className="mb-4 font-bold text-2xl text-primary">
                EMLファイルをアップロード
              </CardTitle>
              <CardDescription className="mb-6 text-primary">
                送信したメールのEMLファイルをダウンロードして、こちらにアップロードしてください。
                <br />
                EMLファイルからDKIM署名を抽出してゼロ知識証明を生成します。
              </CardDescription>

              <div className="mb-6 rounded-lg border-2 border-primary border-dashed bg-background p-8">
                <Input
                  type="file"
                  accept=".eml"
                  onChange={handleEmlUpload}
                  className="cursor-pointer border-none p-2 text-center"
                />
                {emlFile && (
                  <Alert className="mt-4 border-success bg-success/10">
                    <CheckCircle size={16} className="text-success" />
                    <AlertDescription className="ml-2 text-success">
                      {emlFile.name} ({(emlFile.size / 1024).toFixed(1)}KB)
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <Button
                onClick={handleProofGeneration}
                disabled={!emlFile}
                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50"
              >
                <Key size={20} className="mr-2" />
                ZK Proof生成開始
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ZK Proof Generation Step */}
        {currentStep === "proof" && (
          <Card className="border-warning bg-warning/5 shadow-xl">
            <CardContent className="space-y-6 pt-8 text-center">
              <div className="flex justify-center">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-muted border-t-warning" />
              </div>

              <div className="space-y-2">
                <CardTitle className="font-bold text-2xl text-warning-foreground">
                  ZK Proof生成中...
                </CardTitle>
                <CardDescription className="text-warning-foreground">
                  EMLファイルからDKIM署名を抽出してゼロ知識証明を生成しています
                </CardDescription>
              </div>

              <Alert className="border-warning bg-warning/10">
                <Key size={18} className="text-warning" />
                <AlertTitle className="text-warning-foreground">処理中...</AlertTitle>
                <AlertDescription className="text-left text-warning-foreground">
                  <ul className="space-y-1 text-sm">
                    <li>• EMLファイルを解析中</li>
                    <li>• DKIM署名を抽出中</li>
                    <li>• RSA署名を検証中</li>
                    <li>• ゼロ知識証明を生成中</li>
                  </ul>
                </AlertDescription>
              </Alert>

              {zkProof && (
                <Alert className="border-success bg-success/10">
                  <CheckCircle size={18} className="text-success" />
                  <AlertTitle className="text-success">✓ ZK Proof生成完了</AlertTitle>
                  <AlertDescription className="text-success">
                    <div className="mt-2 break-all rounded-md border border-success/20 bg-background p-3 font-mono text-xs">
                      {zkProof.slice(0, 32)}...{zkProof.slice(-32)}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Verification & Issuance Step */}
        {currentStep === "verify" && (
          <div className="space-y-6">
            {!credential ? (
              // Pre-verification state
              <Card className="border-accent bg-accent/5 shadow-xl">
                <CardContent className="pt-8 text-center">
                  <div className="mb-6 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent">
                      <Shield size={32} className="text-white" />
                    </div>
                  </div>
                  <CardTitle className="mb-4 font-bold text-2xl text-accent">
                    {isProcessing ? "検証中..." : "オンチェーン検証&UNTI発行"}
                  </CardTitle>

                  {zkProof && (
                    <Alert className="mb-6 border-accent bg-background">
                      <Key size={18} className="text-accent" />
                      <AlertTitle className="text-accent">生成されたZK Proof:</AlertTitle>
                      <AlertDescription>
                        <div className="mt-2 break-all rounded-md bg-muted p-3 font-mono text-success text-xs">
                          {zkProof}
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  <CardDescription className="mb-6 text-accent">
                    {isProcessing
                      ? "スマートコントラクトで検証中です。検証成功後、UNTIトークンが自動発行されます。"
                      : "スマートコントラクトにProofを送信して、DKIM署名の正当性を検証します。検証が成功すると、UNTIトークンが発行されます。"}
                  </CardDescription>

                  {(isProcessing || isStampWithDataPending) && (
                    <Alert className="mb-6 border-warning bg-warning/10">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-warning border-t-transparent" />
                      <AlertTitle className="text-warning-foreground">処理中...</AlertTitle>
                      <AlertDescription className="text-left text-warning-foreground">
                        <ul className="space-y-1 text-sm">
                          <li>• ZK Proofを送信中</li>
                          <li>• スマートコントラクトで検証中</li>
                          <li>• DKIM署名の正当性を確認中</li>
                          <li>• UNTIトークンを発行中</li>
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  {stampWithDataError && (
                    <Alert variant="destructive" className="mb-6">
                      <AlertTitle>エラー: トランザクションが失敗しました</AlertTitle>
                      <AlertDescription>{stampWithDataError.message}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    onClick={handleVerification}
                    disabled={
                      isProcessing || isStampWithDataPending || !isConnected || !!isEligible
                    }
                    className="w-full bg-accent text-white hover:bg-accent/90 disabled:opacity-50"
                  >
                    {isProcessing || isStampWithDataPending ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        検証&発行中...
                      </>
                    ) : !isConnected ? (
                      <>
                        <Shield size={20} className="mr-2" />
                        ウォレットを接続してください
                      </>
                    ) : isEligible ? (
                      <>
                        <CheckCircle size={20} className="mr-2" />
                        既にUNTI発行済み
                      </>
                    ) : (
                      <>
                        <CheckCircle size={20} className="mr-2" />
                        検証してUNTI発行
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              // Post-verification success state
              <Card className="border-success bg-success/5 shadow-xl">
                <CardContent className="space-y-6 pt-8 text-center">
                  <div className="flex justify-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-success">
                      <CheckCircle size={60} className="text-white" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <CardTitle className="font-bold text-3xl text-success">
                      UNTI発行完了！
                    </CardTitle>
                    <CardDescription className="text-lg text-success">
                      企業向けUNTI (ERC-6268) が正常に発行されました
                    </CardDescription>
                  </div>

                  <div className="space-y-4 rounded-lg border border-success/20 bg-success/10 p-6">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-success">UNTIトークンID:</span>
                      <Badge variant="outline" className="border-success font-mono text-success">
                        {credential.tokenId}
                      </Badge>
                    </div>
                    <Separator className="bg-success/20" />
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-success">企業名:</span>
                      <span className="text-success">{credential.userInfo?.companyName}</span>
                    </div>
                    <Separator className="bg-success/20" />
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-success">トランザクション:</span>
                      <Button variant="link" asChild className="h-auto p-0 text-success">
                        <a
                          href={`${KAIGAN_EXPLORER_URL}/tx/${credential.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 font-mono text-sm"
                        >
                          {credential.transactionHash?.slice(0, 10)}...
                          {credential.transactionHash?.slice(-8)}
                          <ExternalLink size={14} />
                        </a>
                      </Button>
                    </div>
                    <Separator className="bg-success/20" />
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-success">発行日時:</span>
                      <span className="text-success">
                        {new Date(credential.issuedAt).toLocaleString("ja-JP")}
                      </span>
                    </div>
                  </div>

                  <Alert className="border-primary bg-primary/5">
                    <CheckCircle size={18} className="text-primary" />
                    <AlertTitle className="text-primary">おめでとうございます！</AlertTitle>
                    <AlertDescription className="text-primary">
                      企業としてMamizu Cashのプライベート送金機能を利用できます。
                    </AlertDescription>
                  </Alert>

                  <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <Button asChild className="bg-primary hover:bg-primary/90">
                      <a href="/withdraw">送金を受け取る</a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary/10"
                    >
                      <a href="/">ホームに戻る</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
