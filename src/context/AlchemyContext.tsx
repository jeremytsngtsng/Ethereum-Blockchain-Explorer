import React, { createContext, useContext, useState } from 'react';
import {
  Alchemy,
  AssetTransfersCategory,
  AssetTransfersResponse,
  GetTokensForOwnerResponse,
  Network,
  OwnedNftsResponse
} from 'alchemy-sdk';

const settings = {
  apiKey: import.meta.env.VITE_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET
};
const alchemy = new Alchemy(settings);

interface AlchemyContextType {
  isFetching: boolean;
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
  tx: AssetTransfersResponse;
  internalTx: AssetTransfersResponse;
  ethBalance: string;
  nfts: OwnedNftsResponse;
  tokenHoldings: GetTokensForOwnerResponse;
  fetchTx: (address: string, limit?: number, pageKey?: string) => Promise<void>;
  fetchInternalTx: (
    address: string,
    limit?: number,
    pageKey?: string
  ) => Promise<void>;
  fetchNfts: (
    address: string,
    limit?: number,
    pageKey?: string
  ) => Promise<void>;
  fetchEthBalance: (address: string) => Promise<void>;
  fetchTokenHoldings: (address: string) => Promise<void>;
  callNextPageNfts: () => Promise<void>;
  callNextPageTx: () => Promise<void>;
}

const AlchemyContext = createContext<AlchemyContextType | undefined>(undefined);

export const AlchemyProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [nftsPageAddress, setNftsPageAddress] = useState<string>('');
  const [nftsPageSize, setNftsPageSize] = useState<number | undefined>(
    undefined
  );
  const [txPageAddress, setTxPageAddress] = useState<string>('');
  const [txPageSize, setTxPageSize] = useState<number | undefined>(undefined);
  const [tx, setTx] = useState<AssetTransfersResponse>({
    transfers: [],
    pageKey: undefined
  });
  const [internalTx, setInternalTx] = useState<AssetTransfersResponse>({
    transfers: [],
    pageKey: undefined
  });
  const [nfts, setNfts] = useState<OwnedNftsResponse>({
    ownedNfts: [],
    pageKey: undefined,
    totalCount: 0,
    validAt: {
      blockHash: '',
      blockNumber: 0,
      blockTimestamp: ''
    }
  });
  const [ethBalance, setEthBalance] = useState<string>('');
  const [tokenHoldings, setTokenHoldings] = useState<GetTokensForOwnerResponse>(
    {
      tokens: [],
      pageKey: undefined
    }
  );

  const callNextPageNfts = async () => {
    if (nfts.pageKey) {
      await fetchNfts(nftsPageAddress, nftsPageSize, nfts.pageKey);
    }
  };

  const callNextPageTx = async () => {
    if (tx.pageKey) {
      await fetchTx(txPageAddress, txPageSize, tx.pageKey);
    }
  };

  const fetchTx = async (address: string, limit?: number, pageKey?: string) => {
    try {
      const txs = await alchemy.core.getAssetTransfers({
        fromBlock: '0x0',
        toAddress: address,
        category: [AssetTransfersCategory.EXTERNAL],
        pageKey: pageKey,
        maxCount: limit
      });
      setTx(txs);
      setTxPageAddress(address);
      setTxPageSize(limit);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
    }
  };

  const fetchInternalTx = async (
    address: string,
    limit?: number,
    pageKey?: string
  ) => {
    try {
      const txs = await alchemy.core.getAssetTransfers({
        fromBlock: '0x0',
        toAddress: address,
        category: [AssetTransfersCategory.INTERNAL],
        pageKey: pageKey,
        maxCount: limit
      });
      setInternalTx(txs);
    } catch (error) {
      console.error('Error fetching internal transactions:', error);
    }
  };

  const fetchNfts = async (
    address: string,
    limit?: number,
    pageKey?: string
  ) => {
    try {
      const ownedNfts = await alchemy.nft.getNftsForOwner(address, {
        pageKey: pageKey,
        pageSize: limit
      });
      setNfts(ownedNfts);
      setNftsPageAddress(address);
      setNftsPageSize(limit);
    } catch (error) {
      console.error('Error fetching NFTs:', error);
    } finally {
    }
  };

  const fetchEthBalance = async (address: string) => {
    try {
      const balance = await alchemy.core.getBalance(address);
      setEthBalance(balance.toString());
    } catch (error) {
      console.error('Error fetching ETH balance:', error);
    }
  };

  const fetchTokenHoldings = async (address: string, pageKey?: string) => {
    try {
      const tokenHoldings = await alchemy.core.getTokensForOwner(address, {
        pageKey: pageKey
      });
      setTokenHoldings(tokenHoldings);
    } catch (error) {
      console.error('Error fetching token holdings:', error);
    }
  };

  const value = {
    isFetching,
    setIsFetching,
    tx,
    internalTx,
    nfts,
    ethBalance,
    tokenHoldings,
    fetchTx,
    fetchInternalTx,
    fetchNfts,
    fetchEthBalance,
    fetchTokenHoldings,
    callNextPageNfts,
    callNextPageTx
  };

  return (
    <AlchemyContext.Provider value={value}>{children}</AlchemyContext.Provider>
  );
};

export const useAlchemy = () => {
  const context = useContext(AlchemyContext);
  if (!context) {
    throw new Error('useAlchemy must be used within an AlchemyProvider');
  }
  return context;
};
