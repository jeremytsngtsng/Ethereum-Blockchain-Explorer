import React, { useEffect, useState } from 'react'
import { truncateAddress } from 'utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faCheck } from '@fortawesome/free-solid-svg-icons'

interface AddressInfoParam {
  ethBalance: string
  address: string
}

const AddressInfo = ({ ethBalance, address }: AddressInfoParam) => {
  const [displayAddress, setDisplayAddress] = useState(address)
  const [ethBalanceInEth, setEthBalanceInEth] = useState(
    parseFloat(ethBalance) / 1e18
  )
  const [isCopied, setIsCopied] = useState(false)

  const copyAddressToClipboard = async () => {
    if (displayAddress) {
      await navigator.clipboard.writeText(displayAddress)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 1000) // Reset the state after the animation
    }
  }

  return (
    <div className="my-4 flex w-full flex-col gap-4 space-y-2 rounded-xl bg-neutral-100/30 p-6 shadow-light md:grid-cols-3">
      <div className="text-center">
        <p className="flex items-center justify-center font-mono text-2xl font-thin text-neutral-900 md:text-3xl">
          <span className={isCopied ? 'bounce' : ''}>
            {truncateAddress(displayAddress)}
          </span>
          <button onClick={copyAddressToClipboard} className="pl-3">
            <FontAwesomeIcon
              icon={isCopied ? faCheck : faCopy}
              className={`md:text-md copy-icon text-sm text-neutral-800/60 hover:text-neutral-800/30 ${
                isCopied ? 'icon-animate' : ''
              }`}
            />
          </button>
        </p>
        <p className="bold text-sm text-neutral-900/80">Address</p>
        <div className="mx-auto mt-4 w-36 min-w-36 rounded-xl bg-neutral-800/30 pt-[2px]"></div>
      </div>
      <div className="text-center">
        <p className="font-mono text-2xl font-thin text-neutral-900 md:text-3xl">
          {ethBalanceInEth.toFixed(4)} ETH
        </p>
        <p className="bold text-sm text-neutral-900/80">ETH Balance</p>
      </div>
    </div>
  )
}

export default AddressInfo
