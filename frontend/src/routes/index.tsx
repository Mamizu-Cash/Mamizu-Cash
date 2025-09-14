import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Download, Link as LinkIcon, Shield, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "../logo.png";

export const Route = createFileRoute("/")({
  component: App,
});

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

            <p className="mx-auto max-w-3xl text-muted-foreground text-xl leading-relaxed md:text-2xl">
              Zero-knowledge privacy payments with enterprise compliance
            </p>

            <p className="mx-auto max-w-2xl text-foreground/80 text-lg leading-relaxed">
              Secure, compliant, and completely private cross-border transactions for businesses.
              Protect your commercial relationships while maintaining full regulatory compliance.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col justify-center gap-4 pt-8 sm:flex-row">
            <Button size="lg" className="bg-accent px-8 py-6 text-lg hover:bg-accent/90" asChild>
              <a href="/deposit">
                Start Private Transfer
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-primary px-8 py-6 text-lg text-primary hover:bg-primary/10"
              asChild
            >
              <a href="/withdraw">
                Receive Payment
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
                <CardTitle className="text-xl">Zero-Knowledge Privacy</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  Complete transaction unlinkability using advanced cryptographic proofs
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-secondary/20 transition-colors duration-300 hover:border-secondary/40">
              <CardHeader className="pb-2 text-center">
                <div className="mx-auto mb-4 w-fit rounded-full bg-secondary/10 p-3">
                  <Users className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-xl">Enterprise Compliant</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  KYC/KYB verified participants only. Fully auditable by regulators
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-accent/20 transition-colors duration-300 hover:border-accent/40">
              <CardHeader className="pb-2 text-center">
                <div className="mx-auto mb-4 w-fit rounded-full bg-accent/10 p-3">
                  <LinkIcon className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-xl">Simple Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  Share payment links via email, invoices, or QR codes seamlessly
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Credential Verification Section */}
        <section className="rounded-3xl bg-card/50 py-20">
          <div className="mb-16 text-center">
            <h2 className="mb-4 font-bold text-3xl md:text-4xl">Get Verified to Participate</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              To use Mamizu Cash, you need either a Mizuhiki SBT (individual) or UNTI credential
              (corporate). Choose your verification type below.
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {/* Individual Verification */}
            <Card className="group border-primary/20 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-fit rounded-full bg-primary/10 p-4 transition-colors group-hover:bg-primary/20">
                  <Users className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl">Individual (Mizuhiki SBT)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-center text-base">
                  Personal KYC verification for individual users. Get your Mizuhiki Verified SBT to
                  participate in private transactions.
                </CardDescription>
                <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                  <a href="/get-mizuhiki">
                    Get Mizuhiki SBT
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
                <CardTitle className="text-2xl">Corporate (UNTI)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-center text-base">
                  Business KYB verification through ZK Email DKIM proof. Get your UNTI credential
                  for enterprise transactions.
                </CardDescription>
                <Button
                  className="w-full border-secondary text-secondary hover:bg-secondary/10"
                  variant="outline"
                  asChild
                >
                  <a href="/get-unti">
                    Get UNTI Credential
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 rounded-xl bg-muted/50 p-6">
            <p className="text-center text-muted-foreground">
              <strong>Note:</strong> Both sender and receiver must have valid credentials to
              complete a private transaction. This ensures regulatory compliance and prevents
              misuse.
            </p>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-20 text-center">
          <h2 className="mb-4 font-bold text-3xl md:text-4xl">Built on Japan Smart Chain Kaigan</h2>
          <p className="mx-auto mb-8 max-w-3xl text-lg text-muted-foreground">
            Leveraging Ethereum-compatible infrastructure with native compliance features and
            onshore governance for enterprise adoption.
          </p>

          <Badge variant="outline" className="px-4 py-2 text-sm">
            Powered by: Tornado Cash Technology • Mizuhiki SBT • UNTI Credentials
          </Badge>
        </section>
      </div>
    </div>
  );
}
