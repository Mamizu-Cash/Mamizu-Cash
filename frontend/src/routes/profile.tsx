import { createFileRoute } from "@tanstack/react-router";
import { Building, CheckCircle, Copy, ExternalLink, Shield, User, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SBTStatus } from "../components/SBTStatus";
import { useBusinessVerifier } from "../hooks/useBusinessVerifier";
import { useMizuhikiSBT } from "../hooks/useMizuhikiSBT";
import { CONTRACT_ADDRESSES, KAIGAN_EXPLORER_URL } from "../lib/web3/contracts";

export const Route = createFileRoute("/profile")({
  component: ProfileScreen,
});

function ProfileScreen() {
  const { address: userAddress, isConnected } = useAccount();
  const { hasSBT, sbtBalance, isLoading } = useMizuhikiSBT();
  const { isEligible: hasUNTI } = useBusinessVerifier();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Determine verification status
  const isFullyVerified = hasSBT && hasUNTI;
  const hasAnyVerification = hasSBT || hasUNTI;

  if (!isConnected) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/30 py-8">
        <Card className="w-full max-w-md border-0 bg-background/95 shadow-xl backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">ウォレット未接続</CardTitle>
            <CardDescription>
              プロフィールを表示するにはウォレットを接続してください
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8">
      <div className="container mx-auto max-w-4xl space-y-8 px-4">
        {/* Header */}
        <Card className="border-0 bg-background/95 shadow-xl backdrop-blur">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary">
                <User size={30} className="text-white" />
              </div>
              <div className="space-y-2">
                <CardTitle className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-2xl text-transparent">
                  プロフィール
                </CardTitle>
                <CardDescription className="text-base">
                  アカウント情報とMizuhiki SBT状態
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Wallet Info */}
        <Card className="border-0 bg-background/95 shadow-xl backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} />
              ウォレット情報
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <label className="font-semibold text-muted-foreground text-sm">
                ウォレットアドレス
              </label>
              <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
                <span className="flex-1 break-all font-mono text-sm">{userAddress}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => userAddress && copyToClipboard(userAddress)}
                  className="h-8 w-8 shrink-0 hover:bg-muted"
                  title="コピー"
                >
                  <Copy size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className="h-8 w-8 shrink-0 hover:bg-muted"
                  title="エクスプローラーで見る"
                >
                  <a
                    href={`${KAIGAN_EXPLORER_URL}/address/${userAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={16} />
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verification Status Overview */}
        <Card className="border-0 bg-background/95 shadow-xl backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield size={20} />
              認証状態
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Mizuhiki SBT Badge */}
              <Card
                className={`text-center transition-all hover:shadow-lg ${hasSBT ? "border-success bg-success/5" : "border-muted hover:border-muted-foreground/30"}`}
              >
                <CardContent className="space-y-4 pt-6">
                  <div
                    className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${hasSBT ? "bg-success" : "bg-muted-foreground"}`}
                  >
                    {hasSBT ? (
                      <CheckCircle size={24} className="text-white" />
                    ) : (
                      <User size={24} className="text-white" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3
                      className={`font-semibold ${hasSBT ? "text-success" : "text-muted-foreground"}`}
                    >
                      個人認証 (SBT)
                    </h3>
                    <Badge
                      variant={hasSBT ? "default" : "secondary"}
                      className={hasSBT ? "bg-success hover:bg-success/90" : ""}
                    >
                      {hasSBT ? "認証済み" : "未認証"}
                    </Badge>
                  </div>
                  {!hasSBT && (
                    <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                      <a href="/get-mizuhiki">取得する</a>
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* UNTI Badge */}
              <Card
                className={`text-center transition-all hover:shadow-lg ${hasUNTI ? "border-success bg-success/5" : "border-muted hover:border-muted-foreground/30"}`}
              >
                <CardContent className="space-y-4 pt-6">
                  <div
                    className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${hasUNTI ? "bg-success" : "bg-muted-foreground"}`}
                  >
                    {hasUNTI ? (
                      <CheckCircle size={24} className="text-white" />
                    ) : (
                      <Building size={24} className="text-white" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3
                      className={`font-semibold ${hasUNTI ? "text-success" : "text-muted-foreground"}`}
                    >
                      企業認証 (UNTI)
                    </h3>
                    <Badge
                      variant={hasUNTI ? "default" : "secondary"}
                      className={hasUNTI ? "bg-success hover:bg-success/90" : ""}
                    >
                      {hasUNTI ? "認証済み" : "未認証"}
                    </Badge>
                  </div>
                  {!hasUNTI && (
                    <Button asChild size="sm" variant="secondary">
                      <a href="/get-unti">取得する</a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Overall Status Message */}
            <Alert
              className={
                isFullyVerified
                  ? "border-success bg-success/5"
                  : hasAnyVerification
                    ? "border-warning bg-warning/5"
                    : "border-destructive bg-destructive/5"
              }
            >
              <div className="flex items-center gap-2">
                {isFullyVerified ? (
                  <CheckCircle size={18} className="text-success" />
                ) : hasAnyVerification ? (
                  <Shield size={18} className="text-warning" />
                ) : (
                  <XCircle size={18} className="text-destructive" />
                )}
                <AlertTitle
                  className={
                    isFullyVerified
                      ? "text-success"
                      : hasAnyVerification
                        ? "text-warning-foreground"
                        : "text-destructive"
                  }
                >
                  {isFullyVerified
                    ? "完全認証済み"
                    : hasAnyVerification
                      ? "部分認証済み"
                      : "未認証"}
                </AlertTitle>
              </div>
              <AlertDescription
                className={
                  isFullyVerified
                    ? "text-success"
                    : hasAnyVerification
                      ? "text-warning-foreground"
                      : "text-destructive"
                }
              >
                {isFullyVerified
                  ? "すべての認証が完了しています。すべての機能をご利用いただけます。"
                  : hasAnyVerification
                    ? "一部の認証が完了しています。すべての機能を利用するには両方の認証が必要です。"
                    : "プライベート送金機能を利用するには認証が必要です。"}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Detailed SBT Information */}
        <Card className="border-0 bg-background/95 shadow-xl backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} />
              Mizuhiki SBT 詳細
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <SBTStatus />

            {isLoading ? (
              <div className="text-muted-foreground text-sm">SBT情報を読み込み中...</div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="font-semibold text-muted-foreground text-sm">SBT保有数</label>
                  <div className="rounded-lg border bg-muted/50 p-3 font-mono text-sm">
                    {sbtBalance?.toString() ?? "0"}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-semibold text-muted-foreground text-sm">
                    SBTコントラクト
                  </label>
                  <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
                    <span className="flex-1 font-mono text-sm">
                      {formatAddress(CONTRACT_ADDRESSES.MIZUHIKI_SBT)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(CONTRACT_ADDRESSES.MIZUHIKI_SBT)}
                      className="h-6 w-6 shrink-0 hover:bg-muted"
                      title="コピー"
                    >
                      <Copy size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="h-6 w-6 shrink-0 hover:bg-muted"
                      title="エクスプローラーで見る"
                    >
                      <a
                        href={`${KAIGAN_EXPLORER_URL}/address/${CONTRACT_ADDRESSES.MIZUHIKI_SBT}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="border-0 bg-background/95 shadow-xl backdrop-blur">
          <CardHeader>
            <CardTitle>アクション</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="bg-primary hover:bg-primary/90">
                <a href="/">ホームに戻る</a>
              </Button>

              {/* Authentication Actions */}
              {!hasSBT && (
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <a href="/get-mizuhiki" className="flex items-center gap-2">
                    <User size={16} />
                    個人認証を取得
                  </a>
                </Button>
              )}

              {!hasUNTI && (
                <Button asChild variant="secondary">
                  <a href="/get-unti" className="flex items-center gap-2">
                    <Building size={16} />
                    企業認証を取得
                  </a>
                </Button>
              )}

              {/* Service Actions - Only available with verification */}
              {hasAnyVerification && (
                <>
                  <Button asChild className="bg-primary hover:bg-primary/90">
                    <a href="/deposit">プライベート送金</a>
                  </Button>

                  <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
                    <a href="/withdraw">支払いを受け取る</a>
                  </Button>
                </>
              )}
            </div>

            {/* Message when no verification */}
            {!hasAnyVerification && (
              <Alert className="mt-4 border-destructive/30 bg-destructive/5">
                <AlertDescription className="text-destructive italic">
                  認証後に送金機能が利用可能になります
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
