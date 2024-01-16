import React, { useState, useEffect } from 'react'
import { useAddress } from 'context/AddressContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimesCircle } from '@fortawesome/free-solid-svg-icons'

const AddressInput: React.FC = () => {
  const { address, setAddress } = useAddress()
  const [inputValue, setInputValue] = useState(address)
  const [isValid, setIsValid] = useState(true)

  useEffect(() => {
    if (typeof setAddress == 'function') {
      const timeoutId = setTimeout(() => {
        validateAddress(inputValue)
      }, 500)

      return () => clearTimeout(timeoutId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, setAddress])

  const validateAddress = (inputAddress: string): boolean => {
    const pattern = /^0x[a-fA-F0-9]{40}$/
    const valid = pattern.test(inputAddress) || inputAddress === ''

    setIsValid(valid)

    return valid
  }

  const inputAddressHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  if (typeof setAddress !== 'function') {
    throw new Error('AddressInput must be used within AddressProvider')
  }

  return (
    <>
      <div className="relative flex">
        <input
          type="text"
          value={inputValue}
          onChange={inputAddressHandler}
          placeholder="Enter Ethereum Address"
          className={`mt-1 block w-full truncate rounded-l-md border bg-neutral-600/20 px-3 py-2 text-neutral-900 placeholder:text-neutral-600 hover:bg-neutral-600/30 focus:bg-neutral-600/30 focus:outline-none focus:ring-1 ${
            isValid
              ? 'border-neutral-500 focus:border-neutral-500 focus:ring-neutral-500'
              : 'border-red-600 focus:border-red-600 focus:ring-red-600'
          }`}
        />
        {inputValue && (
          <button
            type="button"
            className="absolute right-16 top-7 -translate-y-1/2 bg-transparent text-white hover:text-gray-100"
            onClick={() => {
              setInputValue('')
              setAddress('')
              setIsValid(true)
            }}
            aria-label="Clear input"
          >
            <FontAwesomeIcon icon={faTimesCircle} className="text-lg" />
          </button>
        )}
        <button
          type="submit"
          className="mt-1 rounded-r-md bg-neutral-800 px-4 py-2 text-white hover:bg-neutral-800/80 focus:outline-none focus:ring"
          onClick={() => {
            const valid = validateAddress(inputValue)
            if (valid) {
              setAddress(inputValue)
            }
          }}
        >
          <FontAwesomeIcon
            icon={faSearch}
            className="text-sm text-white md:text-xl"
          />
        </button>
      </div>
      {!isValid && (
        <p className="text-red-600">Please enter a valid Ethereum address.</p>
      )}
    </>
  )
}

export default AddressInput
