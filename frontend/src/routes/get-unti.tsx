import { createFileRoute } from "@tanstack/react-router";
import { Building, CheckCircle, Mail } from "lucide-react";
import { useState } from "react";
import { useAccount } from "wagmi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8">
      <div className="container mx-auto max-w-4xl space-y-8 px-4">
        {/* Header */}
        <Card className="border-0 bg-background/95 shadow-xl backdrop-blur">
          <CardHeader className="space-y-6 pb-8 text-center">
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary">
                <Building size={40} className="text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="bg-gradient-to-r from-primary to-secondary bg-clip-text font-bold text-3xl text-transparent">
                UNTI取得
              </CardTitle>
              <CardDescription className="text-lg">
                企業向けKYB認証でプライベート送金に参加
              </CardDescription>
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
                <Building size={18} className="text-warning" />
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

        {/* Email Verification Step */}
        {currentStep === "email" && (
          <div className="space-y-6">
            <Card className="border-secondary bg-secondary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-secondary">
                  <Building size={20} />
                  DKIM認証の手順
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-inside list-decimal space-y-2 text-secondary">
                  <li>企業ドメインからメールを送信</li>
                  <li>DKIM署名を自動検証</li>
                  <li>ドメイン所有権を確認</li>
                  <li>UNTI (ERC-6268) トークンを発行</li>
                </ol>
              </CardContent>
            </Card>

            {/* Email Sending Section */}
            <Card className="border-primary bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary font-bold text-sm text-white">
                    1
                  </span>
                  企業メールで認証メールを送信
                </CardTitle>
                <CardDescription className="text-primary">
                  以下のボタンをクリックして、企業ドメインのメールアドレスから認証メールを送信してください。
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <a
                    href={generateBusinessVerificationEmailUrl()}
                    className="flex items-center gap-2"
                  >
                    <Mail size={20} />
                    企業メールで認証メールを送信
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Verification Section */}
            <Card className="border-warning bg-warning/5">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-warning-foreground">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-warning font-bold text-sm text-warning-foreground">
                    2
                  </span>
                  認証の確認
                </CardTitle>
                <div className="mt-4 flex justify-center">
                  <Badge variant="outline" className="border-warning bg-background">
                    <Mail size={16} className="mr-2 text-warning" />
                    企業メールからの認証待機中
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-center text-warning-foreground">
                  メール送信後、下のボタンで認証を確認してください。
                </CardDescription>
                <Button onClick={handleEmailSent} className="w-full bg-primary hover:bg-primary/90">
                  <Mail size={20} className="mr-2" />
                  メール送信完了（次へ）
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Email Sent Step */}
        {currentStep === "sent" && (
          <div className="space-y-6">
            <Card className="border-success bg-success/5">
              <CardContent className="pt-12 pb-8 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-success">
                    <CheckCircle size={60} className="text-white" />
                  </div>
                </div>
                <CardTitle className="mb-4 font-bold text-2xl text-success">
                  メール送信完了！
                </CardTitle>
                <CardDescription className="text-lg text-success">
                  企業ドメインから認証メールの送信が完了しました。
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-primary bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Building size={20} />
                  Business UNTI発行プロセス
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-primary">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-primary" />
                    <span className="font-medium">メール送信完了</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p>• 送信されたメールは管理者により確認されます</p>
                    <p>• DKIM署名の自動検証が実行されます</p>
                    <p>• 企業ドメイン所有権の確認が行われます</p>
                    <p>• 検証完了後、Business UNTIトークンが自動発行されます</p>
                  </div>
                  <div className="mt-4 rounded-lg border border-primary/20 bg-background p-3">
                    <p className="text-center font-medium">Business UNTI発行をお待ちください</p>
                    <p className="text-center text-sm opacity-80">発行完了時に通知が届きます</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                asChild
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
              >
                <a href="/profile" className="flex items-center gap-2">
                  <CheckCircle size={20} />
                  発行ステータス確認
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-secondary text-secondary hover:bg-secondary/10"
              >
                <a href="/" className="flex items-center gap-2">
                  ホームに戻る
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
