import { useEffect, useState } from 'react'

import AddressInput from './AddressInput'

import './App.css'
import { useAlchemy } from 'context/AlchemyContext'
import { useAddress } from 'context/AddressContext'

const DEFAULT_TRANSFORM = 'scale(1)'

const AddressCard = () => {
  const [style, setStyle] = useState({
    transform: DEFAULT_TRANSFORM
  })
  const [enableTransform, setEnableTransform] = useState(
    window.innerWidth > 768
  )

  const { isFetching } = useAlchemy()
  const { gotAddressInfo, setGotAddressInfo, setAddress } = useAddress()

  const [tiltClass, setTiltClass] = useState('')

  const handleMouseMove = (event: {
    clientX: unknown
    clientY: unknown
    currentTarget: any
  }): void => {
    if (!enableTransform) return
    const { clientX: x, clientY: y, currentTarget: target } = event
    const rect = target.getBoundingClientRect()
    setStyle({
      transform: 'scale(1.01)'
    })
  }

  const handleMouseLeave = () => {
    if (gotAddressInfo) return
    setStyle({
      transform: DEFAULT_TRANSFORM
    })
  }

  useEffect(() => {
    if (gotAddressInfo) {
      setEnableTransform(false)
      setTiltClass('full-screen-animate')
      setStyle({
        ...style
      })
    } else {
      setEnableTransform(window.innerWidth > 768)
      setTiltClass('return-to-middle-animate')
      setStyle({
        ...style
      })
    }
  }, [gotAddressInfo])

  useEffect(() => {
    setTiltClass('')
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const shouldEnableTilt = window.innerWidth > 768
      setEnableTransform(shouldEnableTilt)

      if (!shouldEnableTilt) {
        setStyle({
          transform: DEFAULT_TRANSFORM
        })
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="absolute flex h-screen w-full flex-col justify-center px-4 sm:px-6 lg:px-8">
      <div
        onMouseMove={enableTransform ? handleMouseMove : undefined}
        onMouseLeave={enableTransform ? handleMouseLeave : undefined}
        style={{
          ...style
        }}
        className={`address-card card-shadow mt-4 rounded-xl bg-neutral-100/30 px-6 py-12  shadow-light ${
          isFetching ? 'isLoading' : ''
        }
              ${tiltClass}
              `}
      >
        <div className="flex items-center justify-between pb-4">
          <button
            onClick={() => {
              setGotAddressInfo(false)
              setAddress('')
            }}
          >
            <h1 className="truncate text-center text-2xl font-bold tracking-tight text-neutral-800 sm:text-3xl md:text-4xl">
              Ethereum Address Explorer
            </h1>
          </button>

          {/* <div className="cursor-pointer select-none rounded-xl bg-neutral-800/80 p-1 transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg">
            {!connected ? (
              <button
                onClick={handleConnectWallet}
                className="border-gray-300 p-2 md:p-3"
              >
                <FontAwesomeIcon
                  icon={faWallet}
                  className="text-md text-white md:text-xl"
                />
              </button>
            ) : (
              <div className="p-2 text-white md:p-3">
                {truncateAddress(walletAddress)}
              </div>
            )}
          </div> */}
        </div>

        <AddressInput />
      </div>
    </div>
  )
}

export default AddressCard
