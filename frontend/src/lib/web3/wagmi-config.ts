'use client'

import { createAppKit } from '@reown/appkit'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { QueryClient } from '@tanstack/react-query'
import { defineChain } from 'viem'

// JSC Kaigan Testnet configuration
const kaigan = defineChain({
  id: 5278000,
  name: 'JSC Kaigan Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [
        'https://rpc.kaigan.jsc.dev/rpc?token=QjxBt0CfU0eNzOHSJEvZA1FIzEK8hd2sJsosgP7TU0Q',
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'Kaigan Explorer',
      url: 'https://explorer.kaigan.jsc.dev',
    },
  },
  testnet: true,
}) satisfies AppKitNetwork

const projectId = 'ed9dfa4751a75de1df7c3d1db0d7ea71'
const networks = [kaigan] satisfies [AppKitNetwork, ...AppKitNetwork[]]

// AppKit主導で接続UXを管理
const wagmiAdapter = new WagmiAdapter({
  ssr: false,
  projectId,
  networks,
})

// wagmiはReactフック層だけに限定
export const wagmiConfig = wagmiAdapter.wagmiConfig

// AppKit（接続モーダル等）を起動
export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks,
  features: {
    email: false,
  },
  metadata: {
    name: 'Mamizu Cash',
    description: 'Privacy-focused transaction mixer on Kaigan',
    url: 'http://localhost:3000',
    icons: ['http://localhost:3000/icon.png'],
  },
})

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 3,
    },
  },
})
