import NavBar from "../components/NavBar";
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import Search from "../components/Search";
import { TokenView } from '../components/TokenView';
import { useEffect, useState } from 'react';
import Loading from '../components/Loading';
import { MintWithMetadata, tryGetTokenMetaData } from '../utils/metaplex';
import styles from "../styles/Home.module.css"
import { tryGetPubKey, tryParseTokenMint } from '../utils/solana';

export default function Home() {
  const [mint, setMint] = useState<PublicKey>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tokenData, setTokenData] = useState<MintWithMetadata>();
  const [customDiv, setCustomDiv] = useState<JSX.Element>();
  const { connection } = useConnection();

  const mintPubKey = tryGetPubKey("o1Mw5Y3n68o8TakZFuGKLZMGjm72qv4JeoZvGiCLEvK");

  useEffect(() => {
    (async () => {
      if (!mintPubKey) { setIsLoading(false); return };
      const info = await connection.getAccountInfo(mintPubKey);
      if (!info || !info.data) { setIsLoading(false); return };
      const tokenMintData = await tryParseTokenMint(info.data, connection);
      if (!tokenMintData) { setIsLoading(false); return };
      const mintWithMeta = await tryGetTokenMetaData(connection, mintPubKey);
      setTokenData(mintWithMeta);
    })();
    document.body.style.backgroundColor = "#8bc34a";
  }, [connection]);
  return (
    <div className={styles.container}>
        <>
            {tokenData ? <>{customDiv ?? ''} <TokenView tokenData={tokenData} /></> :
                !isLoading ? <div className='mid-notice'>invalid mint</div> :
                    <div className="mid-notice"><Loading show={isLoading} text={'Loading . . . '} /></div>}
        </>
    </div>
  )
}
