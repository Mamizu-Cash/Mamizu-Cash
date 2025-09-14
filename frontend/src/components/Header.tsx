import { Link } from "@tanstack/react-router";
import { Award, Coins, Download, Menu, Shield, Upload, User, X } from "lucide-react";
import { useState } from "react";
import logo from "../logo.png";
import { ConnectButton } from "./ConnectButton";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-border/40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
            <img src={logo} alt="Mamizu Cash" className="h-8 w-8" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text font-bold text-transparent text-xl">
              Mamizu Cash
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">
                  <Shield className="mr-2 h-4 w-4" />
                  Privacy
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-6">
                    <div className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          to="/deposit"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        >
                          <Upload className="h-6 w-6" />
                          <div className="mt-4 mb-2 font-medium text-lg">Private Deposit</div>
                          <p className="text-muted-foreground text-sm leading-tight">
                            Shield your funds with zero-knowledge privacy
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/withdraw"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          <div className="font-medium text-sm leading-none">Secure Withdraw</div>
                        </div>
                        <p className="line-clamp-2 text-muted-foreground text-sm leading-snug">
                          Retrieve funds with complete anonymity
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent">
                  <Award className="mr-2 h-4 w-4" />
                  Credentials
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[600px] grid-cols-2 gap-3 p-6">
                    <NavigationMenuLink asChild>
                      <Link
                        to="/get-mizuhiki"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-primary" />
                          <div className="font-medium text-sm leading-none">Mizuhiki SBT</div>
                        </div>
                        <p className="line-clamp-2 text-muted-foreground text-sm leading-snug">
                          Individual KYC verification for private transactions
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/get-unti"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <Coins className="h-4 w-4 text-secondary" />
                          <div className="font-medium text-sm leading-none">UNTI Corporate</div>
                        </div>
                        <p className="line-clamp-2 text-muted-foreground text-sm leading-snug">
                          Business KYB verification via ZK Email DKIM
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/attestor"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-accent" />
                          <div className="font-medium text-sm leading-none">Attestor</div>
                        </div>
                        <p className="line-clamp-2 text-muted-foreground text-sm leading-snug">
                          Verify and issue UNTI credentials
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/profile"
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop Actions */}
          <div className="hidden items-center space-x-4 md:flex">
            <ConnectButton />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-border border-t md:hidden">
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Link
                  to="/"
                  className="flex items-center gap-2 rounded-md px-3 py-2 font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Coins className="h-4 w-4" />
                  Home
                </Link>
                <Link
                  to="/deposit"
                  className="flex items-center gap-2 rounded-md px-3 py-2 font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Upload className="h-4 w-4" />
                  Deposit
                </Link>
                <Link
                  to="/withdraw"
                  className="flex items-center gap-2 rounded-md px-3 py-2 font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Download className="h-4 w-4" />
                  Withdraw
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 rounded-md px-3 py-2 font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </div>
              <div className="border-border border-t pt-2">
                <div className="px-3 py-2">
                  <ConnectButton />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
