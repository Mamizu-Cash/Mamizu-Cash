import { useAccount, useReadContract } from "wagmi";

const MIZUHIKI_SBT_ADDRESS = "0x606F72657e72cd1218444C69eF9D366c62C54978" as `0x${string}`;

// ERC721 の balanceOf ABI
const ERC721_ABI = [
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export function useMizuhikiSBT() {
  const { address: userAddress } = useAccount();

  const {
    data: sbtBalance,
    isLoading,
    error,
    refetch,
  } = useReadContract({
    address: MIZUHIKI_SBT_ADDRESS,
    abi: ERC721_ABI,
    functionName: "balanceOf",
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });

  return {
    hasSBT: (sbtBalance ?? 0n) > 0n,
    sbtBalance,
    isLoading,
    error,
    refetch,
  };
}

// 任意のアドレスのSBT確認
export function useCheckAddressSBT(targetAddress?: `0x${string}`) {
  const { data: balance } = useReadContract({
    address: MIZUHIKI_SBT_ADDRESS,
    abi: ERC721_ABI,
    functionName: "balanceOf",
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress,
    },
  });

  return {
    hasSBT: (balance ?? 0n) > 0n,
    balance,
  };
}
