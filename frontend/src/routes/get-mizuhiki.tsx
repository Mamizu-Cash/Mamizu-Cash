import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, User } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/get-mizuhiki")({
  component: GetMizuhikiScreen,
});

function GetMizuhikiScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 py-8">
      <Card className="w-full max-w-2xl border-0 bg-background/95 shadow-xl backdrop-blur">
        <CardHeader className="space-y-6 text-center">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary">
            <User size={50} className="text-white" />
          </div>
          <div className="space-y-2">
            <CardTitle className="bg-gradient-to-r from-primary to-secondary bg-clip-text font-bold text-4xl text-transparent">
              Mizuhiki SBT取得
            </CardTitle>
            <CardDescription className="text-lg">
              個人向けKYC認証でプライベート送金に参加
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Main Message */}
          <Alert className="border-primary bg-primary/5">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                <ExternalLink size={30} className="text-white" />
              </div>
              <div className="space-y-2">
                <AlertTitle className="text-2xl text-primary">外部サービス</AlertTitle>
                <AlertDescription className="font-medium text-primary text-xl">
                  Japan Smart ChainのMizuhiki Attestorが発行します。
                </AlertDescription>
              </div>
            </div>
          </Alert>

          {/* Action Buttons */}
          <div className="flex justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 px-8 py-6 font-semibold text-lg"
            >
              <a href="/">ホームに戻る</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
