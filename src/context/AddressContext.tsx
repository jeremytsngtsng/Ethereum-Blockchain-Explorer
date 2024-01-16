import React, {
  useState,
  createContext,
  useContext,
  ReactElement,
  ReactNode
} from 'react'

interface AddressContextType {
  address: string
  setAddress: React.Dispatch<React.SetStateAction<string>>
  gotAddressInfo: boolean
  setGotAddressInfo: React.Dispatch<React.SetStateAction<boolean>>
}

const AddressContext = createContext<AddressContextType | undefined>(undefined)

interface AddressProviderProps {
  children: ReactNode
}

export const AddressProvider = ({
  children
}: AddressProviderProps): ReactElement => {
  const [address, setAddress] = useState('')
  const [gotAddressInfo, setGotAddressInfo] = useState(false)

  return (
    <AddressContext.Provider
      value={{ address, setAddress, gotAddressInfo, setGotAddressInfo }}
    >
      {children}
    </AddressContext.Provider>
  )
}

export const useAddress = () => {
  const context = useContext(AddressContext)
  if (!context) {
    throw new Error('useAddress must be used within an AddressProvider')
  }
  return context
}
