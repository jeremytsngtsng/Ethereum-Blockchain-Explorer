import React, { useEffect, useState } from 'react'
import './App.css'
import AddressCard from './AddressCard'
import { useAlchemy } from 'context/AlchemyContext'
import { useAddress } from 'context/AddressContext'
import AddressInfo from './AddressInfo'
import { Fade } from 'react-awesome-reveal'
import TokenBalance from './TokenBalance'
import NFTs from './NFTs'
import TransactionsList from './TransactionsList'

const App = () => {
  const {
    setIsFetching,
    tx,
    internalTx,
    nfts,
    ethBalance,
    tokenHoldings,
    fetchTx,
    fetchInternalTx: fetchInternaltx,
    fetchNfts,
    fetchEthBalance,
    fetchTokenHoldings,
    callNextPageNfts,
    callNextPageTx
  } = useAlchemy()
  const { address, gotAddressInfo, setGotAddressInfo } = useAddress()

  useEffect(() => {
    if (!address || address == '') return
    const fetchData = async () => {
      try {
        setGotAddressInfo(false)
        setIsFetching(true)
        await fetchTx(address, 10)
        await fetchInternaltx(address, 10)
        await fetchNfts(address, 10)
        await fetchEthBalance(address)
        await fetchTokenHoldings(address)
        setIsFetching(false)
        setGotAddressInfo(true)
      } catch (error) {
        console.error('Failed to fetch transaction history:', error)
      }
    }

    fetchData()
  }, [address])

  return (
    <div className={`bg-translucent-gradient overflow-y-auto xl:px-48`}>
      <div className="relative h-screen">
        <AddressCard />
        {gotAddressInfo && (
          <div className="absolute top-72 w-full px-4 sm:px-6 lg:px-8">
            <div className="flex h-auto w-full flex-col">
              <Fade
                triggerOnce
                delay={350}
                direction="up"
                duration={850}
                cascade
                damping={0.1}
              >
                <h1 className="font-sans text-2xl font-bold text-neutral-900 md:text-3xl">
                  Address Info
                </h1>
                <AddressInfo ethBalance={ethBalance} address={address} />
              </Fade>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="w-full">
                  <Fade
                    triggerOnce
                    delay={450}
                    direction="up"
                    duration={850}
                    cascade
                    damping={0.1}
                  >
                    <h1 className="font-sans text-2xl font-bold text-neutral-900 md:text-3xl">
                      Token Balance
                    </h1>
                    <TokenBalance tokens={tokenHoldings.tokens} />
                  </Fade>
                </div>
                <div className="w-full">
                  <Fade
                    triggerOnce
                    delay={450}
                    direction="up"
                    duration={850}
                    cascade
                    damping={0.1}
                  >
                    <h1 className="font-sans text-2xl font-bold text-neutral-900 md:text-3xl">
                      NFTs
                    </h1>
                    <NFTs nfts={nfts} getNextPage={callNextPageNfts} />
                  </Fade>
                </div>
              </div>
              <Fade
                triggerOnce
                delay={550}
                direction="up"
                duration={850}
                cascade
                damping={0.1}
              >
                <h1 className="font-sans text-2xl font-bold text-neutral-900 md:text-3xl">
                  Transactions
                </h1>
                <TransactionsList
                  transactions={tx}
                  getNextPage={callNextPageTx}
                />
              </Fade>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
