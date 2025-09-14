import { createPublicClient, createWalletClient, defineChain, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

const KAIGAN_RPC_TOKEN = 'QjxBt0CfU0eNzOHSJEvZA1FIzEK8hd2sJsosgP7TU0Q';

export const kaigan = defineChain({
  id: 5278000,
  name: 'kaigan',
  nativeCurrency: { name: 'JETH', symbol: 'JETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://rpc.kaigan.jsc.dev/rpc'],
    },
    public: {
      http: ['https://rpc.kaigan.jsc.dev/rpc'],
    },
  },
  blockExplorers: {
    default: { name: 'Kaigan Explorer', url: 'https://explorer.kaigan.jsc.dev' },
  },
});

function createKaiganPublicClient() {
  return createPublicClient({
    chain: kaigan,
    transport: http(`https://rpc.kaigan.jsc.dev/rpc?token=${KAIGAN_RPC_TOKEN}`),
  });
}

/**
 * Given a Base Sepolia transaction hash, if it is a contract creation tx (to == null),
 * replays a similar creation on Kaigan by sending the same input data (and same value).
 * Returns the deployed contract address on Kaigan.
 */
export async function replayCreateOnKaigan(txHash: `0x${string}`): Promise<`0x${string}`> {
  if (typeof txHash !== 'string' || !txHash.startsWith('0x') || txHash.length !== 66) {
    throw new Error(`Invalid tx hash: ${txHash}`);
  }

  // 1) Fetch the source transaction from Base Sepolia
  const baseClient = createPublicClient({
    chain: baseSepolia,
    transport: http('https://sepolia.base.org'),
  });

  const tx = await baseClient.getTransaction({ hash: txHash });
  const isCreation = tx.to == null;
  if (!isCreation) {
    throw new Error('Provided transaction is not a contract creation (to != null)');
  }

  const input = (tx as any).input as `0x${string}` | undefined;
  const value = (tx as any).value as bigint | undefined;

  if (!input || input === '0x') {
    throw new Error('Creation tx has empty input (no init code)');
  }

  const sendValue = typeof value === 'bigint' ? value : 0n;

  // 2) Setup Kaigan wallet
  const DEPLOYER_PRIVATE_KEY = '0x65d7efd64916f2b857e9d8af652e4915e418620a2bc751a466471d139571cfad';
  const account = privateKeyToAccount(DEPLOYER_PRIVATE_KEY);

  const walletClient = createWalletClient({
    chain: kaigan,
    transport: http(`https://rpc.kaigan.jsc.dev/rpc?token=${KAIGAN_RPC_TOKEN}`),
    account,
  });

  const kaiganPublic = createKaiganPublicClient();

  // Optional: sanity balance check (non-fatal)
  try {
    const bal = await kaiganPublic.getBalance({ address: account.address });
    // eslint-disable-next-line no-console
    console.log(`[replay] Deployer ${account.address} balance on Kaigan: ${bal} wei`);
  } catch {
    // ignore
  }

  // 3) Estimate gas, then send
  let hash: `0x${string}`;
  try {
    const gasEstimate = await kaiganPublic.estimateGas({
      account: account.address,
      to: undefined,
      value: sendValue,
      data: input,
    });
    // eslint-disable-next-line no-console
    console.log(`[replay] Gas estimate: ${gasEstimate}`);
    hash = await walletClient.sendTransaction({
      account,
      to: undefined,
      value: sendValue,
      data: input,
      gas: gasEstimate,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[replay] Gas estimation failed, sending with fallback gas limit (5,000,000)...', e);
    hash = await walletClient.sendTransaction({
      account,
      to: undefined,
      value: sendValue,
      data: input,
      gas: 5_000_000n,
    });
  }

  // eslint-disable-next-line no-console
  console.log(`[replay] Sent tx on Kaigan: ${hash}`);
  // 4) Wait for receipt and return contract address
  let receipt: any = null;
  for (let i = 0; i < 60; i++) {
    try {
      receipt = await kaiganPublic.getTransactionReceipt({ hash });
      if (receipt) break;
    } catch {
      // ignore not found
    }
    await new Promise((res) => setTimeout(res, 2000));
  }

  if (!receipt || !receipt.contractAddress) {
    throw new Error('Replay deployment failed or receipt not found on Kaigan');
  }

  // eslint-disable-next-line no-console
  console.log(`[replay] Deployed on Kaigan at: ${receipt.contractAddress}`);
  return receipt.contractAddress as `0x${string}`;
}