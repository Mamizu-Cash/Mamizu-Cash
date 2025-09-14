"use client";

export function ConnectButton() {
  // @ts-expect-error - appkit-button is a Web Component from @reown/appkit
  return <appkit-button />;
}
