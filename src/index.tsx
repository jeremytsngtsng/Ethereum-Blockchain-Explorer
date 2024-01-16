import { createRoot } from 'react-dom/client'
import 'tailwindcss/tailwind.css'
import App from 'components/App'
import { http, createConfig, WagmiProvider } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AlchemyProvider } from 'context/AlchemyContext'
import { AddressProvider } from 'context/AddressContext'

const container = document.getElementById('root') as HTMLDivElement
const root = createRoot(container)

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http()
  }
})

const queryClient = new QueryClient()

root.render(
  <AlchemyProvider>
    <AddressProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </WagmiProvider>
    </AddressProvider>
  </AlchemyProvider>
)
