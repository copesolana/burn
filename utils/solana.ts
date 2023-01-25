import { Cluster, Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { BurnScoreWithPda } from "./idl";
import { publicKey, u64, bool } from '@solana/buffer-layout-utils';
import { u32, u8, struct } from '@solana/buffer-layout';
import { TokenListProvider } from "solana-token-list";

export function generateExplorerUrl(txId: string, cluster: Cluster = 'devnet', address?: string) {
  if (!address) return `https://explorer.solana.com/tx/${txId}/?cluster=${cluster}`;
  return `https://explorer.solana.com/address/${address}?cluster=devnet`
}

export async function getSolBalance(connection: Connection, wallet: PublicKey) {
  let balance = 0;
  try {
    balance = await connection.getBalance(
      wallet,
      'confirmed'
    );
    balance = balance / LAMPORTS_PER_SOL;
    console.log(`${wallet.toString()} balance: ${balance} SOL.`)
  } catch (e) {
    console.log(`error getting balance: `, e);
  }
  finally {
    return balance;
  }
}

export interface TokenAccounts {
  mintAddress: string,
  quantity: number
}

export async function getTokenBalance(wallet: PublicKey, solanaConnection: Connection, tokenMint: PublicKey) {
  const tokenAccounts = await solanaConnection.getTokenAccountsByOwner(
    wallet,
    { mint: tokenMint },
  )
  const balances = await Promise.all(tokenAccounts.value.map(async ({ pubkey }) => {
    const balance = await solanaConnection.getTokenAccountBalance(pubkey)
    return balance.value.uiAmount ?? 0
  }))

  return balances.reduce((acc, curr) => acc + curr, 0)
}

export const shortWallet = (pubkey: PublicKey): string => {
  const length = pubkey.toString().length;
  return `${pubkey.toString().substring(0, 5)}...${pubkey.toString().substring(length - 4)}`
}

export const calcTotalBurn = (burns: BurnScoreWithPda[]): number => {
  let result = 0;
  result = burns.reduce((partialSum, user) => partialSum + user.account.burnedTokens, 0)
  return result;
}

export const tryGetPubKey = (text: string): PublicKey | null => {
  try {
    return new PublicKey(text);
  }
  catch {
    return null;
  }
}

export const tryParseTokenMint = (accountInfo: Uint8Array, solanaConnection: Connection,): RawMint | null => {
  try {
    return MintLayout.decode(accountInfo);
  }
  catch {
    return null;
  }
}

// Mint Struct Info: 
// https://github.com/solana-labs/solana-program-library/blob/48fbb5b7c49ea35848442bba470b89331dea2b2b/token/js/src/state/mint.ts

/** Mint as stored by the program */
export interface RawMint {
  mintAuthorityOption: 1 | 0;
  mintAuthority: PublicKey;
  supply: bigint;
  decimals: number;
  isInitialized: boolean;
  freezeAuthorityOption: 1 | 0;
  freezeAuthority: PublicKey;
}


/** Buffer layout for de/serializing a mint */
export const MintLayout = struct<RawMint>([
  u32('mintAuthorityOption'),
  publicKey('mintAuthority'),
  u64('supply'),
  u8('decimals'),
  bool('isInitialized'),
  u32('freezeAuthorityOption'),
  publicKey('freezeAuthority'),
]);


export const tryGetRegistry = async (mint: PublicKey) => {
  const tokenListProvider = new TokenListProvider().resolve();
  const tokenList = (await tokenListProvider).filterByClusterSlug('mainnet-beta').getList();
  let result = tokenList.find(token=>token.address===mint.toString());
  return result;
}