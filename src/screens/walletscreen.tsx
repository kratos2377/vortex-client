import React from 'react'
import WalletConnectionProvider from '../context/WalletConnectionProvider'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'



const WalletScreen = () => {

    const wallet = useWallet()

  return (
    <WalletConnectionProvider>
        <div className='bg-white-700'>
            <WalletMultiButton/>
        </div>
    </WalletConnectionProvider>
  )
}

export default WalletScreen