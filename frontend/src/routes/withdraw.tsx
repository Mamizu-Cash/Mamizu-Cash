import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  Building,
  CheckCircle,
  Download,
  Shield,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type CredentialInfo, getCredential } from "../lib/mockCredentials";

export const Route = createFileRoute("/withdraw")({
  component: WithdrawScreen,
});

type CredentialStatus = "checking" | "valid" | "invalid" | "none";

function WithdrawScreen() {
  const [credentialStatus, setCredentialStatus] = useState<CredentialStatus>("checking");
  const [credential, setCredential] = useState<CredentialInfo | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Mock URL parameters (in real implementation, would parse from URL fragment)
  const withdrawalInfo = {
    amount: "1 ETH",
    pool: "0xabcdef...",
    note: "0x84f7b5a23d4e6c18...",
  };

  // Check stored credentials
  useEffect(() => {
    const checkCredentials = async () => {
      setCredentialStatus("checking");

      // Simulate credential check delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const storedCredential = getCredential();

      if (storedCredential) {
        setCredentialStatus("valid");
        setCredential(storedCredential);
      } else {
        setCredentialStatus("invalid");
      }
    };

    checkCredentials();
  }, []);

  const handleWithdraw = async () => {
    setIsWithdrawing(true);

    // Mock withdrawal process
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setIsWithdrawing(false);
    setWithdrawSuccess(true);
  };

  if (withdrawSuccess) {
    return <WithdrawSuccessScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <Card className="w-full border-0 bg-background/95 shadow-xl backdrop-blur">
          <CardHeader className="space-y-4 pb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary">
              <Download size={40} className="text-white" />
            </div>
            <div className="space-y-2">
              <CardTitle className="bg-gradient-to-r from-primary to-secondary bg-clip-text font-bold text-3xl text-transparent">
                安全な支払い受取
              </CardTitle>
              <CardDescription className="text-lg">
                資格確認後、完全プライベートで資金受取
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* URL Safety Explanation */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Shield size={20} className="text-primary" />
                <h2 className="font-semibold text-xl">URL安全性の仕組み</h2>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="space-y-3 pt-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-primary" />
                      <h3 className="font-semibold text-primary text-sm">クライアントサイド処理</h3>
                    </div>
                    <p className="text-primary text-xs">
                      URLのnoteやプール情報はフラグメント（#以下）に埋め込まれ、
                      ブラウザ内でのみ解釈されます。サーバーには送信されないため、
                      ログに残ることがありません。
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-secondary/20 bg-secondary/5">
                  <CardContent className="space-y-3 pt-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-secondary" />
                      <h3 className="font-semibold text-secondary text-sm">資格による二重保護</h3>
                    </div>
                    <p className="text-secondary text-xs">
                      万一URLが漏洩しても、受取人がMizuhiki SBTまたはUNTIを
                      保有していなければ引き出しは不可能です。
                      noteの知識と資格の両方が必要な設計です。
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Alert className="border-success/30 bg-success/5">
                <Shield size={16} className="text-success" />
                <AlertTitle className="text-success">実務で安心な設計</AlertTitle>
                <AlertDescription className="text-success">
                  <div className="mt-2 space-y-1 text-sm">
                    <div>
                      • <strong>ワンタイム表示：</strong> 一度開封後は再表示不可能
                    </div>
                    <div>
                      • <strong>宛先バインド：</strong> 特定の受取人にのみ紐付け可能
                    </div>
                    <div>
                      • <strong>QRコード対応：</strong> モバイルでの安全な共有
                    </div>
                    <div>
                      • <strong>時限設定：</strong> 指定期間後の自動無効化（将来実装）
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            </div>

            {/* Withdrawal Information */}
            <Card className="border-muted">
              <CardHeader>
                <CardTitle className="text-xl">受取詳細</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">受取金額:</span>
                  <span className="font-bold text-xl">{withdrawalInfo.amount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">プール:</span>
                  <span className="font-mono text-muted-foreground text-sm">
                    {withdrawalInfo.pool}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">プライバシー状態:</span>
                  <Badge
                    variant="secondary"
                    className="border-success/30 bg-success/20 text-success"
                  >
                    完全匿名
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">送金者情報:</span>
                  <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                    観測不可能
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Credential Verification */}
            <Alert
              className={`${
                credentialStatus === "valid"
                  ? "border-success bg-success/5"
                  : credentialStatus === "invalid"
                    ? "border-destructive bg-destructive/5"
                    : "border-warning bg-warning/5"
              }`}
            >
              <div className="mb-4 flex items-center gap-3">
                {credentialStatus === "checking" && (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-warning border-t-transparent" />
                    <AlertTitle className="text-warning-foreground">
                      Verifying Credentials...
                    </AlertTitle>
                  </>
                )}
                {credentialStatus === "valid" && (
                  <>
                    <CheckCircle size={20} className="text-success" />
                    <AlertTitle className="text-success">Credentials Verified</AlertTitle>
                  </>
                )}
                {credentialStatus === "invalid" && (
                  <>
                    <XCircle size={20} className="text-destructive" />
                    <AlertTitle className="text-destructive">Invalid Credentials</AlertTitle>
                  </>
                )}
              </div>

              {credentialStatus === "checking" && (
                <AlertDescription>Mizuhiki SBTまたはUNTI資格を確認中...</AlertDescription>
              )}

              {credentialStatus === "valid" && credential && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {credential.type === "mizuhiki" ? (
                      <User size={16} className="text-success" />
                    ) : (
                      <Building size={16} className="text-success" />
                    )}
                    <Badge
                      variant="secondary"
                      className="border-success/30 bg-success/20 text-success"
                    >
                      {credential.type === "mizuhiki"
                        ? "Mizuhiki Verified SBT"
                        : "UNTI (Corporate KYB)"}
                    </Badge>
                  </div>
                  <AlertDescription className="text-success">
                    プライベート受取の資格が確認されました
                  </AlertDescription>
                  <Card className="border-success/30 bg-success/10">
                    <CardContent className="space-y-2 pt-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-success">Token ID:</span>
                        <span className="font-mono text-success-foreground">
                          {credential.tokenId}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-success">
                          {credential.type === "mizuhiki" ? "Name:" : "Company:"}
                        </span>
                        <span className="text-success-foreground">
                          {credential.type === "mizuhiki"
                            ? credential.userInfo?.name
                            : credential.userInfo?.companyName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-success">Issued:</span>
                        <span className="text-success-foreground">
                          {new Date(credential.issuedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {credentialStatus === "invalid" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-destructive" />
                    <span className="font-medium text-destructive">No Valid Credentials Found</span>
                  </div>
                  <AlertDescription className="text-destructive">
                    この資金を受け取るには、Mizuhiki SBTまたはUNTI資格が必要です。
                  </AlertDescription>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild size="sm">
                      <a href="/get-mizuhiki" className="flex items-center gap-2">
                        <User size={14} />
                        Get Mizuhiki SBT
                      </a>
                    </Button>
                    <Button asChild size="sm" variant="secondary">
                      <a href="/get-unti" className="flex items-center gap-2">
                        <Building size={14} />
                        Get UNTI
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </Alert>

            {/* Privacy Notice */}
            <Alert className="border-primary/30 bg-primary/5">
              <Shield size={16} className="text-primary" />
              <AlertTitle className="text-primary">Complete Privacy Guaranteed</AlertTitle>
              <AlertDescription className="text-primary">
                This withdrawal uses zero-knowledge proofs. The sender's identity and transaction
                history remain completely private and unlinkable.
              </AlertDescription>
            </Alert>

            {/* Withdraw Button */}
            <Button
              onClick={handleWithdraw}
              disabled={credentialStatus !== "valid" || isWithdrawing}
              size="lg"
              className={`w-full py-6 font-semibold text-lg transition-all ${
                credentialStatus !== "valid" || isWithdrawing
                  ? "cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              {isWithdrawing ? (
                <>
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Generating ZK Proof...
                </>
              ) : credentialStatus === "valid" ? (
                <>
                  <Download size={20} className="mr-2" />
                  Withdraw {withdrawalInfo.amount}
                </>
              ) : (
                "Credential Verification Required"
              )}
            </Button>

            {/* Processing Status */}
            {isWithdrawing && (
              <Alert className="border-warning/30 bg-warning/5">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-warning border-t-transparent" />
                <AlertTitle className="text-warning-foreground">
                  Processing secure withdrawal...
                </AlertTitle>
                <AlertDescription className="space-y-1 text-warning-foreground">
                  <div>• Generating zero-knowledge proof</div>
                  <div>• Verifying nullifier uniqueness</div>
                  <div>• Submitting anonymous transaction</div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function WithdrawSuccessScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-success/5 py-8">
      <Card className="w-full max-w-lg border-0 bg-background/95 shadow-xl backdrop-blur">
        <CardHeader className="space-y-6 text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-success to-emerald-600">
            <CheckCircle size={60} className="text-white" />
          </div>
          <div className="space-y-2">
            <CardTitle className="font-bold text-4xl text-success">Withdrawal Complete</CardTitle>
            <CardDescription className="text-lg">
              Your funds have been successfully withdrawn with complete privacy
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Transaction Details */}
          <Card className="border-success/30 bg-success/10">
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center justify-between">
                <span className="font-medium text-success">Amount Received:</span>
                <span className="font-bold text-success-foreground text-xl">1 ETH</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-success">Transaction Hash:</span>
                <span className="font-mono text-sm text-success">0x742d3...a8f1c</span>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Notice */}
          <Alert className="border-primary/30 bg-primary/5">
            <Shield className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary">Privacy Protected</AlertTitle>
            <AlertDescription className="text-primary">
              The source of these funds is completely anonymous and unlinkable on the blockchain.
              Your transaction maintains full privacy compliance.
            </AlertDescription>
          </Alert>

          {/* Action Button */}
          <Button
            onClick={() => {
              window.location.href = "/";
            }}
            size="lg"
            className="w-full bg-gradient-to-r from-primary to-secondary py-6 font-semibold text-lg transition-all hover:scale-102 hover:from-primary/90 hover:to-secondary/90 hover:shadow-lg"
          >
            Start New Transaction
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
