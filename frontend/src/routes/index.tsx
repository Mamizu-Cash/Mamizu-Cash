import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  Download,
  Link as LinkIcon,
  Shield,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import logo from '../logo.png'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="container mx-auto max-w-6xl px-4 py-16">
        {/* Hero Section */}
        <section className="space-y-8 py-20 text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <img
                src={logo}
                alt="Mamizu Cash"
                className="h-20 w-20 object-contain drop-shadow-2xl"
              />
              <div className="-z-10 absolute inset-0 rounded-full bg-primary/20 blur-xl" />
            </div>
          </div>

          <div className="mx-auto max-w-4xl space-y-4">
            <Badge variant="secondary" className="mb-4">
              Enterprise Privacy Protocol
            </Badge>

            <h1 className="bg-gradient-to-r from-primary to-secondary bg-clip-text font-bold text-5xl text-transparent leading-tight md:text-7xl">
              Mamizu Cash
            </h1>

            {/* キャッチコピー・交渉力・サプライチェーン等のカッコつけた要素は削除済み */}
            <p className="mx-auto max-w-2xl text-foreground/80 text-lg leading-relaxed">
              規制準拠しながら残高を保護する企業向けプライバシー決済レイヤ。
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col justify-center gap-4 pt-8 sm:flex-row">
            <Button
              size="lg"
              className="bg-primary px-8 py-6 text-lg hover:bg-primary/90"
              asChild
            >
              <a href="/deposit">
                安全な送金を開始
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-secondary px-8 py-6 text-lg text-secondary hover:bg-secondary/10"
              asChild
            >
              <a href="/withdraw">
                支払いを受け取る
                <Download className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="py-20">
          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-primary/20 transition-colors duration-300 hover:border-primary/40">
              <CardHeader className="pb-2 text-center">
                <div className="mx-auto mb-4 w-fit rounded-full bg-primary/10 p-3">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">残高を保護</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  取引先や金額の相関を秘匿。競合他社に戦略を読み取られるリスクを排除
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-secondary/20 transition-colors duration-300 hover:border-secondary/40">
              <CardHeader className="pb-2 text-center">
                <div className="mx-auto mb-4 w-fit rounded-full bg-secondary/10 p-3">
                  <Users className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-xl">規制準拠＋監査可能</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  KYC/KYB認証済み参加者のみ。規制当局による監査が可能
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-accent/20 transition-colors duration-300 hover:border-accent/40">
              <CardHeader className="pb-2 text-center">
                <div className="mx-auto mb-4 w-fit rounded-full bg-accent/10 p-3">
                  <LinkIcon className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-xl">実務への組み込み</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  請求書やメールに支払いURLを添付。既存の業務フローに統合
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Credential Verification Section */}
        <section className="rounded-3xl bg-card/50 py-20">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-bold text-3xl md:text-4xl">
              双方の資格確認で安全性を担保
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              送金者・受取者の双方がMizuhiki
              SBT（個人）またはUNTI（法人）を必ず保有していなければ取引は成立しません。
              規制に従いながら不正利用を防止する仕組みです。
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {/* Individual Verification */}
            <Card className="group border-primary/20 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-fit rounded-full bg-primary/10 p-4 transition-colors group-hover:bg-primary/20">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl">
                  個人利用（Mizuhiki SBT）
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-center text-base">
                  個人向けKYC認証。Mizuhiki Verified SBTを取得することで、
                  プライベート取引への参加資格を得られます。
                </CardDescription>
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  asChild
                >
                  <a href="/get-mizuhiki">
                    Mizuhiki SBT取得
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Corporate Verification */}
            <Card className="group border-secondary/20 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-fit rounded-full bg-secondary/10 p-4 transition-colors group-hover:bg-secondary/20">
                  <Shield className="h-10 w-10 text-secondary" />
                </div>
                <CardTitle className="text-2xl">企業利用（UNTI）</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-center text-base">
                  ZK Email
                  DKIM証明による企業向けKYB認証。UNTI Credentialを取得し、
                  企業間取引で残高を保護します。
                </CardDescription>
                <Button
                  className="w-full border-secondary text-secondary hover:bg-secondary/10"
                  variant="outline"
                  asChild
                >
                  <a href="/get-unti">
                    UNTI Credential取得
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 rounded-xl bg-muted/50 p-6">
            <p className="text-center text-muted-foreground">
              <strong>重要:</strong>{' '}
              送金者・受取者の双方が有効な資格を持っていなければプライベート取引は完了しません。
              これにより規制遵守と不正利用防止を両立しています。
            </p>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-20 text-center">
          <h2 className="mb-4 font-bold text-3xl md:text-4xl">
            Japan Smart Chain Kaigan上で実現
          </h2>
          <p className="mx-auto mb-8 max-w-3xl text-lg text-muted-foreground">
            Mizuhikiがネイティブに存在し、Ethereum等価のため既存ツールチェーンをそのまま使用可能。
            オンショア検証のガバナンスが企業利用に説得力を与えています。
          </p>
          
          <h3 className="mb-8 font-semibold text-2xl">採用技術</h3>
          <div className="mx-auto max-w-4xl grid gap-6 md:grid-cols-3">
            <Card className="border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Tornado Cash Technology</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  業界標準のゼロ知識証明技術。取引のプライバシーを数学的に保証し、
                  規制当局への選択的開示も可能にする革新的なプロトコル
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="border-secondary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Mizuhiki SBT</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  個人の本人確認を実現するSoulbound Token。
                  一度発行されると譲渡不可能で、KYC認証状態を永続的に証明
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="border-accent/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">UNTI Credential</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  ZK Email技術を活用した企業認証システム。
                  DKIM署名を検証し、企業のドメイン所有権を暗号学的に証明
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}