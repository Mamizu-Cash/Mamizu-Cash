import { createFileRoute } from "@tanstack/react-router";
import { Activity, RefreshCw, RotateCcw, Settings, TrendingDown, TrendingUp } from "lucide-react";
import { useAccount } from "wagmi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ConnectButton } from "../components/ConnectButton";
import { useCounter } from "../hooks/useCounter";
import { CONTRACT_ADDRESSES } from "../lib/web3/contracts";

export const Route = createFileRoute("/counter")({
  component: CounterPage,
});

function CounterPage() {
  const { isConnected } = useAccount();
  const {
    count,
    increment,
    decrement,
    setCount,
    reset,
    isIncrementPending,
    isDecrementPending,
    isSetCountPending,
    isResetPending,
    isCountLoading,
    refetchCount,
  } = useCounter();

  const handleSetCount = () => {
    const newValue = prompt("Enter new count value:");
    if (newValue !== null && !Number.isNaN(Number(newValue))) {
      const value = BigInt(newValue);
      setCount(value);
    }
  };

  const isLoading =
    isCountLoading ||
    isIncrementPending ||
    isDecrementPending ||
    isSetCountPending ||
    isResetPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8">
      <div className="container mx-auto max-w-4xl space-y-8 px-4">
        {/* Header */}
        <Card className="border-0 bg-background/95 shadow-xl backdrop-blur">
          <CardHeader className="space-y-6 pb-8 text-center">
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary">
                <Activity size={40} className="text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <CardTitle className="bg-gradient-to-r from-primary to-secondary bg-clip-text font-bold text-3xl text-transparent">
                Counter Contract
              </CardTitle>
              <CardDescription className="text-lg">
                Interact with the Counter smart contract on Kaigan Chain
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        {/* Wallet Connection */}
        <Card className="border-0 bg-background/95 shadow-xl backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings size={20} />
              Wallet Connection
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ConnectButton />
          </CardContent>
        </Card>

        {/* Counter Interface */}
        {isConnected ? (
          <div className="space-y-6">
            {/* Counter Display */}
            <Card className="border-primary bg-primary/5 shadow-xl">
              <CardContent className="pt-8 text-center">
                <div className="mb-4">
                  <div className="mb-2 font-bold text-6xl text-primary">
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        Loading
                      </div>
                    ) : count !== undefined && count !== null ? (
                      count.toString()
                    ) : (
                      "--"
                    )}
                  </div>
                  <Badge variant="outline" className="border-primary text-primary">
                    Current Count
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Controls */}
            <Card className="border-0 bg-background/95 shadow-xl backdrop-blur">
              <CardHeader>
                <CardTitle className="text-center">Contract Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Button
                    onClick={increment}
                    disabled={isIncrementPending}
                    className="h-12 bg-primary hover:bg-primary/90"
                  >
                    <TrendingUp size={20} className="mr-2" />
                    {isIncrementPending ? "Incrementing..." : "Increment"}
                  </Button>

                  <Button
                    onClick={decrement}
                    disabled={isDecrementPending}
                    variant="outline"
                    className="h-12 border-primary text-primary hover:bg-primary/10"
                  >
                    <TrendingDown size={20} className="mr-2" />
                    {isDecrementPending ? "Decrementing..." : "Decrement"}
                  </Button>

                  <Button
                    onClick={handleSetCount}
                    disabled={isSetCountPending}
                    variant="outline"
                    className="h-12 border-secondary text-secondary hover:bg-secondary/10"
                  >
                    <Settings size={20} className="mr-2" />
                    {isSetCountPending ? "Setting..." : "Set Count"}
                  </Button>

                  <Button
                    onClick={reset}
                    disabled={isResetPending}
                    variant="outline"
                    className="h-12 border-secondary text-secondary hover:bg-secondary/10"
                  >
                    <RotateCcw size={20} className="mr-2" />
                    {isResetPending ? "Resetting..." : "Reset"}
                  </Button>

                  <Button
                    onClick={() => refetchCount()}
                    variant="outline"
                    className="h-12 border-secondary text-secondary hover:bg-secondary/10"
                  >
                    <RefreshCw size={20} className="mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Transaction Status */}
            {(isIncrementPending || isDecrementPending || isSetCountPending || isResetPending) && (
              <Alert className="border-warning bg-warning/10">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-warning border-t-transparent" />
                <AlertTitle className="text-warning-foreground">Transaction Pending</AlertTitle>
                <AlertDescription className="text-warning-foreground">
                  {isIncrementPending && "Increment transaction pending..."}
                  {isDecrementPending && "Decrement transaction pending..."}
                  {isSetCountPending && "Set count transaction pending..."}
                  {isResetPending && "Reset transaction pending..."}
                </AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          <Alert className="border-muted bg-muted/10">
            <AlertDescription className="text-center text-lg text-muted-foreground">
              Please connect your wallet to interact with the contract
            </AlertDescription>
          </Alert>
        )}

        {/* Contract Information */}
        <Card className="border-0 bg-background/95 shadow-xl backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity size={20} />
              Contract Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="font-semibold text-muted-foreground text-sm">
                  Contract Address
                </label>
                <div className="break-all rounded-lg border bg-muted/50 p-3 font-mono text-sm">
                  {CONTRACT_ADDRESSES.COUNTER}
                </div>
              </div>
              <div className="space-y-2">
                <label className="font-semibold text-muted-foreground text-sm">Network</label>
                <div className="rounded-lg border bg-muted/50 p-3">
                  <div className="font-semibold">JSC Kaigan Testnet</div>
                  <div className="text-muted-foreground text-sm">Chain ID: 5278000</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
