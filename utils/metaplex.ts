import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";
import { tryGetRegistry } from "./solana";

const min = new PublicKey('o1Mw5Y3n68o8TakZFuGKLZMGjm72qv4JeoZvGiCLEvK')

export const tryGetTokenMetaData = async(solanaConnection: Connection, mintAddress: PublicKey): Promise<MintWithMetadata> => {
    let result: MintWithMetadata = {mint: min};
    
    // First Populate with any registry data
    let registryData = await tryGetRegistry(min);
    if (registryData) {
        result.name = registryData.name;
        result.img = registryData.logoURI;
        result.symbol = registryData.symbol;
        result.decimals = registryData.decimals;
    }

    // Then override that data with metaplex metadata if it exists
    try {
        const METAPLEX = Metaplex.make(solanaConnection);
        const sft = await METAPLEX.nfts().findByMint({ mintAddress });
        if (sft.json && sft.json.image) {result.img = sft.json?.image;}
        if (sft.name) {result.name = sft.name;}
        if (sft.symbol) {result.symbol = sft.symbol;}
        if (sft.mint.decimals) {
            result.decimals = sft.mint.decimals;
            let supply = parseInt(sft.mint.supply.basisPoints.toString())/(10**result.decimals);
            result.supply = supply;
        }
        return result;
    } 
    catch {
        // If no new metadata found, just the registry data returned
        return result;
    }
}

export interface MintWithMetadata {
    mint: PublicKey,
    name?: string,
    symbol?: string, 
    img?: string,
    decimals?: number,
    supply?: any
}
