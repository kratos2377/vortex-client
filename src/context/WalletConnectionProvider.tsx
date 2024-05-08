import React, { useMemo } from 'react'
import {
    ConnectionProvider,
    WalletProvider,
  } from '@solana/wallet-adapter-react'
  import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
  import { TorusWalletAdapter, PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { SOLANA_HOST } from '../utils/const'

interface WalletProps {
    children: JSX.Element | JSX.Element[] | string
}


const WalletConnectionProvider = ({ children }: WalletProps) => {
    const endpoint = useMemo(() => SOLANA_HOST, [])

    const wallets = useMemo(() => [new PhantomWalletAdapter() , new SolflareWalletAdapter() , new TorusWalletAdapter()], [])
  return (
    <ConnectionProvider endpoint={endpoint}>
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>{children}</WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
  )
}

export default WalletConnectionProvider