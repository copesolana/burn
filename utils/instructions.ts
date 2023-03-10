import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, TransactionInstruction } from "@solana/web3.js"
import { BurnBoardIdl, BurnScore } from "./idl"
import { Program,  } from "@project-serum/anchor"
import { ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { BN } from "bn.js"
import { FUNGIBLE_USER_SEED } from "./constants"
  
export async function createInitBurnAccountIx(
    burnBoardProgram: Program<BurnBoardIdl>,
    userPubkey: PublicKey,
    mintPubkey: PublicKey,
    userName: string, 
): Promise<TransactionInstruction> {
    const [BURN_SCORE] = await PublicKey.findProgramAddressSync(
        [Buffer.from(FUNGIBLE_USER_SEED), mintPubkey.toBytes(), userPubkey.toBytes()],
        burnBoardProgram.programId
      );
    const tx = await burnBoardProgram.methods
        .initFungibleUser(userName)
        .accountsStrict({
            newBurnScore: BURN_SCORE,
            signer: userPubkey,
            systemProgram: SystemProgram.programId,
            mint: mintPubkey
        })
        .instruction()

    return tx;  

}

export async function createBurnIx(
    burnBoardProgram: Program<BurnBoardIdl>,
    userPubkey: PublicKey,
    mintPubkey: PublicKey,
    amountToBurn: number, 
): Promise<TransactionInstruction> {
    const [BURN_SCORE] = await PublicKey.findProgramAddressSync(
        [Buffer.from(FUNGIBLE_USER_SEED), mintPubkey.toBytes(), userPubkey.toBytes()],
        burnBoardProgram.programId
      );
    const TOKEN_ACCOUNT = await getAssociatedTokenAddress(mintPubkey,userPubkey);

    const tx = await burnBoardProgram.methods
        .burnFungible(new BN(amountToBurn))
        .accountsStrict({
            mint: mintPubkey,
            tokenProgram: TOKEN_PROGRAM_ID,
            from: TOKEN_ACCOUNT,
            authority: userPubkey,
            burnScore: BURN_SCORE
        })
        .instruction()

    return tx;  

}
  
export async function fetchBurnAcctsByToken(
    burnBoardProgram: Program<BurnBoardIdl>,
    mint?:PublicKey,
    ) {
    const allBurnAccts = await burnBoardProgram.account.burnScore.all();
    if (!mint) return allBurnAccts;
    return allBurnAccts.filter(acct=> acct.account.mint.toBase58() == mint.toBase58());
}
  

  

